import React, { useState, useEffect} from 'react';
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
  members: string[];
}

interface SidebarProps {
  userName: string;
  userId: string;
  setEventId: (eventId: string) => void;
  setTasks: (tasks: any[]) => void; 
}

interface FormData {
  name: string;
  desc: string;
  end_date: string;
  user_id: string;
  members: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ userName, userId, setTasks, setEventId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    desc: '',
    end_date: '',
    user_id: '',
    members: [],
  });

  const [words, setWords] = useState(['EventEase']);
  const [events, setEvents] = useState<{ event: Event, usernames: string[] }[]>([]);
  const [submit, setSubmit] = useState(false);
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
    try {
      const response = await fetch('https://eventease-lksm.onrender.com/api/event/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmit(!submit);
        setIsDialogOpen(false);
        setFormData({ 
          name: '', 
          desc: '', 
          end_date: '', 
          user_id: '', 
          members: [] 
        });
      } else {
        console.error('Failed to create event:', response.status);
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`https://eventease-lksm.onrender.com/api/event/info/${userId}`, {
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
  }, [userId, submit]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      user_id: userId
    }));
  }, [userId]);

  const handleEventClick = async (eventId: string) => {
    setEventId(eventId);
    try {
      const response = await fetch(`https://eventease-lksm.onrender.com/api/task/info/${eventId}`, {
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

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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
                <label htmlFor="name" className="block mb-1">
                  Event Title
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label htmlFor="desc" className="block mb-1">
                  Description
                </label>
                <Input
                  type="text"
                  id="desc"
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label htmlFor="end_date" className="block mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label htmlFor="members" className="block mb-1">
                  Members (comma-separated)
                </label>
                <Input
                  type="text"
                  id="members"
                  name="members" 
                  value={formData.members.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    members: e.target.value.split(',').map(member => member.trim())
                  })} 
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
        {events.map((eventInfo) => (
          <MenuItem
            key={eventInfo.event._id}
            label={eventInfo.event.name}
            desc={eventInfo.event.desc}
            enddate={eventInfo.event.end_date}
            collaborators={eventInfo.usernames.join(', ')}  // Pass usernames as collaborators
            onClick={() => handleEventClick(eventInfo.event._id)}
          />
        ))}
      </ul>
      <div className="p-2">
        <Button className="bg-white text-black hover:bg-neutral-500 w-full" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

export default Sidebar;
