import React, { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import {
  selectBurgerConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  removeIngredientFromConstructor,
  moveIngredientInConstructor,
  selectIsAuthenticated,
  createOrder,
  clearOrderModalData,
  openModal,
  setOrderModalData,
  selectBurgerStatus,
  selectBurgerIngredients
} from '../../slices/burgerSlice';
import { useSelector, useDispatch } from '../../services/store'; // Используем типизированные хуки

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectBurgerConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const burgerStatus = useSelector(selectBurgerStatus);
  const ingredients = useSelector(selectBurgerIngredients);

  if (burgerStatus !== 'succeeded') {
    return null;
  }

  const onOrderClick = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun) {
      console.error('Нет булочки для заказа');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.flatMap(({ item, count }) =>
        item ? Array(count).fill(item._id) : []
      ),
      constructorItems.bun._id
    ];

    try {
      const response = await dispatch(createOrder(ingredientIds)).unwrap();
      const orderId = response.order._id;
      const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      userOrders.push(orderId);
      localStorage.setItem('userOrders', JSON.stringify(userOrders));

      dispatch(setOrderModalData(response.order));
      dispatch(openModal());
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const handleRemove = (id: string) => {
    dispatch(removeIngredientFromConstructor(id));
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    dispatch(moveIngredientInConstructor({ fromIndex, toIndex }));
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (total, ingredient) =>
        ingredient.item
          ? total + ingredient.item.price * ingredient.count
          : total,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  const expandedIngredients = useMemo(
    () =>
      constructorItems.ingredients
        .map(({ item, count }) => {
          if (!item) {
            console.error('Item is undefined:', item);
            return [];
          }

          const fullIngredientData = ingredients.find(
            (ing) => ing._id === item._id
          );

          if (!fullIngredientData) {
            console.error('Ingredient not found:', item._id);
            return [];
          }

          return Array(count)
            .fill(null)
            .map((_, index) => ({
              ...fullIngredientData,
              uniqueId: `${item._id}-${index}`
            }));
        })
        .flat(),
    [constructorItems.ingredients, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{
        bun: constructorItems.bun,
        ingredients: expandedIngredients
      }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      handleRemove={handleRemove}
      handleMove={handleMove}
    />
  );
};
