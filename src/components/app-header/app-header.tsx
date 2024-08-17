import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../slices/burgerSlice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleConstructorClick = () => {
    console.log('Переход на страницу конструктора');
    dispatch(setCurrentPage('constructor'));
    navigate('/');
  };

  const handleOrderFeedClick = () => {
    console.log('Переход на страницу ленты заказов');
    dispatch(setCurrentPage('feed'));
    navigate('/feed');
  };

  const handleProfileClick = () => {
    console.log('Переход на страницу профиля');
    dispatch(setCurrentPage('profile'));
    navigate('/profile');
  };

  return (
    <AppHeaderUI
      userName=''
      onConstructorClick={handleConstructorClick}
      onOrderFeedClick={handleOrderFeedClick}
      onProfileClick={handleProfileClick}
    />
  );
};
