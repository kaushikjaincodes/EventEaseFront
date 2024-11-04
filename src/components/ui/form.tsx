import React, { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "./lib/utils";
import { useAuth } from "./authContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./loadingSpinner";
import { BackgroundLines } from "./background-lines";

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [popupMessage, setPopupMessage] = useState(""); 
  const [showPopup, setShowPopup] = useState(false); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log(email + " " + password + " " + name);
    try {
      const response = await fetch("http://localhost:8080/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        setPopupMessage("Sign-up successful! Please log in to continue.");
      } else if (response.status === 501) {
        setPopupMessage("User already exists.");
      } else {
        setPopupMessage("Sign-up failed: " + data.message);
      }
      setShowPopup(true); 
    } catch (error) {
      console.error("Sign up error:", error);
      setPopupMessage("An error occurred. Please try again.");
      setShowPopup(true); 
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
        navigate("/home");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      {showPopup && (
        <SignUpPopup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
      <div className="max-w-[800px] w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black">
        <h2 className="font-bold text-xl text-white">Welcome to Event Ease</h2>
        <p className="text-neutral-400 text-sm max-w-sm mt-2">
          Login to Your account
        </p>
        <LabelInputContainer className="mb-4 mt-4">
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </LabelInputContainer>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="name.sur@sot.pdpu.ac.in"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>
          <div className="flex gap-3 justify-between">
            {loading ? (
              <div className="flex justify-center items-center w-full h-10 text-white font-medium">
                Loading...
              </div>
            ) : (
              <>
                <button
                  className="bg-[#18181b] relative group/btn from-black to-gray-700 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                  type="submit"
                >
                  Sign in
                </button>

                <button
                  className="bg-[#18181b] relative group/btn from-black to-gray-700 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                  type="button"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </form>
        <BottomGradient />
      </div>
    </>
  );
}
const SignUpPopup = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <>

      <div className="fixed inset-0 bg-black bg-opacity-75 z-40" onClick={onClose} />


      <div className="fixed inset-0 flex items-center justify-center z-50">
        <BackgroundLines className="bg-transparent flex items-center justify-center w-full px-4 -z-10">
          <div 
            className="bg-black rounded-lg p-4 w-80 text-center z-50" 
            onClick={(e) => e.stopPropagation()} 
          >
            <p className="mt-2 text-white">{message}</p>
            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </BackgroundLines>
      </div>
    </>
  );
};




const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);
