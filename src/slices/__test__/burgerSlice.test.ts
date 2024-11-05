import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import burgerReducer, {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientInConstructor,
  clearConstructor,
  fetchBurgerData,
  BurgerState,
  setCurrentIngredient,
  setOrderModalData,
  setToken,
  setUser,
  openModal,
  closeModal
} from '../burgerSlice';
import {
  mockStore,
  mockIngredient,
  mockBun,
  mockOrder,
  mockUser,
  mockIngredient2
} from './mockData';

// Функция для инициализации стора для тестов
function initStore(preloadedState: BurgerState = mockStore) {
  return configureStore({
    reducer: {
      burger: burgerReducer
    },
    preloadedState: {
      burger: preloadedState
    }
  });
}

describe('rootReducer', () => {
  test('должен возвращать начальное состояние при вызове с undefined состоянием и неизвестным экшеном', () => {
    const store = configureStore({ reducer: burgerReducer });
    const initialState = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    expect(store.getState()).toEqual(initialState);
  });
});

describe('Тесты для Burger Slice', () => {
  let store;

  beforeEach(() => {
    store = initStore(); // Инициализация стора перед каждым тестом
  });

  // Проверка правильной инициализации rootReducer
  test('должен инициализироваться с начальными данными', () => {
    expect(store.getState().burger).toEqual(mockStore);
  });

  // Проверка редьюсера для добавления ингредиента в конструктор
  test('должен корректно добавлять ингредиент в конструктор', () => {
    store.dispatch(addIngredientToConstructor(mockIngredient));

    const state = store.getState().burger;
    expect(state.constructorItems.ingredients.length).toBe(1);
    expect(state.constructorItems.ingredients[0].item).toEqual(mockIngredient);
  });

  // Проверка редьюсера для удаления ингредиента из конструктора
  test('должен корректно удалять ингредиент из конструктора', () => {
    store.dispatch(addIngredientToConstructor(mockIngredient));
    store.dispatch(removeIngredientFromConstructor(mockIngredient._id));

    const state = store.getState().burger;
    expect(state.constructorItems.ingredients.length).toBe(0);
  });

  // Проверка редьюсера для изменения порядка ингредиентов в конструкторе
  test('должен корректно перемещать ингредиент в конструкторе', () => {
    const store = initStore();
    store.dispatch(addIngredientToConstructor(mockIngredient));
    store.dispatch(addIngredientToConstructor(mockIngredient2));
    store.dispatch(moveIngredientInConstructor({ fromIndex: 0, toIndex: 1 }));
    const state = store.getState().burger;
    expect(state.constructorItems.ingredients[0].item).toEqual(mockIngredient2);
    expect(state.constructorItems.ingredients[1].item).toEqual(mockIngredient);
  });

  // Проверка редьюсера для очистки конструктора
  test('должен корректно очищать конструктор', () => {
    store.dispatch(addIngredientToConstructor(mockIngredient));
    store.dispatch(clearConstructor());

    const state = store.getState().burger;
    expect(state.constructorItems.ingredients.length).toBe(0);
    expect(state.constructorItems.bun).toBeNull();
  });

  // Проверка изменения состояния при запросе данных ингредиентов (isLoading)
  test('должен установить isLoading в true при fetchBurgerData.pending', () => {
    store.dispatch(fetchBurgerData.pending('test-id'));
    expect(store.getState().burger.status).toBe('loading');
  });

  // Проверка успешного получения данных ингредиентов и изменения состояния (isLoading и данные)
  test('должен обновить ингредиенты при fetchBurgerData.fulfilled', () => {
    store.dispatch(
      fetchBurgerData.fulfilled([mockIngredient, mockBun], 'test-id')
    );

    const state = store.getState().burger;
    expect(state.status).toBe('succeeded');
    expect(state.ingredients.length).toBe(2);
  });

  // Проверка обработки ошибки при запросе данных ингредиентов (ошибка и isLoading)
  test('должен установить ошибку при fetchBurgerData.rejected', () => {
    const error = new Error('Failed to fetch data');
    store.dispatch(fetchBurgerData.rejected(error, 'test-id'));

    const state = store.getState().burger;
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to fetch data');
  });

  // Проверка установки текущего ингредиента
  test('должен корректно устанавливать текущий ингредиент', () => {
    store.dispatch(setCurrentIngredient(mockIngredient));

    const state = store.getState().burger;
    expect(state.currentIngredient).toEqual(mockIngredient);
  });

  // Проверка установки данных модального окна заказа
  test('должен корректно устанавливать данные модального окна заказа', () => {
    store.dispatch(setOrderModalData(mockOrder));

    const state = store.getState().burger;
    expect(state.orderModalData).toEqual(mockOrder);
  });

  // Проверка открытия и закрытия модального окна
  test('должен корректно открывать и закрывать модальное окно', () => {
    store.dispatch(openModal());

    let state = store.getState().burger;
    expect(state.isModalOpened).toBe(true);

    store.dispatch(closeModal());

    state = store.getState().burger;
    expect(state.isModalOpened).toBe(false);
  });

  // Проверка установки токена и пользователя
  test('должен корректно устанавливать токен и пользователя', () => {
    store.dispatch(setToken('test-token'));

    let state = store.getState().burger;
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);

    store.dispatch(setUser(mockUser));
    state = store.getState().burger;
    expect(state.user).toEqual(mockUser);
  });
});
