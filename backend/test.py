from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import tensorflow
from PIL import Image
import numpy as np
import io

print("Imports successful")

# import tensorflow as tf
# print(tf.__version__)

# import keras
# print(keras.__version__)


model = load_model('best_vgg16_model.keras')  
print("Model loaded successfully")

print("Model Input Shape:", model.input_shape)


from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

test_dir = "C:/Users/Danny/OneDrive - ktun.edu.tr/Documents/Bitirme projesi/CHILD_XRAYS/chest_xray/test"


test_datagen = ImageDataGenerator(rescale=1.0/255)


test_generator = test_datagen.flow_from_directory(
    test_dir,
    target_size=(224, 224),  
    batch_size=32,          
    class_mode='binary',      
    shuffle=False
)


results = model.evaluate(test_generator)
print("Test Loss:", results[0])
print("Test Accuracy:", results[1])


