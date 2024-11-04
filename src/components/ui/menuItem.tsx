import React, { useState } from "react";

interface MenuItemProps {
  label: string;
  desc: string;
  enddate:string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ desc,label, onClick,enddate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return(
  <div onClick={onClick} className="cursor-pointer">
  <li className="p-4 hover:bg-gray-700 cursor-pointer">
    <div className="flex items-center justify-between">
      <h1 className="text-lg">{label}</h1>
      <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform duration-200 ${
            isExpanded ? 'rotate-90' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <p className="text-sm text-neutral-400 mt-2">{desc}</p>
      <p className="text-sm text-neutral-400 mt-2">Event Date: {formatDate(enddate)}</p>
    </div>
  </li>
</div>
);
};

export default MenuItem;
