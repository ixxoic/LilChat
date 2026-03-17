import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { registerRoute } from '../utils/APIRoutes';

function Register() {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [error]);

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
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
    }
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("两次输入的密码不一致", toastOptions)
      return false;
    } else if (username.length === 0) {
      toast.error("用户名称不能为空", toastOptions)
      return false;
    } else if (email.length === 0) {
      toast.error("邮箱不能为空", toastOptions)
      return false;
    } else if (password.length === 0) {
      toast.error("密码不能为空", toastOptions)
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
        {error && (
          <Alert variant="destructive" className="error-alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <input type="text" placeholder="用户名" name="username" value={values.username} onChange={handleChange} />
        <input type="email" placeholder="邮箱" name="email" value={values.email} onChange={handleChange} />
        <input type="password" placeholder="密码" name="password" value={values.password} onChange={handleChange} />
        <input type="password" placeholder="确认密码" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} />
        <button type="submit" onClick={handleSubmit}>注册</button>
        <span>已有用户？<Link to="/login">登录</Link></span>
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

export default Register;