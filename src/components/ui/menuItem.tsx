import React from "react";

interface MenuItemProps {
  label: string;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick }) => {
  return (
    <li
      className="p-4 hover:bg-gray-700 cursor-pointer"
      onClick={onClick}
    >
      {label}
    </li>
  );
};

export default MenuItem;
