import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";
import GameName from "../../components/GameName/GameName";

const Login = () => {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const checkUser = useSelector((state) => state.auth.login?.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkUser) {
      navigate("/lobby");
    }
  }, [checkUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.trim() !== "" && pwd.trim() !== "") {
      const data = { user, pwd };

      loginUser(data, dispatch, navigate);
    }
  };

  return (
    <div className="wrap">
      <GameName namePage="Login" />

      <div className="form">
        <div className="labelUser">UserName:</div>
        <input
          className="input"
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
      </div>

      <div className="form">
        <div className="labelPassword">Password:</div>
        <input
          className="input"
          type="password"
          onChange={(e) => {
            setPwd(e.target.value);
          }}
        />
      </div>

      <div className="register">
        <Link to="/register">Sign up!</Link>
      </div>

      <div className="notice">
        {checkUser !== false
          ? "If u do not have account. Click above!"
          : "Username or password incorrect"}
      </div>
      <button className="btnLogin" onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
};

export default Login;
