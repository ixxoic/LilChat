import React from 'react';
import styled from 'styled-components';

export default function Messages({ messages = [] }) {
  return (
    <Container>
      {messages.length === 0 ? null : (
        messages.map((m, idx) => (
          <div
            key={idx}
            className={`message ${m.fromSelf ? 'from-self' : 'from-them'}`}
          >
            {m.message}
          </div>
        ))
      )}
    </Container>
  );
}

const Container = styled.div`
  height: 80%;
  width: 100%;
  overflow: auto;

  .message {
    max-width: 70%;
    margin: 0.5rem 0;
    padding: 0.5rem 0.8rem;
    border-radius: 1rem;
    background-color: #ffffff18;
    color: white;
    word-break: break-word;
  }

  .from-self {
    margin-left: auto;
    background-color: #9a86f3;
  }

  .from-them {
    margin-right: auto;
  }
`;