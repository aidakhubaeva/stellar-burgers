import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppNavigation } from '../../hooks/useAppNavigation';

export const AppHeader: FC = () => {
  const { goToPage } = useAppNavigation();

  const handleConstructorClick = () => {
    console.log('Переход на страницу конструктора');
    goToPage('constructor', '/');
  };

  const handleOrderFeedClick = () => {
    console.log('Переход на страницу ленты заказов');
    goToPage('feed', '/feed');
  };

  const handleProfileClick = () => {
    console.log('Переход на страницу профиля');
    goToPage('profile', '/profile');
  };

  const handleLogoClick = () => {
    console.log('Переход на главную страницу');
    goToPage('constructor', '/');
  };

  return (
    <AppHeaderUI
      userName=''
      onConstructorClick={handleConstructorClick}
      onOrderFeedClick={handleOrderFeedClick}
      onProfileClick={handleProfileClick}
      onLogoClick={handleLogoClick}
    />
  );
};
