import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // <--- Added this import

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;
  
  const navigate = useNavigate(); // <--- Added this line to enable redirection

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Make sure this matches your PORT (5001)
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);
      
      console.log('Login Success:', res.data);
      
      // Save the token!
      localStorage.setItem('token', res.data.token);
      
      // Redirect to Dashboard
      navigate('/dashboard'); 
      
    } catch (err) {
      console.error(err);
      alert('Login Failed. Check your email/password.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input 
            type="email" 
            name="email" 
            value={email} 
            onChange={onChange} 
            className="w-full border p-2 rounded mt-1" 
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            onChange={onChange} 
            className="w-full border p-2 rounded mt-1" 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;