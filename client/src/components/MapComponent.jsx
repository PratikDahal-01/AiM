import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import Location from '../services/Location';

// Utility function to calculate distance between two lat/lon points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};

// Custom component to update map view dynamically
function UpdateMapView({ userLocation }) {
    const map = useMap(); // Access the map instance
    useEffect(() => {
        if (userLocation) {
            map.setView([userLocation.latitude, userLocation.longitude], 14); // Update map center and zoom
        }
    }, [userLocation, map]);
    return null;
}

function MapComponent({ clinics, doctors, selectedSpeciality }) {
    const [userLocation, setUserLocation] = useState(null);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [nearestDoctor, setNearestDoctor] = useState(null);

    const customIcon = new Icon({
        iconUrl: '/icons/pin2.png',
        iconSize: [38, 38]
    });

    const highlightedIcon = new Icon({
        iconUrl: '/icons/highlighted-pin.png', // Icon for the nearest doctor
        iconSize: [45, 45] // Slightly bigger size to highlight
    });

    const userLocationIcon = new Icon({
        iconUrl: '/icons/user-pin.png',
        iconSize: [38, 38]
    });

    // Filter doctors within 5 km radius of user location
    useEffect(() => {
        if (userLocation) {
            let filteredDoctors = doctors;

            // Filter by selected specialty if it's not 'All'
            if (selectedSpeciality && selectedSpeciality !== 'All') {
                filteredDoctors = doctors.filter(
                    (doctor) => doctor.speciality === selectedSpeciality
                );
            }

            const doctorsInRange = filteredDoctors.filter((doctor) => {
                const distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    doctor.latitude,
                    doctor.longitude
                );
                return distance <= 5; // Doctors within 5km
            });

            setFilteredDoctors(doctorsInRange);

            // Find the nearest doctor
            if (doctorsInRange.length > 0) {
                const nearest = doctorsInRange.reduce((prev, curr) => {
                    const prevDistance = calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        prev.latitude,
                        prev.longitude
                    );
                    const currDistance = calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        curr.latitude,
                        curr.longitude
                    );
                    return currDistance < prevDistance ? curr : prev;
                });
                setNearestDoctor(nearest);
            } else {
                setNearestDoctor(null);
            }
        }
    }, [userLocation, doctors, selectedSpeciality]);

    return (
        <div className='map'>
            {userLocation ? (
                <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={14} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />

                    {/* Update the map view when userLocation changes */}
                    <UpdateMapView userLocation={userLocation} />

                    {/* Render markers for filtered doctors */}
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor, index) => {
                            // Highlight the nearest doctor with a different icon
                            const isNearest = nearestDoctor && doctor.name === nearestDoctor.name;

                            return (
                                <Marker
                                    key={index}
                                    position={[doctor.latitude, doctor.longitude]}
                                    icon={isNearest ? highlightedIcon : customIcon} // Highlight the nearest doctor
                                >
                                    <Popup>
                                        {`${doctor.name} - ${doctor.speciality}`}
                                        {isNearest && <span> (Nearest)</span>} {/* Display label for the nearest doctor */}
                                    </Popup>
                                </Marker>
                            );
                        })
                    ) : (
                        <div>No doctors found within 5 km.</div>
                    )}

                    {/* Render user location marker */}
                    <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userLocationIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>

                    {/* Clinics marker */}
                    {clinics.map((clinic, index) => (
                        <Marker key={index} position={clinic.geocode} icon={customIcon}>
                            <Popup>{clinic.popUp}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            ) : (
                <p>Loading map...</p>
            )}

            {/* Get user location */}
            <Location onLocationChange={setUserLocation} />
        </div>
    );
}

export default MapComponent;
