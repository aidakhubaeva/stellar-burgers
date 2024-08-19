import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import {
  addIngredientToConstructor,
  openModal,
  selectBurgerConstructorItems,
  setCurrentIngredient
} from '../../slices/burgerSlice';
import { TConstructorIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const constructorItems = useSelector(selectBurgerConstructorItems);

    const handleAdd = () => {
      const ingredientToAdd: TConstructorIngredient = {
        ...ingredient,
        id: ingredient._id
      };
      dispatch(addIngredientToConstructor(ingredientToAdd));
    };

    const handleClick = () => {
      dispatch(setCurrentIngredient(ingredient));
      dispatch(openModal());
    };

    let ingredientCount;
    const ingredientInConstructor = constructorItems.ingredients.find(
      (i) => i && i.item && i.item._id === ingredient._id
    );

    if (ingredientInConstructor) {
      ingredientCount = ingredientInConstructor.count;
    } else if (
      ingredient.type === 'bun' &&
      constructorItems.bun?._id === ingredient._id
    ) {
      ingredientCount = 1;
    }

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={ingredientCount}
        handleAdd={handleAdd}
        handleClick={handleClick}
        locationState={{ background: location }}
      />
    );
  }
);
