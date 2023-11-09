import React, { useContext, useState } from "react";
import UserContext from "../../contexts/UserContext";
import "./AuthForm.css";

import { Button } from "react-bootstrap";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthForm = () => {
  const { user, setUser } = useContext(UserContext);

  // toggle between login and register
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${BASE_URL}auth/${isLogin ? "login" : "register"}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setUser({
          account_number: data.account_number,
          user_id: data.user_id,
          username: data.username,
          // Any other user info you want to store in context
        });
      } else {
        // Handle errors here
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="auth-form-container">
      <h1>Banksy</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            required
            onChange={handleInputChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          required
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="true"
          required
          value={formData.password}
          onChange={handleInputChange}
        />
        <Button variant="success" type="submit">
          {isLogin ? "Login" : "Register"}
        </Button>
        <Button variant="primary" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need to create an account?" : "Already have an account?"}
        </Button>
      </form>
    </div>
  );
};
