import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectOrders } from '../../slices/burgerSlice';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const userOrdersIds = JSON.parse(localStorage.getItem('userOrders') || '[]');
  const userOrders = orders.filter((order) =>
    userOrdersIds.includes(order._id)
  );

  return <ProfileOrdersUI orders={userOrders} />;
};
