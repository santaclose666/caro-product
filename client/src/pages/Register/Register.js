import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux'
import { registerUser } from "../../redux/apiRequest";
import './Register.css'
import GameName from "../../components/GameName/GameName";

const Register = () => {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("Enter your information")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault()
    const data = { user, email, pwd };

    if(user.trim() === ''|| email.trim() === '' || pwd.trim() === ''){
      return setMessage('Missing value')
    }

    if(pwd.length < 8){
      return setMessage('Password require at least 8 character')
    }

    if(!email.endsWith('@gmail.com')){
      return setMessage('Email invalid')
    }

    registerUser(data, dispatch, navigate)
  };

  return (
    <div className="wrap">
      <GameName namePage='Register'/>

      <div className="form">
        <div className="labelUser">Enter your UserName:</div>
        <input
          className="input"
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
      </div>

      <div className="form">
        <div className="labelEmail">Enter your Email:</div>
        <input
          className="input"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div className="form">
        <div className="labelPwd">Enter your Password:</div>
        <input
          className="input"
          type="password"
          onChange={(e) => {
            setPwd(e.target.value);
          }}
        />      
      </div>

      <div className="notice">{message}</div>
        <button className="btnRegister" onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
