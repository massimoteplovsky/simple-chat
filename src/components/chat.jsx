import { useEffect, useRef, useState, useMemo } from 'react';
import { socket } from '../socket';

const Chat = ({ users, messages, username, roomId, onAddMessages }) => {
  const [messageValue, setMessageValue] = useState('');
  const messagesRef = useRef(null);

  useEffect(() => {
    socket.on('ROOM:SET_NEW_MESSAGES', (data) => {
      onAddMessages(data);
    });
  }, [onAddMessages]);

  const onSendMessage = () => {
    if (!messageValue) return;
    socket.emit('ROOM:NEW_MESSAGE', {
      username,
      roomId,
      text: messageValue,
    });
    setMessageValue('');
  };

  useEffect(() => {
    messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
  }, [messages.length]);

  return (
    <>
      <h1 className="chat-title">
        Приветствуем тебя "{username}" в комнате {roomId}
      </h1>
      <div className="chat">
        <div className="chat-users">
          Комната: <b>{roomId}</b>
          <hr />
          <b>Онлайн ({users.length}):</b>
          <ul>
            {useMemo(
              () =>
                users.map((name, index) => <li key={name + index}>{name}</li>),
              [users]
            )}
          </ul>
        </div>
        <div className="chat-messages">
          <div ref={messagesRef} className="messages">
            {messages.map(({ text, username: msgUsername }, index) => (
              <div
                key={index}
                className={
                  username === msgUsername ? 'message message-owner' : 'message'
                }
              >
                <p>{text}</p>
                <span>Написал: {msgUsername}</span>
              </div>
            ))}
          </div>
          <form>
            <textarea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="form-control"
              rows="3"
            ></textarea>
            <button
              onClick={onSendMessage}
              type="button"
              className="btn btn-primary"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
