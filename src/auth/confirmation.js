import React, { useState } from "react";
import { Auth } from "aws-amplify";
import "../App.css";

const Confirmation = () => {
  //   const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");

  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // Handling the name change
  //   const handleName = (e) => {
  //     setName(e.target.value);
  //     setSubmitted(false);
  //   };

  // Handling the email change
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const code = 053236;
    if (!email) {
      setError(true);
    } else {
      const user = await Auth.confirmSignUp("test", email);
      console.log("user", user);
      setSubmitted(true);
      setError(false);
    }
  };

  // Showing success message
  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? "" : "none",
        }}
      >
        <h1>User successfully registered!!</h1>
      </div>
    );
  };

  // Showing error message if error is true
  const errorMessage = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? "" : "none",
        }}
      >
        <h1>Please enter all the fields</h1>
      </div>
    );
  };

  return (
    <div className="form">
      <div>
        <h1>User Login</h1>
      </div>

      {/* Calling to the methods */}
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>

      <form>
        {/* Labels and inputs for form data */}

        <label className="label">Confirmation Code</label>
        <input
          onChange={handleEmail}
          className="input"
          value={email}
          type="text"
        />

        <button onClick={handleSubmit} className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Confirmation;
