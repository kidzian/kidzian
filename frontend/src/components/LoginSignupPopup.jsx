import React, { useState } from "react";

function LoginSignupPopup({ onClose }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    age: "",
    grade: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token); // Save token for authentication
      onClose(); // Close popup
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleInputChange}
          required
        />
        {isSignup && (
          <>
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="grade"
              placeholder="Grade"
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleInputChange}
            />
          </>
        )}
        <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Already have an account? Log In" : "Sign up here"}
        </p>
      </form>
    </div>
  );
}

export default LoginSignupPopup;
