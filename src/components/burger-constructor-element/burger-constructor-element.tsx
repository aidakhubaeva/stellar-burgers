import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems, handleRemove, onMove }) => {
    if (!ingredient || !ingredient._id) {
      console.error('Ingredient or its _id is undefined:', ingredient);
      return null;
    }

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        onMove(index, index + 1);
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        onMove(index, index - 1);
      }
    };

    const handleClose = () => {
      if (ingredient && ingredient._id) {
        handleRemove(ingredient._id);
      } else {
        console.error('Ingredient or ingredient._id is undefined', ingredient);
      }
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
        handleRemove={handleRemove}
      />
    );
  }
);
