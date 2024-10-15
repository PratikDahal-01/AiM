import React, { useState } from "react";
import axios from "axios"; // For making HTTP requests to Flask backend

const DoctorRegistrationForm = () => {
  // State variables to track form data
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    speciality: "",
    gender: "male", // Default value
    contact: "",
    address: "",
    email: "",
    password: "",
    customSpeciality: "", // To handle custom speciality input
    photo: null, // State to hold the photo file
  });

  // State to store any success or error messages
  const [message, setMessage] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({
        ...formData,
        photo: e.target.files[0], // Save the file to the state
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Update the speciality based on whether "Other" is selected
    const finalSpeciality = formData.speciality === "Other" ? formData.customSpeciality : formData.speciality;

    const updatedFormData = new FormData(); // Use FormData to handle file uploads
    updatedFormData.append("name", formData.name);
    updatedFormData.append("department", formData.department);
    updatedFormData.append("speciality", finalSpeciality);
    updatedFormData.append("gender", formData.gender);
    updatedFormData.append("contact", formData.contact);
    updatedFormData.append("address", formData.address);
    updatedFormData.append("email", formData.email);
    updatedFormData.append("password", formData.password);
    updatedFormData.append("photo", formData.photo); // Add the photo file

    try {
      // Make POST request to Flask server
      const response = await axios.post("http://127.0.0.1:5000/register_as_doctor", updatedFormData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type for file upload
        },
      });
      if (response.data.success) {
        setMessage("Doctor registered successfully!");
      } else {
        setMessage("Error registering doctor: " + response.data.message);
      }
    } catch (error) {
      console.error("There was an error submitting the form:", error);
      setMessage("There was an error submitting the form: " + error.message);
    }
  };

  return (
    <div>
      <h1>Doctor Registration</h1>

      {/* Display messages (success or error) */}
      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="department">Department:</label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="speciality">Speciality:</label>
        <select
          id="speciality"
          name="speciality"
          value={formData.speciality}
          onChange={handleChange}
          required
        >
          <option value="">Select a speciality</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Gastroenterology">Gastroenterology</option>
          <option value="Neurology">Neurology</option>
          <option value="Oncology">Oncology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Surgery">Surgery</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <br />

        {/* Text area for custom speciality */}
        {formData.speciality === "Other" && (
          <>
            <label htmlFor="customSpeciality">Please specify your speciality:</label>
            <textarea
              id="customSpeciality"
              name="customSpeciality"
              value={formData.customSpeciality}
              onChange={handleChange}
              required
              placeholder="Enter your speciality"
            ></textarea>
            <br />
            <br />
          </>
        )}

        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br />
        <br />

        <label htmlFor="contact">Contact Information:</label>
        <input
          type="tel"
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="address">Address:</label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Line 1, City"
          required
        ></textarea>
        <br />
        <br />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        {/* File input for photo upload */}
        <label htmlFor="photo">Upload Photo:</label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*" // Accepts image files only
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <button type="submit">Register</button>
      </form>

      {/* Login Redirect Button */}
      <button onClick={() => (window.location.href = "/login")}>
        To Login
      </button>
    </div>
  );
};

export default DoctorRegistrationForm;
