import React from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { IoMdSend } from 'react-icons/io';
import { BsEmojiSmileFill } from 'react-icons/bs';


export default function ChatInput() {

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill />
        </div>
        <form className="input-container">
          <input type="text" placeholder="输入消息..." />
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

      svg {
        font-size: 1rem;
        color: white;
        cursor: pointer;
      }
    }
  }
`