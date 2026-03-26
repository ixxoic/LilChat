import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import ChatInput from './ChatInput';
import { sendMessageRoute, getAllMessagesRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"


export default function ChatContainer({ currentChat, currentUser, socket }) {

  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }

  useEffect(() => {
    if (!currentUser || !currentChat) return;

    let cancelled = false;

    const run = async () => {
      try {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        if (!cancelled) setMessages(response.data);
      } catch (err) {
        console.error('获取消息失败：', err);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [currentUser, currentChat]);

  // 选中会话后加入二人房间，与服务端 room_${id1}_${id2} 约定一致
  useEffect(() => {
    if (!socket?.current || !currentUser || !currentChat) return;

    const userPair = [String(currentUser._id), String(currentChat._id)].sort();
    const roomName = `room_${userPair[0]}_${userPair[1]}`;
    socket.current.emit("join_chat_room", roomName);
  }, [socket, currentUser, currentChat]);

  const handleSendMessage = async (msg) => {
    if (!currentUser || !currentChat || !socket?.current) return;

    try {
      const { data } = await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });

      const messageId = data.messageId;
      if (messageId == null) {
        toast.error("消息落库失败，无法发送", toastOptions);
        return;
      }

      socket.current.emit(
        "send_message",
        {
          from: currentUser._id,
          to: currentChat._id,
          message: msg,
          _id: messageId,
        },
        (ack) => {
          console.log("[socket] ack:", ack);
          if (!ack?.success) {
            toast.error(ack?.error || "消息投递确认失败", toastOptions);
          }
        }
      );


      // 现在是"REST落库 + Socket推送 + ACK确认"
      // 发消息后本地会先加一条
      // 同时可能又从socket收到同一条消息
      // 如果没有这段去重，就会出现同一条消息显示两次
      setMessages((prev) => {
        if (
          messageId != null &&
          prev.some(
            (m) =>
              m.messageId != null &&
              String(m.messageId) === String(messageId)
          )
        ) {
          return prev;
        }
        return [...prev, { fromSelf: true, message: msg, messageId }];
      });
    } catch (err) {
      console.error("发送消息失败：", err);
      toast.error("发送失败，请稍后重试", toastOptions);
    }
  };

  useEffect(() => {
    if (!socket?.current || !currentUser) return;

    const currentSocket = socket.current;

    const handler = (payload) => {
      const fromSelf = String(payload.from) === String(currentUser._id);
      setMessages((prev) => {
        if (
          payload._id != null &&
          prev.some(
            (m) =>
              m.messageId != null &&
              String(m.messageId) === String(payload._id)
          )
        ) {
          return prev;
        }
        return [
          ...prev,
          {
            fromSelf,
            message: payload.message,
            messageId: payload._id,
          },
        ];
      });
    };

    currentSocket.on("new_message", handler);

    return () => {
      currentSocket.off("new_message", handler);
    };
  }, [socket, currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <>
      {
        currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  <img src={currentChat.avatarImage} alt="avatar" />
                </div>
                <div className="username">
                  <h3>{currentChat.username}</h3>
                </div>
              </div>
              <Logout />
            </div>
            <div className="chat-messages">
              {
                messages.map((message) => {
                  return (
                    <div ref={scrollRef} key={uuidv4()}>
                      <div className={`message ${message.fromSelf ? 'sended' : 'received'}`}>
                        <div className="content">
                          <p>{message.message}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            <ChatInput handleSendMessage={handleSendMessage} />
            <ToastContainer />
          </Container>
        )
      }
    </>
  )
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-auto-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }

    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`