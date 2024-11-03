import React, { useState } from "react";
import { Button } from "./button";
import {EditIcon } from "lucide-react";

interface CardProps {
  title: string;
  dueDate: string;
  status : String;
  content: string;
}

const Card: React.FC<CardProps> = ({ title, dueDate, content, status }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">Due Date: {dueDate}</p>
          <p className="text-gray-500 text-sm">{status} </p>
        </div>
        <button onClick={toggleExpand} className="text-black">
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-3 text-gray-600">
          <p>{content}</p>
          <div className="flex justify-end">
          <Button className="m-2 flex items-center"><EditIcon /> Edit status</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
