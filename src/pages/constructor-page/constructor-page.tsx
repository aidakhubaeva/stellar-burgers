import React, { FC } from 'react';
import { useSelector } from '../../services/store';
import {
  selectBurgerIngredients,
  selectBurgerStatus,
  selectBurgerError
} from '../../slices/burgerSlice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

export const ConstructorPage: FC = () => {
  const ingredients = useSelector(selectBurgerIngredients);
  const status = useSelector(selectBurgerStatus);
  const error = useSelector(selectBurgerError);

  const isIngredientsLoading = status === 'loading';

  return (
    <ConstructorPageUI
      isIngredientsLoading={isIngredientsLoading}
      ingredients={ingredients}
      error={error}
    />
  );
};
