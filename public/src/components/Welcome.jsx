import React from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif';

export default function Welcome({ currentUser }) {
  if (!currentUser) {
    return (
      <Container>
        <img src={Robot} alt="robot" />
        <h3>正在加载用户信息...</h3>
      </Container>
    );
  }
  return (
    <Container>
      <img src={Robot} alt="robot" />
      <h1>
        <span>{currentUser.username}</span>，欢迎你！
      </h1>
      <h3>请选择一个联系人进行聊天吧！</h3>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;

  img {
    height: 20rem;
  }

  span {
    color: #4e0eff;
  }
`