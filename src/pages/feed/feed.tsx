import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrders,
  fetchTotalOrdersCount,
  selectOrders,
  selectOrdersStatus,
  selectOrdersError,
  setOrders,
  selectTotalOrdersCount
} from '../../slices/burgerSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const ordersStatus = useSelector(selectOrdersStatus);
  const ordersError = useSelector(selectOrdersError);
  const totalOrdersCount = useSelector(selectTotalOrdersCount);

  useEffect(() => {
    const loadFeedData = async () => {
      try {
        await dispatch(fetchTotalOrdersCount());
        const result = await dispatch(
          fetchOrders({ offset: 0, limit: 40 })
        ).unwrap();
        dispatch(setOrders(result));
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadFeedData();
  }, [dispatch]);

  if (ordersStatus === 'loading' && !orders.length) {
    return <Preloader />;
  }

  if (ordersStatus === 'failed') {
    return <div>Error: {ordersError}</div>;
  }

  return (
    <FeedUI
      orders={orders}
      totalOrdersCount={totalOrdersCount}
      handleGetFeeds={() => {
        dispatch(fetchOrders({ offset: 0, limit: 40 }));
      }}
    />
  );
};

export default Feed;
