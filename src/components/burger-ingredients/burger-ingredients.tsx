import React, { useEffect, FC, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import {
  selectBurgerIngredients,
  fetchBurgerData,
  selectBurgerStatus
} from '../../slices/burgerSlice';
import { useSelector, useDispatch } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectBurgerIngredients);
  const status = useSelector(selectBurgerStatus);

  useEffect(() => {
    if (status === 'idle' && ingredients.length === 0) {
      dispatch(fetchBurgerData());
    }
  }, [dispatch, status, ingredients.length]);

  const buns = ingredients.filter(
    (ingredient: TIngredient) => ingredient.type === 'bun'
  );
  const mains = ingredients.filter(
    (ingredient: TIngredient) => ingredient.type === 'main'
  );
  const sauces = ingredients.filter(
    (ingredient: TIngredient) => ingredient.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
