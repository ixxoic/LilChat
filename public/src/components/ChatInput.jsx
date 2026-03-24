import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';


export default function ChatInput({ handleSendMessage }) {

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  }

  // v4 的 onEmojiClick 签名是 (emojiData, event)，第一个参数才有 .emoji
  const handleEmojiClick = (emojiData) => {
    if (!emojiData?.emoji) return;
    setMsg((prev) => prev + emojiData.emoji);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMessage?.(msg);
      setMsg("");
    }
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
        <form className="input-container" onSubmit={(e) => sendChat(e)}>
          <input type="text" placeholder="输入消息..." value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button className="submit">
            <IoMdSend />
          </button>
        </form>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }


  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    width: 100%;

    .emoji {
      position: relative;

      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }

      .epr-main {
        position: absolute;
        bottom: 3.5rem;
        left: 0;
        z-index: 999;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;

        .epr-emoji-list::-webkit-scrollbar,
        .epr-body::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;

          &-thumb {
            background-color: #9a86f3;
          }
        }

        .epr-category-nav .epr-cat-btn {
          filter: contrast(0);
        }

        .epr-search-container,
        .epr-search-container input {
          background-color: transparent;
          border-color: #9a86f3; 
        }

        .epr-emoji-category-label {
          background-color: #080420;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    height: 3rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;

    input {
      width: 90%;
      height: 100%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      line-height: 1.2;
      font-size: 1rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      height: 100%;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }

      svg {
        font-size: 1rem;
        color: white;
        cursor: pointer;
      }
    }
  }
`