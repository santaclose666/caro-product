import React, { useState } from "react";

import "./HomePage.css";
import GameName from "../../components/GameName/GameName";
import Login from "../Login/Login";

const HomePage = () => {
  const [mountName, setMountName] = useState(true)
  const [mountLogin, setMountlogin] = useState(false)

  const handleLogin = ()=>{
    setMountName(false)
    setMountlogin(true)
  }
  return (
    <div>
      {mountName && 
        <div className="wrap">
          <GameName namePage='Game'/>
          <button className="btn" onClick={handleLogin}>Login</button>
        </div>
      }
      
      {mountLogin && <Login/>}
      
    </div>
  );
};

export default HomePage;
