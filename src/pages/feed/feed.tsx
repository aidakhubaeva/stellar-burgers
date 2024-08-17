import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  selectOrders,
  selectOrdersStatus,
  selectOrdersError,
  selectIsAuthenticated,
  setOrders,
  setNewOrderId
} from '../../slices/burgerSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const ordersStatus = useSelector(selectOrdersStatus);
  const ordersError = useSelector(selectOrdersError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const prevOrdersRef = useRef(orders);

  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(async () => {
        const result = await dispatch(fetchOrders()).unwrap();
        const newOrders = result.filter(
          (order) =>
            !prevOrdersRef.current.some(
              (prevOrder) => prevOrder._id === order._id
            )
        );
        if (newOrders.length > 0) {
          dispatch(setOrders(result));
          newOrders.forEach((order) => dispatch(setNewOrderId(order._id)));
        }
        prevOrdersRef.current = result;
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [dispatch, isAuthenticated]);

  if (ordersStatus === 'loading' && !prevOrdersRef.current.length) {
    return <Preloader />;
  }

  if (ordersStatus === 'failed') {
    return <div>Error: {ordersError}</div>;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchOrders());
      }}
    />
  );
};

export default Feed;
