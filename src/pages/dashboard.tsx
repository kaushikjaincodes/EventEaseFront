import React from "react";
import Sidebar from "../components/ui/Sidebar";
import MainContent from "../components/ui/Mainarea";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <div className="flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

export default Dashboard;
