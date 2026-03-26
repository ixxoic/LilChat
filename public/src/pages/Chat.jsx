import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host, meRoute } from '../utils/APIRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import io from 'socket.io-client';


function Chat() {
  const socket = useRef();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await axios.get(meRoute);
        setCurrentUser(data);
        setIsLoaded(true);
      } catch (e) {
        navigate("/login");
      }
    };
    run();
  }, [navigate]);

  // 有当前用户后建立 Socket，连接成功再上报 add-user（与个人房间 join 对齐）
  useEffect(() => {
    if (!currentUser) return;

    // 优先使用 websocket，失败时自动回退到 polling
    const s = io(host, {
      transports: ["websocket", "polling"],
      timeout: 20000,
    });
    socket.current = s;

    const onConnect = () => {
      console.log("[socket] connected:", s.id);
      s.emit("add-user", currentUser._id);
    };

    if (s.connected) {
      onConnect();
    } else {
      s.on("connect", onConnect);
    }

    const onConnectError = (err) => console.error("[socket] connect_error:", err?.message || err);
    const onDisconnect = (reason) => console.warn("[socket] disconnected:", reason);
    s.on("connect_error", onConnectError);
    s.on("disconnect", onDisconnect);

    return () => {
      s.off("connect", onConnect);
      s.off("connect_error", onConnectError);
      s.off("disconnect", onDisconnect);
      s.disconnect();
      socket.current = undefined;
    };
  }, [currentUser]);

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
        {
          isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
          )
        }
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