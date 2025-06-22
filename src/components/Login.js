import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Please enter your credentials to continue</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <label htmlFor="email">Email</label>
            <i className="fas fa-envelope input-icon"></i>
          </div>
          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <label htmlFor="password">Password</label>
            <i className="fas fa-lock input-icon"></i>
            <i 
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          <button type="submit" className="login-button">
            <i className="fas fa-sign-in-alt"></i> Sign In
          </button>
        </form>
        <div className="forgot-password">
          <Link to="/forgot-password">
            <i className="fas fa-key"></i> Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login; 