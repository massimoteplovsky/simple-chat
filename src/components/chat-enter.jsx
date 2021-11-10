import { useState } from 'react';
import axios from 'axios';

const ChatEnter = ({ onJoin }) => {
  const [formData, setFormData] = useState({
    roomId: '',
    username: '',
  });
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { roomId, username } = formData;

  const handleChangeFormData = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendData = async () => {
    if (!username || !roomId || !Number.isInteger(Number(roomId))) {
      return setFormError(true);
    }
    setIsLoading(true);
    setFormError(false);
    await axios.post(`/rooms`, { ...formData });
    setIsLoading(false);
    onJoin(formData);
  };

  return (
    <div className="join-block">
      {formError && <p>Введите данные</p>}
      <input
        type="text"
        name="roomId"
        placeholder="Номер комнаты"
        value={roomId}
        onChange={handleChangeFormData}
      />
      <input
        type="text"
        name="username"
        placeholder="Ваше имя"
        value={username}
        onChange={handleChangeFormData}
      />
      <button
        className="btn btn-success"
        onClick={handleSendData}
        disabled={isLoading}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </div>
  );
};

export default ChatEnter;
