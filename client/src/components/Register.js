import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Note: We are hitting port 5001 where your server is running
      const res = await axios.post('http://localhost:5001/api/auth/register', formData);
      console.log('Registration Success:', res.data);
      alert('Registered Successfully! You can now login.');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error(err.response.data);
      alert('Error registering user');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={onChange} 
            className="w-full border p-2 rounded mt-1" 
            required 
          />
        </div>

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
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;