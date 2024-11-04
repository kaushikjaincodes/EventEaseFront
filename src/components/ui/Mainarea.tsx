import React, { useState, useEffect } from "react";
import { Button } from "./button";
import AIChatDialog from "./AiChatDailouge";
import Card from "./cardStrip";
import { Input } from "./input";

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

interface FormData {
  name: string;
  desc: string;
  due_at: string;
  event_id: string;
  created_by: string;
  assigned_to: string[];
}

const MainContent: React.FC<{ 
  tasks: { id: string; title: string; description: string; dueDate: string; status: number; }[]; 
  eventId: string;
  userId: string;
  setTasks: (tasks: any[]) => void;
}> = ({ tasks, eventId, userId, setTasks }) => {
  console.log("EventId: " + eventId, "UserId: " + userId);
  const [submit1, setSubmit1] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    desc: '',
    due_at: '',
    event_id: eventId,
    created_by: userId,
    assigned_to: [],
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const fetchTasks = async () => {
    if (!eventId) return;
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

  useEffect(() => {
    fetchTasks(); 
  }, [eventId, submit1]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    
    const taskToSubmit = {
      ...formData,
      event_id: eventId, 
      created_by: userId 
    };

    console.log('Task Form submitted:', taskToSubmit);
    
    try {
      const response = await fetch('http://localhost:8080/api/task/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToSubmit), // Use the new object
      });

      if (response.ok) {
        setIsDialogOpen(false);
        setFormData({ 
          name: '', 
          desc: '', 
          due_at: '', 
          event_id: eventId, // Reset with the current values
          created_by: userId, // Reset with the current values
          assigned_to: [] 
        });
        await fetchTasks(); // Refresh tasks after adding a new one
      } else {
        console.error('Failed to create task:', response.status);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    } 
  };

  return (
    <div className="bg-neutral-900 flex-1 min-h-screen max-h-screen overflow-hidden transition-all duration-300 ease-in-out p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        <div className="flex items-center gap-5">
          <Button className="border border-gray-50 text-white hover:bg-gray-500" onClick={() => setIsAIChatOpen(true)}>Chat with AI</Button>
          <AIChatDialog 
            isOpen={isAIChatOpen} 
            onClose={() => setIsAIChatOpen(false)} 
          />
          <Button 
            className="bg-white text-black hover:bg-neutral-500"
            onClick={() => setIsDialogOpen(true)}
          >
            Add
          </Button>
        </div>
      </header>

      <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">
                Task Title
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
              <label htmlFor="due_at" className="block mb-1">
                Due Date
              </label>
              <Input
                type="date"
                id="due_at"
                name="due_at"
                value={formData.due_at}
                onChange={handleInputChange}
                className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label htmlFor="members" className="block mb-1">
                Assign to (comma-separated)
              </label>
              <Input
                type="text"
                id="members"
                name="members" 
                value={formData.assigned_to.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  assigned_to: e.target.value.split(',').map(member => member.trim())
                })} 
                className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white"
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-200 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </form>
      </Dialog>

      <div className="h-full max-h-[calc(100vh-96px)] overflow-hidden relative">
        <div 
          className="flex flex-col space-y-4 h-full pr-2 overflow-y-scroll relative
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar]:hidden
            hover:[&::-webkit-scrollbar]:block
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-gray-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
            [&::-webkit-scrollbar-thumb]:transition-colors
            [&::-webkit-scrollbar-thumb]:duration-200"
        >
          {tasks.map((task) => (
            <Card
              key={task.id}
              title={task.title}
              dueDate={new Date(task.dueDate).toLocaleDateString('en-GB')}
              content={task.description}
              status={task.status === 1 ? "Pending" : "Done"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;
