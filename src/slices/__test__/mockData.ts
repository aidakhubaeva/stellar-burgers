import { TConstructorIngredient, TOrder, TUser } from '../../utils/types';
import { BurgerState } from '../burgerSlice';

// Фиктивные данные для ингредиентов
export const mockIngredient: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  id: 'unique-id-1' // предположительно, это id используется для уникальности в конструкторе
};

export const mockBun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: 'unique-id-2'
};

export const mockIngredient2: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093f',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
  id: 'unique-id-3'
};

export const mockIngredient3: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0940',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
  id: 'unique-id-4'
};

// Фиктивные данные для пользователя
export const mockUser: TUser = {
  email: 'test@mail.com',
  name: 'testUser'
};

// Фиктивные данные для заказов
export const mockOrder: TOrder = {
  _id: '664e927097ede0001d06bdb9',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093d'
  ],
  status: 'done',
  name: 'Флюоресцентный люминесцентный бургер',
  createdAt: '2024-05-23T00:48:48.039Z',
  updatedAt: '2024-05-23T00:48:48.410Z',
  number: 40680,
  user: mockUser
};

// Фиктивное начальное состояние стора
export const mockStore: BurgerState = {
  ingredients: [mockIngredient, mockBun, mockIngredient2, mockIngredient3],
  userOrders: [],
  orders: [],
  totalOrdersCount: 0,
  totalOrdersTodayCount: 0,
  status: 'idle',
  orderModalData: null,
  currentIngredient: null,
  constructorItems: {
    bun: null, // Изменено с mockBun на null
    ingredients: [] // Изменено с начального списка ингредиентов на пустой массив
  },
  orderRequest: false,
  isAuthenticated: false,
  token: null,
  user: null,
  error: null,
  currentPage: 'constructor',
  ordersStatus: 'idle',
  ordersError: null,
  userOrdersStatus: 'idle',
  userOrdersError: null,
  isModalOpened: false,
  newOrderId: null
};
