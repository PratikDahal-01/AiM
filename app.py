import json
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from Models import DecisionTreeModel, RandomForestModel, NaiveBayesModel
from Models import l1
from my_location import your_location
import math

app = Flask(__name__)

# Configure SQLAlchemy database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///doctors.db'  # Use SQLite for simplicity
db = SQLAlchemy(app)

# Define the Doctor model
class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/Disease_Prediction')
def disease_prediction():
    symptoms = l1
    return render_template('disease.html', symptoms=symptoms)

@app.route('/predict', methods=['POST'])
def predict():
    symptoms = [request.form['Symptom1'], request.form['Symptom2'], request.form['Symptom3'], request.form['Symptom4'], request.form['Symptom5']]

    # Machine learning model functions here
    dt_prediction = DecisionTreeModel(symptoms)
    rf_prediction = RandomForestModel(symptoms)
    nb_prediction = NaiveBayesModel(symptoms)

    return render_template('disease_predicted.html', symptoms=l1, dt_prediction=dt_prediction, rf_prediction=rf_prediction, nb_prediction=nb_prediction)

# Function to calculate the distance between two points using latitude and longitude
def haversine(lat1, lon1, lat2, lon2):
    # Radius of the Earth in kilometers
    radius = 6371.0

    # Convert latitude and longitude from degrees to radians
    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Calculate the distance
    distance = radius * c

    return distance

# Function to find the nearest doctor based on user's location
def find_nearest_doctor(user_latitude, user_longitude):
    nearest_doctor = None
    nearest_distance = float('inf')

    doctors = Doctor.query.all()

    for doctor in doctors:
        doctor_latitude = doctor.latitude
        doctor_longitude = doctor.longitude
        distance = haversine(user_latitude, user_longitude, doctor_latitude, doctor_longitude)

        if distance < nearest_distance:
            nearest_distance = distance
            nearest_doctor = doctor

    return nearest_doctor, nearest_distance

@app.route('/doctor')
def doctor():
    user_latitude, user_longitude = your_location()
    nearest_doctor, nearest_distance = find_nearest_doctor(user_latitude, user_longitude)

    all_doctors = Doctor.query.all()

    # Convert nearest_doctor to a dictionary
    nearest_doctor_dict = {
        'id': nearest_doctor.id,
        'name': nearest_doctor.name,
        'latitude': nearest_doctor.latitude,
        'longitude': nearest_doctor.longitude
    }

    # Convert all_doctors to a list of dictionaries
    all_doctors_list = [
        {
            'id': doctor.id,
            'name': doctor.name,
            'latitude': doctor.latitude,
            'longitude': doctor.longitude
        }
        for doctor in all_doctors
    ]

    nearest_doctors_json = json.dumps(nearest_doctor_dict)
    all_doctors_json = json.dumps(all_doctors_list)

    return render_template('nearest_doctor.html', latitude=user_latitude, longitude=user_longitude, all_doctors_json=all_doctors_json, nearest_doctors_json=nearest_doctors_json, nearest_distance=nearest_distance)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
