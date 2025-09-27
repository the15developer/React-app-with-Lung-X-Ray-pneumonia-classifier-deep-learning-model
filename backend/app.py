from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import create_access_token, JWTManager
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io
from flask_cors import CORS
from dotenv import load_dotenv
import os
import bcrypt
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import mysql.connector
from werkzeug.utils import secure_filename
from flask import send_from_directory

UPLOAD_FOLDER1 = 'backend/static/uploads_covid' 
UPLOAD_FOLDER2 = 'backend/static/uploads_pneumonia' 

os.makedirs(UPLOAD_FOLDER1, exist_ok=True)
os.makedirs(UPLOAD_FOLDER2, exist_ok=True)

load_dotenv()

PASSWORD = os.getenv("PASSWORD")
JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", 'fallback_secret_key')


db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': PASSWORD,
    'database': 'react_app_users'
}


app = Flask(__name__)
CORS(app)


app.config['SQLALCHEMY_DATABASE_URI'] = (
    f"mysql+pymysql://{db_config['user']}:{db_config['password']}"
    f"@{db_config['host']}/{db_config['database']}"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)  # No ForeignKey
    receiver = db.Column(db.String(100), nullable=False)  # No ForeignKey
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


socketio = SocketIO(app, cors_allowed_origins="*")  # allow all origins for now


app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY

jwt = JWTManager(app)

modelCovid = load_model("backend/model/vgg16_covid_model.keras")
modelPneumonia = load_model("backend/model/best_vgg16_model2.h5")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/uploads_covid/<filename>')
def uploaded_file_covid(filename):
    return send_from_directory(UPLOAD_FOLDER1, filename)


@app.route('/uploads_pneumonia/<filename>')
def uploaded_file_pneumonia(filename):
    return send_from_directory(UPLOAD_FOLDER2, filename)

@app.route('/create-user', methods=['POST'])
def create_user():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    if not email or not username or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = """
            INSERT INTO users (email, username, password) 
            VALUES (%s, %s, %s)
        """
        cursor.execute(query, (email, username, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'User created successfully'}), 201
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Failed to create user in the database'}), 500
    

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'All fields are required'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "SELECT id, password, role from users WHERE username = %s"
        cursor.execute(query, (username,))
        result=cursor.fetchone()

        if result is None :
            return jsonify({'error': 'Invalid username or password'}), 401
        
        user_id, stored_hashed_password, userrole = result

        if bcrypt.checkpw(password.encode('utf-8'), stored_hashed_password.encode('utf-8')):
            access_token=create_access_token(identity=username)
            return jsonify({'message': 'Login successful', 'token':access_token, 'username':username, 'user_id':user_id, 'userrole':userrole}), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({'error': 'Database error occurred'}), 500
    
    finally:
        cursor.close()
        conn.close()

@app.route('/predictC', methods=['POST'])
def predictCovid():
    
    if 'file' not in request.files or 'user_id' not in request.form:
        return jsonify({'error': 'Missing file or user ID'}), 400

    file = request.files['file']
    user_id = request.form['user_id']
    doctor_id = request.form.get('doctor_id')  # This may be None

    try:
       
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER1, filename)
        file.save(filepath)


        image = Image.open(file.stream).convert('RGB')
        image = image.resize((224, 224)) 
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0) / 255.0  


        prediction = modelCovid.predict(image)

        confidence = float(prediction[0][0])
        
        print("Raw prediction:", prediction)

        class_label = 'NORMAL' if confidence >= 0.5 else 'COVID-19'

        confidence_score = round(confidence * 100, 2)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        if doctor_id:
            cursor.execute(
                "INSERT INTO image_predictions (user_id, doctor_id, image_path, prediction_result) VALUES (%s, %s, %s, %s)",
                (user_id, doctor_id, filename, class_label)
            )
        else:
            cursor.execute(
                "INSERT INTO image_predictions (user_id, image_path, prediction_result) VALUES (%s, %s, %s)",
                (user_id, filename, class_label)
            )

        conn.commit()
        cursor.close()
        conn.close()

        print(class_label)

        return jsonify({'prediction': class_label, 'confidence': confidence_score})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    



# endpoint for model inference
@app.route('/predictP', methods=['POST'])
def predictPneumonia():
    
    if 'file' not in request.files or 'user_id' not in request.form:
        return jsonify({'error': 'Missing file or user_id'}), 400
    
    file = request.files['file']
    user_id = request.form['user_id']
    doctor_id = request.form.get('doctor_id') 

    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER2, filename)
        file.save(filepath)

        image = Image.open(file.stream).convert('RGB')
        image = image.resize((224, 224)) 
        image = img_to_array(image)
        image = np.expand_dims(image, axis=0) / 255.0  


        prediction = modelPneumonia.predict(image)

        confidence = float(prediction[0][0])

        print("Raw prediction:", prediction)
        
        class_label = 'PNEUMONIA' if prediction[0][0] > 0.5 else 'NORMAL'

        confidence_score = round(confidence * 100, 2)

        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        if doctor_id:
            print("Doctor id is present !")
            cursor.execute(
                "INSERT INTO image_predictions2 (user_id, doctor_id, image_path, prediction_result) VALUES (%s, %s, %s, %s)",
                (user_id, doctor_id, filename, class_label)
            )
        else:
            cursor.execute(
                "INSERT INTO image_predictions2 (user_id, image_path, prediction_result) VALUES (%s, %s, %s)",
                (user_id, filename, class_label)
            )

        conn.commit()
        cursor.close()
        conn.close()

        print(class_label)
        return jsonify({'prediction': class_label, 'confidence': confidence_score})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    

@app.route('/get_covid_predictions', methods=['GET'])
def get_covid_predictions():
    user_id = request.args.get('user_id')  
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT created_at, prediction_result FROM image_predictions WHERE user_id = %s ORDER BY created_at ASC", (user_id,))
    predictions = cursor.fetchall()
    conn.close()
    return jsonify(predictions)

@app.route('/get_pneumonia_predictions', methods=['GET'])
def get_pneumonia_predictions():
    user_id = request.args.get('user_id')  
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT created_at, prediction_result FROM image_predictions2 WHERE user_id = %s ORDER BY created_at ASC", (user_id,))
    predictions = cursor.fetchall()
    conn.close()
    return jsonify(predictions)

@app.route('/covid_history/<int:user_id>', methods=['GET'])
def get_prediction_covid_history(user_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT id, image_path, prediction_result, created_at
            FROM image_predictions
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(results), 200

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return jsonify({'error': 'Database error'}), 500

@app.route('/pneumonia_history/<int:user_id>', methods=['GET'])
def get_prediction_pneumonia_history(user_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT id, image_path, prediction_result, created_at
            FROM image_predictions2
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(results), 200

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return jsonify({'error': 'Database error'}), 500
    
@app.route('/doctors', methods=['GET'])
def get_doctors():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT id, username FROM users WHERE role = %s", ("doctor",))
   
    doctors = cursor.fetchall()

    conn.close()
    
    doctor_list = [{'id': doc['id'], 'username': doc['username']} for doc in doctors]
    return jsonify(doctor_list)

@app.route('/patients', methods=['GET'])
def get_patients():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT id, username FROM users WHERE role = %s", ("patient",))
    
    patients = cursor.fetchall()
    
    conn.close()
   
    patient_list = [{'id': pat['id'], 'username': pat['username']} for pat in patients]
    return jsonify(patient_list)

@app.route('/api/doctor/<int:doctor_id>/patients', methods=['GET'])
def get_patients_for_doctor(doctor_id):
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT u.id, u.username, u.name, u.level, u.description, u.profile_image
        FROM doctor_patient dp
        JOIN users u ON dp.patient_id = u.id
        WHERE dp.doctor_id = %s
    """, (doctor_id,))
    patients = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(patients)

@app.route('/api/patient/<int:patient_id>/doctor', methods=['GET'])
def get_doctor_for_patient(patient_id):
    conn = mysql.connector.connect(**db_config)
    cur = conn.cursor(dictionary=True)
    cur.execute("""
        SELECT u.id, u.username, u.name, u.level, u.description, u.profile_image
        FROM doctor_patient dp
        JOIN users u ON dp.doctor_id = u.id
        WHERE dp.patient_id = %s
    """, (patient_id,))
    doctor = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify(doctor)


@app.route('/api/patient/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT id, username, name, description, profile_image
            FROM users
            WHERE id = %s AND role = 'patient'
        """, (patient_id,))
        
        patient = cur.fetchone()

        cur.close()
        conn.close()

        if patient:
            
            if patient['profile_image'] and not patient['profile_image'].startswith('/'):
                patient['profile_image'] = '/' + patient['profile_image']

            return jsonify(patient)
        else:
            return jsonify({'error': 'Patient not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/doctor/<int:doctor_id>', methods=['GET'])
def get_doctor(doctor_id):
    try:
        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor(dictionary=True)

        cur.execute("""
            SELECT id, username, name, description, profile_image
            FROM users
            WHERE id = %s AND role = 'doctor'
        """, (doctor_id,))
        
        doctor = cur.fetchone()

        cur.close()
        conn.close()

        if doctor:
            
            if doctor['profile_image'] and not doctor['profile_image'].startswith('/'):
                doctor['profile_image'] = '/' + doctor['profile_image']

            return jsonify(doctor)
        else:
            return jsonify({'error': 'Doctor not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/patient-predictionsP')
def get_patient_predictionsP():
    doctor_id = request.args.get('doctor_id')
    user_id = request.args.get('user_id')

    if not doctor_id or not user_id:
        return jsonify([]), 400  # Bad request if parameters are missing

    try:
        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor(dictionary=True)

        query = """
            SELECT * FROM image_predictions2 
            WHERE doctor_id = %s AND user_id = %s 
            ORDER BY created_at DESC
        """
        cur.execute(query, (doctor_id, user_id))
        results = cur.fetchall()

        return jsonify(results), 200

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
        return jsonify({"error": "Database query failed"}), 500

    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()

@app.route('/api/patient-predictionsC')
def get_patient_predictionsC():
    doctor_id = request.args.get('doctor_id')
    user_id = request.args.get('user_id')

    if not doctor_id or not user_id:
        return jsonify([]), 400  # Bad request if parameters are missing

    try:
        conn = mysql.connector.connect(**db_config)
        cur = conn.cursor(dictionary=True)

        query = """
            SELECT * FROM image_predictions 
            WHERE doctor_id = %s AND user_id = %s 
            ORDER BY created_at DESC
        """
        cur.execute(query, (doctor_id, user_id))
        results = cur.fetchall()

        return jsonify(results), 200

    except mysql.connector.Error as err:
        print(f"MySQL Error: {err}")
        return jsonify({"error": "Database query failed"}), 500

    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()



# @app.teardown_appcontext

# def close_connection(exception):
#     if conn.is_connected():
#         cursor.close()
#         conn.close()
# Real-time communication
# @socketio.on('send_message')
# def handle_send_message(data):
#     print('Received message: ', data)
#     emit('receive_message', data, broadcast=True)  # broadcast to all clients

@socketio.on('send_message')
def handle_send_message(data):
    room = data['room']
    author = data['author']
    message = data['message']
    # time = data['time']
    doctor_username = data['doctor_username']
    patient_username = data['patient_username']

    if author == doctor_username:
        receiver = patient_username
    else:
        receiver = doctor_username

  
        
    msg=Message(
        room=room,
        author=author,
        receiver=receiver,
        content=message,
        # timestamp=datetime.strptime(time, '%Y-%m-%d %H:%M:%S') if time else datetime.utcnow()
        # timestamp=datetime.utcnow()
    )

    db.session.add(msg)
    db.session.commit()

   
    emit('receive_message', data, to=room)


    receiver_rooms = user_rooms.get(receiver, set())

    if room not in receiver_rooms:
        emit('receive_message', data, to=f"user_{receiver}")
    

   
    emit('notify_doctor', data, to=f"user_{doctor_username}")
    emit('notify_patient', data, to=f"user_{patient_username}")

user_rooms = {}  
@app.route('/get_messages', methods=['GET'])
def get_messages():
    print("Backend'de get messages tetiklendi")
   
    room = request.args.get('room')
    author = request.args.get('author')
    receiver = request.args.get('receiver')

    
    messages = Message.query.filter(
        (Message.room == room) &
        ((Message.author == author) & (Message.receiver == receiver) |
         (Message.author == receiver) & (Message.receiver == author))
    ).order_by(Message.timestamp).all()

    
    message_list = [{
        'author': msg.author,
        'receiver': msg.receiver,
        'message': msg.content,
        'time': msg.timestamp.isoformat(),  
    } for msg in messages]

    print(message_list)

    return jsonify(message_list)


@socketio.on('join_room')
def handle_join_room(data):
    username = data['username']
    room = data['room']
    join_room(room)
    print(f"User joined room: {room}")

    if username not in user_rooms:
        user_rooms[username] = set()
    user_rooms[username].add(room)


if __name__ == '__main__':
    app.run(debug=True)
