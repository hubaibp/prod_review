import React, { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userRegister } from "../api/fetchApi";

function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const formSubmit = () => {
    const { username, email, password } = user;
    if (!username || !email || !password) {
      toast.error("Invalid Input!");
    } else {
      userRegister(user).then((res) => {
        toast.success("User Registration Successful!");
        navigate("/login");
      });
    }
  };

  return (
    <div className="container w-50 mt-5 text-center">
      <h1>Register</h1>
      <FloatingLabel
        controlId="floatingUsername"
        label="Username"
        className="mb-3"
      >
        <Form.Control
          type="text"
          placeholder="abc"
          onChange={(e) => {
            setUser({ ...user, username: e.target.value });
          }}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
        <Form.Control
          type="email"
          placeholder="abc@gmail.com"
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
          }}
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password">
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
          }}
        />
      </FloatingLabel>
      <div className="d-flex justify-content-around mt-3 mb-5">
        <button className="btn btn-info" onClick={formSubmit}>
          Register
        </button>
        <Link to={"/login"} style={{ textDecoration: "none" }}>
          Already a User? Login here
        </Link>
      </div>
    </div>
  );
}

export default Register;
