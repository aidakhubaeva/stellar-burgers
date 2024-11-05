import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onConstructorClick,
  onOrderFeedClick,
  onProfileClick,
  onLogoClick
}) => {
  const getLinkClass = (path: string) =>
    window.location.pathname === path ? styles.link_active : styles.link;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div className={getLinkClass('/')} onClick={onConstructorClick}>
            <BurgerIcon
              type={window.location.pathname === '/' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>Конструктор</p>
          </div>
          <div className={getLinkClass('/feed')} onClick={onOrderFeedClick}>
            <ListIcon
              type={
                window.location.pathname === '/feed' ? 'primary' : 'secondary'
              }
            />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </div>
        </div>
        <div className={styles.logo} onClick={onLogoClick}>
          <Logo className='' />
        </div>
        <div className={getLinkClass('/profile')} onClick={onProfileClick}>
          <ProfileIcon
            type={
              window.location.pathname === '/profile' ? 'primary' : 'secondary'
            }
          />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
