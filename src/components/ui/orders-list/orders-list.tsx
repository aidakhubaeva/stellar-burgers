import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({ orderByDate }) => {
  console.log('OrdersListUI received orders:', orderByDate);

  return (
    <div className={`${styles.content}`}>
      {orderByDate.map((order) => {
        return <OrderCard order={order} key={order._id} />;
      })}
    </div>
  );
};
