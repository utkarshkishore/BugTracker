import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TicketModal = ({ ticket, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  // Fetch comments when modal opens
  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5001/api/comments/${ticket._id}`, {
          headers: { 'x-auth-token': token }
        });
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if(ticket) fetchComments();
  }, [ticket]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!text.trim()) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:5001/api/comments/${ticket._id}`, 
        { text }, 
        { headers: { 'x-auth-token': token } }
      );
      setComments([...comments, res.data]);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!ticket) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{ticket.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">✖</button>
        </div>
        
        <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded">{ticket.description || "No description provided."}</p>

        {/* Comments Section */}
        <h3 className="font-bold text-lg mb-3">Comments</h3>
        <div className="space-y-3 mb-4">
            {comments.length === 0 && <p className="text-gray-400 text-sm">No comments yet.</p>}
            {comments.map(c => (
              <div key={c._id} className="bg-blue-50 p-3 rounded text-sm">
                <div className="flex justify-between mb-1">
                    <span className="font-bold text-blue-800">{c.user ? c.user.name : "Unknown"}</span>
                    <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{c.text}</p>
              </div>
            ))}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={onSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..." 
              className="border p-2 rounded flex-1"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;