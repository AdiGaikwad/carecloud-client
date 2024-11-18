import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

const Logout = () => {
  const StartLogout = ()=>{
    if(window){
      if(window.localStorage.getItem("token")) window.localStorage.removeItem("token")
      document.cookie = "token= ; path=/"
      window.location.reload()
      }
  }
  return (
    <Button onClick={() => StartLogout()} variant="ghost" size="sm" className="text-red-600">
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
};

export default Logout;
