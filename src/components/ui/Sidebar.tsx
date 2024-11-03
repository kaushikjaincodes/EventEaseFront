import React, { useState } from 'react';
import { Button } from './button';
import { FlipWords } from './flip-words';
import { Input } from './input';
import MenuItem from './menuItem';

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




const Sidebar: React.FC = () => {
  const words = ['EventEase','Hello Kaushik!'];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
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
  
  const Events = [
    { id: 1, name: "Event 1" },
    { id: 2, name: "Event 2" },
    { id: 3, name: "Event 3" },
  ];

  return (
    <div className="bg-black text-white w-64 h-screen overflow-hidden relative group">
      <div className="text-2xl mb-5 mt-7"><FlipWords words={words} className="text-white" /> <br /></div>
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
                className="w-full border rounded p-2 bg-neutral-800 text-white border-neutral-700 focus:outline-none focus:border-white "
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
      <ul className="h-full overflow-y-auto scrollbar-hidden group-hover:scrollbar-visible">
        {Events.map((event) => (
          <MenuItem
            key={event.id}
            label={event.name}
            onClick={() => console.log(`Clicked ${event.id}`)}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
