from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from Models import DecisionTreeModel, RandomForestModel, NaiveBayesModel
from Models import l1
from nearest_doctor import your_location,find_nearest_doctor

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

#push the app context
app.app_context().push()
# Create the database tables
db.create_all()

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

@app.route('/medicine')
def meds():
    return render_template('medicine.html')

@app.route('/doctor')
def doctor():
    all_doctors = Doctor.query.all()

    nearest_doctor, nearest_distance = find_nearest_doctor(user_latitude, user_longitude, all_doctors)
    latitude, longitude = your_location()
    all_doctors = Doctor.query.all()  # Retrieve all doctors from the database
    return render_template('doctor.html', latitude=latitude, longitude=longitude, all_doctors=all_doctors)

if __name__ == '__main__':
    app.run(debug=True, port=8080)
