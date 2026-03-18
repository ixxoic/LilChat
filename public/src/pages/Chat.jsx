import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';

function Chat() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);


  useEffect(() => {
    const run = async () => {
      const raw = localStorage.getItem("chat-app-user");
      if (!raw) {
        navigate("/login");
        return;
      }
      const data = await JSON.parse(raw);
      setCurrentUser(data);
    }
    run();
  }, [navigate]);

  //加载完currentUser后，获取所有用户
  useEffect(() => {
    if (!currentUser) return;

    const run = async () => {
      if (currentUser.isAvatarImageSet) {
        const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.users ?? []);
      } else {
        navigate("/setAvatar");
      }
    }

    run();

  }, [currentUser, navigate]);


  const handleChangeChat = (chat) => {
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChangeChat} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`

export default Chat;