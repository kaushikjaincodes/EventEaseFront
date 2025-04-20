import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode, JwtPayload} from "jwt-decode"; // Import jwt-decode
import Sidebar from "../components/ui/Sidebar";
import MainContent from "../components/ui/Mainarea";


interface CustomJwtPayload extends JwtPayload {
  user_id: string;
}
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("")
  const [userid, setUserid] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]); 
  const [eventId, setEventId] = useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (token) {
      try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          // console.log("User ID decoded:", decoded);
          fetchUserInfo(decoded);
        }
      } catch (error) {
        console.error("Invalid token format", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    } else {
      // No token, navigate to login
      navigate("/");
    }
  }, [navigate]);

  const fetchUserInfo = async (decoded: CustomJwtPayload) => {
    try {
      console.log("UserId: "+decoded.user_id); // ignore ts ka issue hai error hai :)
      setUserid(decoded.user_id);
      const response = await fetch(`https://eventease-lksm.onrender.com/api/user/info/${decoded.user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      // console.log("User Info:", data);
      setUsername(data.name);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="flex overflow-hidden">
        <Sidebar userName={username} userId={userid} setTasks={setTasks} setEventId={setEventId}/>
        <MainContent tasks={tasks} eventId={eventId} userId={userid} setTasks={setTasks} />
      </div>
    </div>
  );
};

export default Dashboard;