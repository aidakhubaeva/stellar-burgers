import { TIngredient } from '@utils-types';

export type TBurgerIngredientUIProps = {
  ingredient: TIngredient;
  count?: number;
  locationState?: Record<string, any>; // Делаем locationState необязательным
  handleAdd: () => void;
  handleClick: () => void;
};
