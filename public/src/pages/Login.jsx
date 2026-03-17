import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';

function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (!data.status) toast.error(data.msg, toastOptions);
      else {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");  //导航到聊天界面
      }
    }
  };

  const handleValidation = () => {
    const { password, username } = values;
    if (password === "") {
      toast.error("密码不能为空", toastOptions)
      return false;
    } else if (username.length === 0) {
      toast.error("用户名称不能为空", toastOptions)
      return false;
    }
    return true;
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h1>LilChat</h1>
        </div>
        <input type="text" placeholder="用户名" name="username" value={values.username} onChange={handleChange} />
        <input type="password" placeholder="密码" name="password" value={values.password} onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>登录</button>
        <span>还没有用户？<Link to="/register">去注册</Link></span>
      </form>
      <ToastContainer />
    </FormContainer>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    .error-alert {
      margin-bottom: 0.5rem;
      background-color: #3b0f0f;
      border: 1px solid #f87171;
      color: #fecaca;
    }
    input {
      background-color: transparent;
      padding: 0.5rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      color: white;
      padding: 0.6rem 1rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.3s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        font-weight: bold;
      }
    }
  }
`;

export default Login;