import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersStatus
} from '../../slices/burgerSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const ordersStatus = useSelector(selectUserOrdersStatus);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (ordersStatus === 'loading') {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
