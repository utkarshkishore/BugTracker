import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login Success:', res.data);
      alert('Login Success! Token received.');
    } catch (err) {
      console.error(err);
      alert('Login Failed');
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
      </form>
    </div>
  );
};

export default Login;