from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = load_model("backend/model/best_vgg16_model.keras")

@app.route('/')
def home():
    return render_template('index.html')

# endpoint for model inference
@app.route('/predict', methods=['POST'])
def predict():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    image = Image.open(file.stream).convert('RGB')
    image = image.resize((224, 224)) 
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0) / 255.0  


    prediction = model.predict(image)
    class_label = 'pneumonia' if prediction[0][0] > 0.5 else 'normal'

    print(class_label)
    return jsonify({'prediction': class_label})

if __name__ == '__main__':
    app.run(debug=True)
