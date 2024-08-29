import React, { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import {
  selectOrders,
  selectTotalOrdersCount,
  selectTotalOrdersTodayCount
} from '../../slices/burgerSlice';

export const FeedInfo: FC = () => {
  const orders = useSelector(selectOrders);
  const totalOrdersCount = useSelector(selectTotalOrdersCount);
  const totalOrdersTodayCount = useSelector(selectTotalOrdersTodayCount);

  const readyOrders = orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);

  const pendingOrders = orders
    .filter((order) => order.status === 'pending')
    .map((order) => order.number);

  const feed = {
    total: totalOrdersCount || 0,
    totalToday: totalOrdersTodayCount || 0
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
