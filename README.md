# AI-Powered Web Application for COVID-19 & Pneumonia Detection

## 📌 Project Overview

This project is a **web-based diagnostic system** designed to automatically detect **COVID-19** and **pneumonia** from chest X-ray images using deep learning models.

Users can log in to the platform, upload X-ray scans, and instantly view disease prediction results along with model confidence scores. The system also includes a **real-time messaging feature** that enables seamless communication between doctors and patients, making the experience interactive and accessible.

The ultimate goal of this project is to provide a **fast, user-friendly, and AI-assisted healthcare evaluation platform**.

---

## Doctor & Patient Dashboards 

<img width="1919" height="881" alt="Screenshot 2025-05-30 075959" src="https://github.com/user-attachments/assets/913d95f0-bef1-4e26-9b59-b8e1abf57daf" />


<img width="1919" height="910" alt="Screenshot 2025-05-30 072823" src="https://github.com/user-attachments/assets/3344e3b1-a873-4d2d-98fd-905e2703e8b5" />


## Detection Module 

<img width="1904" height="888" alt="Screenshot 2025-05-30 080105" src="https://github.com/user-attachments/assets/c0ea7830-f344-4547-be39-f2a484dabbeb" />

<img width="1902" height="908" alt="Screenshot 2025-05-11 215516" src="https://github.com/user-attachments/assets/81122353-aaa9-4008-8646-15faee5dfc6d" />


<img width="1902" height="889" alt="Screenshot 2025-05-11 215533" src="https://github.com/user-attachments/assets/3a1f24a8-36f3-4c82-9368-77bddd46d2db" />

## Chat Module 

<img width="464" height="597" alt="Screenshot 2025-05-30 072723" src="https://github.com/user-attachments/assets/0d278027-0120-462e-8165-414f04389023" />

## Login Module

<img width="1918" height="888" alt="Screenshot 2025-05-11 215552" src="https://github.com/user-attachments/assets/203e2065-1ffc-4fbd-b170-ec6935cbc5c3" />

## Deep Learning Models Accuracy Results and Confusion Matrixes 

<img width="583" height="744" alt="Screenshot 2025-05-30 070949" src="https://github.com/user-attachments/assets/64c9259e-930d-4bd6-ae25-bfe6ef96b7bb" />
<img width="428" height="668" alt="Screenshot 2025-05-30 070858" src="https://github.com/user-attachments/assets/c09cc414-8c83-4dc1-ad13-e1b6142b9b83" />



## Features

* 🩻 **Automatic disease detection** (COVID-19 & Pneumonia) via deep learning trained models
* 👨‍⚕️🙋🏻‍♂️ **Role-based access** for doctors and patients
* 📊 **Dashboard** with prediction history, health summaries, and tips
* 💬 **Real-time doctor-patient chat** powered by Socket.IO, with audio and visual notifications
* 🔐 **Data security** with bcrypt password hashing & JWT authentication
* 🌐 **Web-based interface** accessible from any device

---

## 🧠 Deep Learning Models

* Two dedicated models: one for **COVID-19** and one for **Pneumonia**
* Trained on chest X-ray datasets using **Google Colab**
* Built with **TensorFlow** and **transfer learning**
* Architectures: **VGG16** and **ResNet**
* Achieved **93–96% accuracy** on validation sets
* Integrated into Flask backend for real-time predictions

---

## 🏗️ Tech Stack

### Frontend

* React.js
* HTML, CSS, JavaScript

### Backend

* Python (Flask)
* MySQL Database
* Socket.IO (real-time communication)

### Deep Learning

* TensorFlow
* Transfer Learning (VGG16, ResNet)
* Data preprocessing & augmentation

### Security

* bcrypt (password hashing)
* JWT (JSON Web Token) authentication

---

## 📂 System Workflow

1. User logs in (doctor or patient role).
2. Patient uploads chest X-ray image.
3. Backend runs AI models and returns prediction + confidence score.
4. Doctors can view patient history, assign new predictions, and communicate directly.
5. Patients can see past predictions in **tables & charts** and receive health tips.
6. Doctor-patient chat enables real-time interaction.

---

## 📦 Materials & Tools

* Chest X-ray datasets (COVID-QU-Ex, Pneumonia datasets)
* TensorFlow library
* Google Colab platform
* VGG16 & ResNet architectures
* Flask backend
* MySQL database
* Socket.IO (messaging)
* React.js frontend

---

## 📑 Methods

1. Data preprocessing & augmentation
2. Transfer learning approach
3. Model training & validation (COVID-19 & Pneumonia)
4. Model integration into Flask backend
5. Web application development (React + Flask)
6. Real-time chat implementation
7. Database design & management

---

## 🔒 Security Measures

* Passwords are hashed with **bcrypt** before storage
* Authentication handled via **JWT tokens**
* Secure access control for different user roles
* Confidentiality maintained for medical data

---

## 🎯 Conclusion

This project integrates **deep learning, medical imaging, web technologies, real-time communication, and data security** into a single system. It demonstrates how AI can support modern healthcare by providing fast and reliable diagnostic assistance while fostering patient-doctor interaction.

The platform represents a strong **prototype for clinical use** and an excellent example of interdisciplinary collaboration between software engineering, AI, and healthcare.

---
