import React, { useEffect, FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchBurgerData,
  selectBurgerIngredients,
  selectBurgerStatus,
  selectBurgerError
} from '../../slices/burgerSlice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectBurgerIngredients);
  const status = useSelector(selectBurgerStatus);
  const error = useSelector(selectBurgerError);

  useEffect(() => {
    dispatch(fetchBurgerData());
  }, [dispatch]);

  const isIngredientsLoading = status === 'loading';

  return (
    <ConstructorPageUI
      isIngredientsLoading={isIngredientsLoading}
      ingredients={ingredients}
      error={error}
    />
  );
};
