import React, { useState, useRef } from "react";
import { Button } from "./button";
import { EditIcon } from "lucide-react";

interface CardProps {
  title: string;
  dueDate: string;
  content: string;
  updateTask: (id: string, status: number) => void;
  status: number; 
  id: string;
  users : string[]; 
}

const Card: React.FC<CardProps> = ({ id, title, dueDate, content, status, updateTask, users }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState<number>(status); 
  const contentRef = useRef<HTMLDivElement>(null);


  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };


  const handleStatusChange = () => {
    updateTask(id, newStatus);
    setIsEditing(false);
  };

 
  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 1: return "In Progress";
      case 2: return "Pending";
      case 0: return "Done"; 
      default: return "Unknown";
    }
  };

  const statusOptions = [
    { value: 2, label: "Pending" },
    { value: 1, label: "In Progress" }, 
    { value: 0, label: "Done" }, 
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">Due Date: {dueDate}</p>
          <p className="text-gray-500 text-sm">
            Status: {getStatusLabel(status)}
          </p>
        </div>
        <button onClick={toggleExpand} className="text-black">
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>
      <div
        ref={contentRef}
        className={`mt-3 text-gray-600 transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{ overflow: "hidden" }}
      >
        <p className="text-gray-400 mt-1">Assigned to: {users.join(", ")}</p>
        <p>Details: {content}</p>
        <div className="flex justify-end">
          {isEditing ? (
            <div className="flex items-center">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(Number(e.target.value))} 
                className="border rounded p-1 mr-2"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button onClick={handleStatusChange} className="m-2 flex items-center">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} className="m-2 flex items-center">
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="m-2 flex items-center">
              <EditIcon /> Edit status
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
