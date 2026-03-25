import React from 'react';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logoutRoute } from '../utils/APIRoutes';

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      await axios.post(logoutRoute);
    } catch (e) {
      // 即使请求失败，也允许跳回登录页
    }
    navigate("/login");
  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;

  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;