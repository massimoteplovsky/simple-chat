import { useReducer, useEffect, useCallback } from 'react';
import { socket } from './socket';

// Components
import ChatEnter from './components/chat-enter';
import Chat from './components/chat';

const initialState = {
  isJoined: false,
  username: null,
  roomId: null,
  users: [],
  messages: [],
};

const reducer = (state, { type, payload = null }) => {
  switch (type) {
    case 'IS_JOINED':
      return {
        ...state,
        isJoined: true,
        username: payload.username,
        roomId: payload.roomId,
      };
    case 'SET_DATA':
      return {
        ...state,
        users: payload.users,
        messages: payload.messages,
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: payload,
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isJoined } = state;

  const onJoin = (formData) => {
    dispatch({ type: 'IS_JOINED', payload: formData });
    socket.emit('ROOM:JOIN', formData);
  };

  const addMessages = useCallback((data) => {
    dispatch({ type: 'SET_MESSAGES', payload: data });
  }, []);

  useEffect(() => {
    socket.on('ROOM:SET_DATA', (data) => {
      dispatch({ type: 'SET_DATA', payload: data });
    });
  }, []);

  return (
    <div className="wrapper">
      {!isJoined ? (
        <ChatEnter onJoin={onJoin} />
      ) : (
        <Chat {...state} onAddMessages={addMessages} />
      )}
    </div>
  );
};

export default App;
