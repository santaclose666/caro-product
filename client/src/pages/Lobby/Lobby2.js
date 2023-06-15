import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers, logoutUser } from "../../redux/apiRequest";
import './Lobby2.css'
import { loginSuccess } from "../../redux/authSlice";
import {createAxios} from '../../interceptor/axiosJWT'

const Lobby = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state)=> state.auth.login?.currentUser)
  const userList = useSelector((state) => state.users.users?.allUsers)
  const msg = useSelector((state)=> state.users?.msg)
  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  const handleLogout = () =>{
    logoutUser(dispatch, navigate)
  }

  const handleDelete = (id)=>{
    deleteUser(user?.accessToken, dispatch, id, axiosJWT)
    
  }

  useEffect(()=>{
    if(!user){
      navigate('/')
    }

    getAllUsers(user?.accessToken, dispatch, axiosJWT)
  }, [])


  return (
    <div>
      <div>Welcome {user?.username} to caro lobby</div>
      <button onClick={handleLogout}>Logout</button>
      <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? `Admin` : `User`}`}
      </div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container">
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={()=>handleDelete(user._id)}>Delete</div>
            </div>
          );
        })}
      </div>
      <div className="errorMsg">{msg}</div>
    </main>
    </div>
  )
};

export default Lobby;
