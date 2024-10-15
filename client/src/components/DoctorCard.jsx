import React from 'react';
import styles from './DoctorCard.module.css'; // Importing the CSS module

function DoctorCard(props) {
  return (
    <div className={styles.doctorCard}>
        <img
          src={props.img}
          alt={props.name}
          className={styles.doctorImage}
          onError={(e) => { e.target.src = '/images/default_image.jpg'; }} // Fallback image
        />
        <div className={styles.doctorName}>{props.name}</div>
        <div className={styles.doctorSpeciality}>{props.speciality || props.price}</div>
    </div>
  );
}

export default DoctorCard;
