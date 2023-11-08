from app import db, Doctor

# Sample data to import
sample_data = [
    {'id':1,'name': 'Mukesh', 'latitude': 18.643078, 'longitude': 73.766607},
    {'id':2,'name': 'Ramesh', 'latitude': 18.648934, 'longitude': 73.762850},
    {'id':3,'name': 'Ram', 'latitude': 18.651172, 'longitude': 73.758569},
    # Add more data as needed
]

# Create and add instances to the database session
for data in sample_data:
    doctor = Doctor(**data)
    db.session.add(doctor)

# Commit the changes to save the data to the database
db.session.commit()
