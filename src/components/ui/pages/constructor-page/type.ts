import { TIngredient } from '@utils-types';

export interface ConstructorPageUIProps {
  isIngredientsLoading: boolean;
  error: string | null;
  ingredients: TIngredient[];
}
