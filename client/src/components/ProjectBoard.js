import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaTrash, FaCommentAlt } from 'react-icons/fa'; // Added Comment Icon
import Navbar from './Navbar';
import TicketModal from './TicketModal'; // <--- Import Modal

const ProjectBoard = () => {
  const { id } = useParams();
  const [tickets, setTickets] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium' });
  
  // Day 10: Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  // Day 9: Modal State
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5001/api/tickets/project/${id}`, {
          headers: { 'x-auth-token': token }
        });
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, [id]);

  const onChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5001/api/tickets', { ...newTask, projectId: id }, {
        headers: { 'x-auth-token': token }
      });
      setTickets([...tickets, res.data]);
      setNewTask({ title: '', description: '', status: 'To Do', priority: 'Medium' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTicket = async (ticketId) => {
    if(!window.confirm("Delete ticket?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/api/tickets/${ticketId}`, { headers: { 'x-auth-token': token } });
      setTickets(tickets.filter(t => t._id !== ticketId));
    } catch (err) { console.error(err); }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTickets = tickets.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
    setTickets(updatedTickets);

    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5001/api/tickets/${draggableId}`, { status: destination.droppableId }, { headers: { 'x-auth-token': token } });
    } catch (err) { console.error(err); }
  };

  // --- DAY 10: FILTER LOGIC ---
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Project Board</h1>
          
          {/* Day 10: Search & Filter Inputs */}
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded w-64"
            />
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Add Ticket Form */}
        <div className="bg-white p-4 rounded shadow mb-8">
          <form onSubmit={onSubmit} className="flex gap-2 flex-wrap">
             <input name="title" value={newTask.title} onChange={onChange} placeholder="New Task Title" className="border p-2 rounded flex-1" required />
             <select name="priority" value={newTask.priority} onChange={onChange} className="border p-2 rounded">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
             </select>
             <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </form>
        </div>

        {/* Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(status => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="bg-gray-200 p-4 rounded-lg min-h-[500px]">
                    <h2 className="font-bold text-lg mb-4 text-gray-700">{status}</h2>
                    {filteredTickets.filter(t => t.status === status).map((ticket, index) => (
                      <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-3 rounded shadow mb-3 hover:shadow-md transition group relative"
                          >
                            <div className="flex justify-between items-start">
                                {/* Click Title to Open Modal */}
                                <h4 
                                  onClick={() => setSelectedTicket(ticket)} 
                                  className="font-bold cursor-pointer hover:text-blue-600"
                                >
                                  {ticket.title}
                                </h4>
                                <button onClick={() => deleteTicket(ticket._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 p-1">
                                  <FaTrash />
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs px-2 py-1 rounded inline-block ${
                                  ticket.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                  ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {ticket.priority}
                                </span>
                                {/* Comment Icon Trigger */}
                                <button onClick={() => setSelectedTicket(ticket)} className="text-gray-400 hover:text-blue-500 text-sm">
                                  <FaCommentAlt />
                                </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Day 9: The Modal */}
        {selectedTicket && (
          <TicketModal 
            ticket={selectedTicket} 
            onClose={() => setSelectedTicket(null)} 
          />
        )}

      </div>
    </div>
  );
};

export default ProjectBoard;