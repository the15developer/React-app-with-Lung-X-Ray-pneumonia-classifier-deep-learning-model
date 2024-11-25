# Lung X-Ray Pneumonia Classifier Web App

This project is a work-in-progress web application designed to classify lung X-rays as either "Normal" or "Pneumonia" using a deep learning model. The application features a React-based frontend and a Flask backend. The long-term goal is to expand the application to support additional pulmonary illnesses and provide a robust platform for both doctors and patients.

## Project Overview

### Current Features
- **Deep Learning Model**: 
  - The model is based on VGG16 and was trained on a Kaggle child chest X-rays dataset containing normal and pneumonia samples.
  - Achieved **93% test accuracy** after 30 epochs of training on Google Colab.
  - The trained model is integrated into the Flask backend for making predictions.
  
- **Backend**:
  - The Flask backend (`app.py`) defines an endpoint `/predict` that handles X-ray image submissions from the frontend, processes the image with the VGG16 model, and returns the classification result.

- **Frontend**:
  - A basic React interface for submitting X-ray images and displaying the prediction results.
  - Currently under development with plans to expand its functionality.
  
### Model File

The trained VGG16 model for this project is too large to be included in this repository. You can download the model from the following link:

[Download the model from Google Drive](the link will be added soon)

After downloading, place the model file in the `backend/models` directory.


### Planned Features
- User authentication and role-based login for **doctors** and **patients**.
- Individual dashboards and profiles for users.
- Database integration for storing user information, medical records, and prediction history.
- Support for additional models to classify X-rays for **COVID-19** and other pulmonary illnesses.
- Enhanced frontend with an improved user experience and additional tools for medical professionals.

## Technology Stack
- **Frontend**: React
- **Backend**: Flask (Python)
- **Deep Learning Model**: VGG16 (Keras/TensorFlow)
- **Model Training Environment**: Google Colab
- **Dataset**: [Child Chest X-Rays Dataset from Kaggle](https://www.kaggle.com) (Normal and Pneumonia classes)

## How It Works
1. A user uploads a chest X-ray through the React frontend.
2. The image is sent to the Flask backend (`/predict` endpoint).
3. The backend processes the image with the VGG16 model and returns the classification result.
4. The frontend displays the prediction result to the user.

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
