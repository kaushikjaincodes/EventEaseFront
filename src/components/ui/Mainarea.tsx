import React, { useState } from "react";
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

const MainContent: React.FC<{ tasks: { id: string; title: string; description: string; dueDate: string; status: number; }[] }> = ({ tasks }) => {
 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsDialogOpen(false);
    setFormData({ title: '', description: '', dueDate: '' });
  };


  return (
    <div className="bg-neutral-900 flex-1 min-h-screen max-h-screen overflow-hidden transition-all duration-300 ease-in-out p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
        <div className="flex items-center gap-5">
          <Button className="border border-gray-50  text-white hover:bg-gray-500" onClick={() => setIsAIChatOpen(true)}>Chat with AI</Button>
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
              <label htmlFor="title" className="block mb-1">
                Task Title
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
                Due Date
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