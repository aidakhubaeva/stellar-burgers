import { FC } from 'react';
import { useSelector } from 'react-redux';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { selectOrders } from '../../slices/burgerSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 40);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectOrders);
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  const feed = {
    total: orders.length,
    today: orders.filter(
      (order) => new Date(order.createdAt).getDay() === new Date().getDay()
    ).length
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
