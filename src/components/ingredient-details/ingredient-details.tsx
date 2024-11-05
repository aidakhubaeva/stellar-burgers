import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  selectCurrentIngredient,
  clearCurrentIngredient,
  setCurrentIngredient,
  selectBurgerIngredients
} from '../../slices/burgerSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const ingredientData = useSelector(selectCurrentIngredient);
  const ingredients = useSelector(selectBurgerIngredients);

  useEffect(() => {
    if (id) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(setCurrentIngredient(ingredient));
      }
    }
    return () => {
      dispatch(clearCurrentIngredient());
    };
  }, [id, dispatch, ingredients]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
