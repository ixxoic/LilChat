import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import loader from '../assets/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from "axios";
import { setAvatarRoute } from '../utils/APIRoutes';

// 使用 DiceBear 头像 API，支持直接作为 img src，无 CORS/403 问题
const AVATAR_API = "https://api.dicebear.com/7.x/avataaars/svg";

export default function SetAvatar() {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("请选择一个头像", toastOptions);
    } else {
      const raw = localStorage.getItem("chat-app-user");
      if (!raw) {
        toast.error("请先登录", toastOptions);
        return;
      }
      const user = JSON.parse(raw);
      if (!user?._id) {
        toast.error("用户信息无效，请重新登录", toastOptions);
        return;
      }
      try {
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
          image: selectedAvatar,
        });
        console.log(data);
        if (data.isSet) {
          user.isAvatarImageSet = true;
          user.avatarImage = data.image;
          localStorage.setItem("chat-app-user", JSON.stringify(user));
          navigate("/");
        } else {
          toast.error("设置头像失败，请重试！", toastOptions);
        }
      } catch (e) {
        toast.error("无法连接服务器，确认后端已启动", toastOptions);
      }
    }

  };

  useEffect(() => {
    // 只生成 4 个头像 URL，不发起 fetch，由 <img src> 直接加载，避免 CORS/403
    const seeds = ["Felix", "Aneka", "Luna", "Max", "Mia", "Leo", "Zoe", "Kai"];
    const urls = [];
    for (let i = 0; i < 4; i++) {
      const seed = seeds[Math.floor(Math.random() * seeds.length)] + Date.now() + i;
      urls.push(`${AVATAR_API}?seed=${encodeURIComponent(seed)}`);
    }
    setAvatars(urls);
    setIsLoading(false);
  }, []);

  return (
    <>
      {
        isLoading ? <Container>
          <img src={loader} alt="加载中" className="loader" />
        </Container> : (
          <Container>
            <div className="title-container">
              <h1>选择一个头像用于你的聊天界面</h1>
            </div>
            <div className="avatars">
              {(
                avatars.map((avatar, index) => (
                  <div className={`avatar ${selectedAvatar === avatar ? "selected" : ""}`} key={index}>
                    <img src={avatar} alt="avatar" onClick={() => setSelectedAvatar(avatar)} />
                  </div>
                ))
              )}
            </div>
            <button className="submit-btn" onClick={setProfilePicture}>设置头像</button>
          </Container>
        )

      }
      <ToastContainer />
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 3.5rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.6rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      background-color: white;
      img {
        height: 5rem;
      }
    }
    .selected  {
      border: 0.4rem solid #4e0eff;
    }
  }



  .submit-btn {
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
`;