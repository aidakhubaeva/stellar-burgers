import React, { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import {
  selectBurgerIngredients,
  selectNewOrderId,
  setOrderModalData,
  openModal
} from '../../slices/burgerSlice';

const maxIngredients = 5;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectBurgerIngredients);
  const newOrderId = useSelector(selectNewOrderId);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) {
      return null;
    }

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    if (!ingredientsInfo.length) {
      return null;
    }

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  const handleOrderClick = () => {
    dispatch(setOrderModalData(order));
    dispatch(openModal());
  };

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
      onClick={handleOrderClick}
      isNew={newOrderId === order._id}
    />
  );
});
