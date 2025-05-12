# Lung X-Ray Pneumonia Classifier Web App - under development 

This project is a work-in-progress web application designed to classify lung X-rays as either "Normal" or "Pneumonia" and either "Normal" or "Covid-19" using 2 custom-trained deep learning models. The web application features a React-based frontend and a Flask backend, with MySQL database. The long-term goal is to expand the application to support additional pulmonary illnesses and provide a robust platform for both doctors and patients.

### Recently Added Features
- 👤 User login and registration system.
- 👨‍⚕️ Separate dashboards for doctors and patients, including profile and history views.
- 💬 Integrated real-time chat system using Socket.IO.
- 🔔 Audio notifications for incoming chat messages.

![image](https://github.com/user-attachments/assets/e7ccff85-cb83-43c7-9846-39cde16a3522)

![image](https://github.com/user-attachments/assets/dd54fcd5-24f1-4cc3-95ba-0a6d01fa4bce)

![image](https://github.com/user-attachments/assets/62bd5735-4683-44e5-a57c-c85947881c0c)

![image](https://github.com/user-attachments/assets/9f71e7b0-3e54-48a8-b038-0d53d283ae92)

![image](https://github.com/user-attachments/assets/8c0c0b13-f5ee-4380-86d6-9df286bc0c6b)



## Project Overview

### Current Features
- **Deep Learning Models**: 
  - The Pneumonia model is based on VGG16 and was trained on a Kaggle child chest X-rays dataset containing normal and pneumonia samples.
  - Achieved **93% test accuracy** after 30 epochs of training on Google Colab.
  - The trained model is integrated into the Flask backend for making predictions.
 
  - The Covid model is based on VGG16 and was trained on a Kaggle covid chest X-rays dataset containing normal and covid samples.
  - Achieved **96% test accuracy** after 30 epochs of training on Google Colab.
  - The trained model is integrated into the Flask backend for making predictions.
  
- **Backend**:
  - The Flask backend (`app.py`) defines an endpoint `/predict` that handles X-ray image submissions from the frontend, processes the image with the VGG16 model, and returns the classification result.

- **Frontend**:
  - A React interface for submitting X-ray images and displaying the prediction results; dashboard based on user role.
  - Currently under development with plans to expand its functionality.
  
### Model File

The trained VGG16 models for this project are too large to be included in this repository. You can download the models from the following link:

[Download the model from Google Drive](the link will be added soon)

After downloading, place the model file in the `backend/models` directory.


### Features
- User authentication and role-based login for **doctors** and **patients**.
- Individual dashboards and profiles for users.
- Database integration for storing user information, medical records, and prediction history.
- Enhanced frontend with an improved user experience and additional tools for medical professionals.

## Technology Stack
- **Frontend**: React
- **Backend**: Flask (Python)
- **Database** : MySQL & SQLAlchemy
- **Deep Learning Model**: VGG16 (Keras/TensorFlow)
- **Model Training Environment**: Google Colab
- **Messaging, chat functionality** : SocketIO

## Getting Started

### Prerequisites
- Node.js and npm installed for the React frontend.
- Python 3.x and Flask installed for the backend.
- A virtual environment is recommended for Python dependencies.

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # For Linux/Mac
   venv\Scripts\activate  # For Windows
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application
1. Start the Flask backend:
   ```bash
   cd backend
   flask run
   ```

2. Start the React frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the application.

## Plans
- Extend the backend to support multiple models for various pulmonary illnesses.
- Integrate a database (e.g., PostgreSQL or MongoDB) for user and prediction data.
- Add doctor and patient roles with unique dashboards and profiles.
- Deploy the application for public access.

## Contributing
Contributions are welcome! If you have ideas or improvements, please fork this repository and submit a pull request.
