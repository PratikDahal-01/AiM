import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; // Ensure this is the correct path
import Items from '../components/Items'; // Ensure this is the correct path
import DoctorCard from '../components/DoctorCard'; // Ensure this is the correct path
import MapComponent from '../components/MapComponent'; // Ensure this is the correct path

function FindDoctor() {
    const [selectedBanner, setSelectedBanner] = useState(null); // State for banner selection
    const [allDoctors, setAllDoctors] = useState([]); // State for all doctors
    const [filteredDoctors, setFilteredDoctors] = useState([]); // State for doctors based on selected specialty
    const [isSelected, setIsSelected] = useState('All'); // Default selected specialty to show all
    const [clinics, setClinics] = useState([]); // State for storing fetched clinics

    // Fetch all doctors on component mount
    useEffect(() => {
        async function fetchDoctors() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/doctors`); // Adjust endpoint as needed
                const data = await response.json();
                setAllDoctors(data);
                setFilteredDoctors(data); // Initially set filtered doctors to all doctors
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        }
        fetchDoctors();
    }, []); // Empty dependency array to run on mount

    // Fetch clinics based on the selected specialty
    useEffect(() => {
        async function fetchClinics() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/clinics/${isSelected}`);
                const data = await response.json();
                setClinics(data);
            } catch (error) {
                console.error('Error fetching clinics:', error);
            }
        }
        if (isSelected !== 'All') {
            fetchClinics();
        }
    }, [isSelected]); // Dependency array will trigger the effect when isSelected changes

    // Handle specialist item click
    function handleItemClick(specialist) {
        setIsSelected(specialist);
        // Filter doctors based on selected specialty
        if (specialist === 'All') {
            setFilteredDoctors(allDoctors); // Show all doctors if "All" is selected
        } else {
            const filtered = allDoctors.filter(doctor => doctor.speciality === specialist);
            setFilteredDoctors(filtered);
        }
    }

    // Handle banner click for clinic or doorstep
    function handleBannerClick(banner) {
        setSelectedBanner(banner);
    }

    return (
        <div className='home-container'>
            <Navbar /> {/* Assuming Navbar component is already defined */}
            <div className='doctor-banner-container'>
                {/* Two banners for clinic and doorstep consultation */}
                <div className={`doctor-banner ${selectedBanner === 'clinic' ? 'selected-banner' : ''}`} onClick={() => handleBannerClick('clinic')}>
                    Book an Appointment for In-Clinic consultation.
                </div>
                <div className={`doctor-banner ${selectedBanner === 'doorstep' ? 'selected-banner' : ''}`} onClick={() => handleBannerClick('doorstep')}>
                    Book an Appointment for Doorstep Checkup.
                </div>
            </div>
            <div className='bottom-container'>
                <div className='specialist'>
                    <div className='section-title'>Specialists:</div>
                    <div className='item-container'>
                        {/* Include "All" as an option for displaying all doctors */}
                        {['All', 'Cardiology', 'Dermatology', 'Gastroenterology', 'Neurology', 'Oncology', 'Pediatrics', 'Psychiatry', 'Surgery', 'Other'].map((specialist, index) => (
                            <Items
                                key={index}
                                name={specialist}
                                onClick={() => handleItemClick(specialist)}
                                isSelected={isSelected === specialist}
                            />
                        ))}
                    </div>
                    {/* Render doctor cards based on selected speciality */}
                    <div className='doctor-card-container'>
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor, index) => {
                                // Construct the image path based on name and speciality
                                const imgSrc = `http://localhost:5000/uploads/${doctor.name.replace(/[^a-zA-Z0-9]/g, '_')}_${doctor.speciality.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
                                console.log('Image Source:', imgSrc); // Log the constructed path

                                return (
                                    <DoctorCard
                                        key={index}
                                        name={doctor.name}
                                        img={imgSrc} // Use the constructed image path
                                        speciality={doctor.speciality}
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent looping
                                            e.target.src = '/images/default_image.jpg'; // Fallback image
                                        }}
                                    />
                                );
                            })
                        ) : (
                            <div>No doctors found for the selected speciality.</div>
                        )}
                    </div>
                </div>

                <div className='section-title'>Clinics:</div>
                {/* Pass clinics to MapComponent to display clinic locations */}
                <MapComponent
                    clinics={clinics}
                    doctors={allDoctors}
                    selectedSpeciality={isSelected}
                />


                <div className='appointment-container'>
                    <div className='section-title'>Appointment Schedule:</div>
                    {/* Form for appointment scheduling */}
                    <form>
                        <input type="text" placeholder='Patient Name' required />
                        <input type="text" placeholder='Patient Phone Number' required />
                        <select id="time" name="time" required>
                            <option value="morning">9:00am - 10:00am</option>
                            <option value="noon">11:00am - 12:00pm</option>
                            <option value="evening">3:00pm - 5:00pm</option>
                            <option value="night">6:00pm - 8:00pm</option>
                        </select>
                        <button type="submit">Confirm Appointment</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FindDoctor;
