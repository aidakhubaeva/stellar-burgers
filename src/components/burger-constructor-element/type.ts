import { TConstructorIngredient } from '@utils-types';

export type BurgerConstructorElementProps = {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
  handleRemove: (id: string) => void;
  onMove: (fromIndex: number, toIndex: number) => void; // Добавляем onMove
};
