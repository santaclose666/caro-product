import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logoutStart,
  logoutSuccess,
  logoutFailed,
} from "./authSlice";

import {
  deleteUserFailed,
  deleteUserStart,
  deleteUserSuccess,
  getUsersFailed,
  getUsersStart,
  getUsersSuccess,
} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post("https://tic-tac-toe-server-9jq0.onrender.com/login", user, {
      withCredentials: true,
    });
    dispatch(loginSuccess((await res).data));

    navigate("/lobby");
  } catch (err) {
    dispatch(loginFailed(err.response.data));
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post("https://tic-tac-toe-server-9jq0.onrender.com/register", user, {
      withCredentials: true,
    });

    dispatch(registerSuccess());

    navigate("/login");
  } catch (err) {
    dispatch(registerFailed());
  }
};

export const logoutUser = async (dispatch, navigate) => {
  dispatch(logoutStart());
  try {
    await axios.get("https://tic-tac-toe-server-9jq0.onrender.com/logout", {
      withCredentials: true,
    });
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(logoutFailed());
  }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getUsersStart());

  try {
    const res = await axiosJWT.get("https://tic-tac-toe-server-9jq0.onrender.com/lobby", {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    dispatch(getUsersSuccess(res.data));
  } catch (err) {
    dispatch(getUsersFailed());
  }
};

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
  dispatch(deleteUserStart());

  try {
    const res = await axiosJWT.delete("https://tic-tac-toe-server-9jq0.onrender.com/delete/" + id, {
      headers: { token: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    dispatch(deleteUserSuccess(res.data));
  } catch (err) {
    dispatch(deleteUserFailed(err.response.data));
  }
};