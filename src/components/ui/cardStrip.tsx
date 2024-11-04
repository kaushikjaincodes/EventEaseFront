import React, { useState, useRef } from "react";
import { Button } from "./button";
import { EditIcon } from "lucide-react";

interface CardProps {
  title: string;
  dueDate: string;
  status: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ title, dueDate, content, status }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null); // Create a ref for the content div

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-500 text-sm">Due Date: {dueDate}</p>
          <p className="text-gray-500 text-sm">{status}</p>
        </div>
        <button onClick={toggleExpand} className="text-black">
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>
      <div
        ref={contentRef}
        className={`mt-3 text-gray-600 transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ overflow: "hidden" }} // Ensure content is hidden when collapsed
      >
        <p>{content}</p>
        <div className="flex justify-end">
          <Button className="m-2 flex items-center">
            <EditIcon /> Edit status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
