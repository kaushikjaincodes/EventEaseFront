import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { FlipWords } from './flip-words';
import { Input } from './input';
import MenuItem from './menuItem';
import { useNavigate } from 'react-router-dom';

const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-neutral-950 rounded-lg p-6 w-[425px] text-white"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface Event {
  _id: string;
  name: string;
  desc: string;
  start_date: string;
  end_date: string;
}

interface SidebarProps {
  userName: string;
  userId: string;
  setTasks: (tasks: any[]) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ userName, userId, setTasks }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const [words, setWords] = useState(['EventEase']);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (userName) {
      setWords((prevWords) => [...prevWords, "Hello " + userName + "!"]);
    }
  }, [userName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ title: '', description: '', dueDate: '' });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/event/info/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data.event_info);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleEventClick = async (eventId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/task/info/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        const formattedTasks = data.task_info.map((task: any) => ({
          id: task._id,
          title: task.name,
          description: task.desc,
          dueDate: task.updated_at,
          status: task.status,
        }));
        setTasks(formattedTasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div className="bg-black text-white w-64 h-screen flex flex-col relative group">
      <div className="text-2xl mb-5 mt-7">
        <FlipWords words={words} className="text-white" />
      </div>
      <div className="flex items-center justify-between pb-2 -top-14 pl-3 pr-2">
        <h2 className="text-xl">Events</h2>
        <Button className='bg-white text-black flex items-center hover:bg-neutral-500' onClick={() => setIsDialogOpen(true)}> + </Button>
        <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Add New Event</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block mb-1">
                  Event Title
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label htmlFor="dueDate" className="block mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors"
                >
                  Add Event
                </Button>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
      <ul className="h-full overflow-y-auto scrollbar-hidden group-hover:scrollbar-visible flex-grow">
        {events.map((event) => (
          <MenuItem
            key={event._id}
            label={event.name}
            desc={event.desc}
            enddate={event.end_date}
            onClick={() => handleEventClick(event._id)}
          />
        ))}
      </ul>
      <div className="p-2">
        <Button className="bg-white text-black hover:bg-neutral-500 w-full" onClick={()=>{logout();}} >Logout</Button>
      </div>
    </div>
  );
};

export default Sidebar;
