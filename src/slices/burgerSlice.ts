import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getIngredientsApi,
  orderBurgerApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  getFeedsApi,
  getOrdersApi,
  getUserApi
} from '../utils/burger-api';
import {
  TIngredient,
  TConstructorIngredient,
  TUser,
  TRegisterData,
  TLoginData,
  TOrder
} from '../utils/types';
import { setCookie, deleteCookie, getCookie } from '../utils/cookie';

// Определение типов для ответов API
interface OrderResponse {
  name: string;
  order: TOrder;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

// Начальное состояние
interface BurgerState {
  ingredients: TIngredient[];
  userOrders: TOrder[];
  orders: TOrder[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  orderModalData: TOrder | null;
  currentIngredient: TIngredient | null;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: { item: TConstructorIngredient; count: number }[];
  };
  orderRequest: boolean;
  isAuthenticated: boolean;
  token: string | null;
  user: TUser | null;
  error: string | null;
  currentPage: string;
  ordersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  ordersError: string | null;
  userOrdersStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  userOrdersError: string | null;
  isModalOpened: boolean;
  newOrderId: string | null;
}

const initialState: BurgerState = {
  ingredients: [],
  userOrders: [],
  orders: [],
  status: 'idle',
  orderModalData: null,
  currentIngredient: null,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  token: getCookie('accessToken') || null,
  isAuthenticated: !!getCookie('accessToken'),
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

// Асинхронные экшены

// Получение всех заказов
export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('burger/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return response.orders;
  } catch (err) {
    return rejectWithValue('Не удалось получить заказы');
  }
});

// Получение данных о ингредиентах для конструктора
export const fetchBurgerData = createAsyncThunk(
  'burger/fetchBurgerData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      if (!response) {
        throw new Error('Ошибка: данные от сервера не получены');
      }
      return response;
    } catch (err) {
      return rejectWithValue(
        'Не удалось получить данные об ингредиентах. Пожалуйста, попробуйте позже.'
      );
    }
  }
);

// Создание заказа с проверкой токена
export const createOrder = createAsyncThunk<OrderResponse, string[]>(
  'burger/createOrder',
  async (ingredientIds, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      if (!response || !response.order) {
        throw new Error('Ошибка: некорректный ответ от сервера');
      }

      const state = getState() as { burger: BurgerState };
      const user = state.burger.user;

      if (user) {
        response.order.user = user.email;
      }
      dispatch(setNewOrderId(response.order._id));
      return response;
    } catch (err) {
      return rejectWithValue('Failed to place order. Please try again later.');
    }
  }
);

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('burger/fetchUserOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (err) {
    return rejectWithValue('Не удалось получить заказы пользователя');
  }
});

export const fetchCurrentUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('auth/fetchCurrentUser', async (_, { rejectWithValue, dispatch }) => {
  try {
    const response = await getUserApi();
    if (response && response.success) {
      dispatch(setUser(response.user));
      return response.user;
    } else {
      return rejectWithValue('Failed to fetch user');
    }
  } catch (err) {
    return rejectWithValue('Failed to fetch user');
  }
});

// Логин пользователя
export const fetchLoginUser = createAsyncThunk<LoginResponse, TLoginData>(
  'burger/login',
  async (data, { dispatch }) => {
    try {
      const response: LoginResponse = await loginUserApi(data);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      dispatch(setToken(response.accessToken));
      dispatch(setUser(response.user));
      return response;
    } catch (err) {
      throw err;
    }
  }
);

// Регистрация пользователя
export const fetchRegisterUser = createAsyncThunk<
  RegisterResponse,
  TRegisterData
>('burger/register', async (data) => {
  try {
    const response: RegisterResponse = await registerUserApi(data);
    return response;
  } catch (err) {
    throw err;
  }
});

// Выход пользователя (Logout)
export const fetchLogoutUser = createAsyncThunk(
  'burger/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (err) {
      return rejectWithValue('Failed to logout. Please try again.');
    }
  }
);

// Обновление пользователя
export const updateUser = createAsyncThunk<
  TUser,
  TUser,
  { rejectValue: string }
>('auth/updateUser', async (userData, { rejectWithValue }) => {
  try {
    console.log('Начало обновления пользователя с данными:', userData);
    const response = await updateUserApi(userData);
    if (!response || !response.user) {
      console.error(
        'Некорректный ответ от сервера при обновлении пользователя:',
        response
      );
      return rejectWithValue(
        'Не удалось обновить пользователя: некорректный ответ от сервера.'
      );
    }

    console.log('Пользователь успешно обновлен:', response.user);
    return response.user;
  } catch (err) {
    console.error('Ошибка при обновлении пользователя:', err);
    return rejectWithValue(
      'Не удалось обновить пользователя: произошла ошибка.'
    );
  }
});

// Создание слайса
const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    closeOrderRequest(state) {
      state.orderRequest = false;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    addIngredientToConstructor(
      state,
      action: PayloadAction<TConstructorIngredient>
    ) {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.constructorItems.bun = ingredient;
      } else {
        const existingIngredient = state.constructorItems.ingredients.find(
          (i) => i.item._id === ingredient._id
        );
        if (existingIngredient) {
          existingIngredient.count += 1;
        } else {
          state.constructorItems.ingredients.push({
            item: ingredient,
            count: 1
          });
        }
      }
    },
    removeIngredientFromConstructor(state, action: PayloadAction<string>) {
      const id = action.payload;
      const existingIngredient = state.constructorItems.ingredients.find(
        (i) => i.item._id === id
      );
      if (existingIngredient) {
        if (existingIngredient.count > 1) {
          existingIngredient.count -= 1;
        } else {
          state.constructorItems.ingredients =
            state.constructorItems.ingredients.filter((i) => i.item._id !== id);
        }
      }
    },
    moveIngredientInConstructor(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const movedItem = state.constructorItems.ingredients.splice(
        fromIndex,
        1
      )[0];
      state.constructorItems.ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor(state) {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    setCurrentIngredient(state, action: PayloadAction<TIngredient>) {
      state.currentIngredient = action.payload;
    },
    clearCurrentIngredient(state) {
      state.currentIngredient = null;
    },
    setCurrentPage(state, action: PayloadAction<string>) {
      state.currentPage = action.payload;
    },
    setOrderModalData(state, action: PayloadAction<TOrder>) {
      state.orderModalData = action.payload;
    },
    clearOrderModalData(state) {
      state.orderModalData = null;
    },
    openModal(state) {
      state.isModalOpened = true;
    },
    closeModal(state) {
      state.isModalOpened = false;
    },
    setNewOrderId(state, action: PayloadAction<string | null>) {
      state.newOrderId = action.payload;
    },
    setOrders(state, action: PayloadAction<TOrder[]>) {
      state.orders = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.ordersStatus = 'loading';
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.ordersStatus = 'succeeded';
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersStatus = 'failed';
        state.ordersError = action.payload || 'Не удалось получить заказы';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersStatus = 'loading';
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.userOrdersStatus = 'succeeded';
          state.userOrders = action.payload;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersStatus = 'failed';
        state.userOrdersError =
          action.payload || 'Не удалось получить заказы пользователя';
      })
      .addCase(fetchBurgerData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBurgerData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ingredients = action.payload;
      })
      .addCase(fetchBurgerData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<OrderResponse>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload.order;
          state.currentPage = 'feed-info';
          state.constructorItems = { bun: null, ingredients: [] };
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Failed to place order';
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchLoginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = 'succeeded';
          state.isAuthenticated = true;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to login';
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchRegisterUser.fulfilled,
        (state, action: PayloadAction<RegisterResponse>) => {
          state.status = 'succeeded';
          state.isAuthenticated = true;
          state.user = action.payload.user;
          setCookie('accessToken', action.payload.accessToken);
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      )
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to register';
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        deleteCookie('accessToken');
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.status = 'succeeded';
          state.user = action.payload;
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.error = action.payload || 'Failed to fetch user';
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        console.log('Пользователь успешно обновлен:', action.payload);
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.error('Ошибка при обновлении пользователя:', action.payload);
        state.error = action.payload as string;
      });
  }
});

export const {
  closeOrderRequest,
  setToken,
  setUser,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientInConstructor,
  clearConstructor,
  setCurrentIngredient,
  clearCurrentIngredient,
  setCurrentPage,
  setOrderModalData,
  clearOrderModalData,
  openModal,
  closeModal,
  setNewOrderId,
  setOrders
} = burgerSlice.actions;

// Селекторы
export const selectBurgerIngredients = (state: { burger: BurgerState }) =>
  state.burger.ingredients;
export const selectBurgerConstructorItems = (state: { burger: BurgerState }) =>
  state.burger.constructorItems;
export const selectCurrentIngredient = (state: { burger: BurgerState }) =>
  state.burger.currentIngredient;
export const selectBurgerStatus = (state: { burger: BurgerState }) =>
  state.burger.status;
export const selectOrderRequest = (state: { burger: BurgerState }) =>
  state.burger.orderRequest;
export const selectBurgerError = (state: { burger: BurgerState }) =>
  state.burger.error;
export const selectOrderModalData = (state: { burger: BurgerState }) =>
  state.burger.orderModalData;
export const selectIsAuthenticated = (state: { burger: BurgerState }) =>
  state.burger.isAuthenticated;
export const selectCurrentPage = (state: { burger: BurgerState }) =>
  state.burger.currentPage;
export const selectOrders = (state: { burger: BurgerState }) =>
  state.burger.orders;
export const selectOrdersStatus = (state: { burger: BurgerState }) =>
  state.burger.ordersStatus;
export const selectOrdersError = (state: { burger: BurgerState }) =>
  state.burger.ordersError;
export const selectUserOrders = (state: { burger: BurgerState }) =>
  state.burger.userOrders;
export const selectUserOrdersStatus = (state: { burger: BurgerState }) =>
  state.burger.userOrdersStatus;
export const selectUserOrdersError = (state: { burger: BurgerState }) =>
  state.burger.userOrdersError;
export const selectIsModalOpened = (state: { burger: BurgerState }) =>
  state.burger.isModalOpened;
export const selectNewOrderId = (state: { burger: BurgerState }) =>
  state.burger.newOrderId;
export const selectToken = (state: { burger: BurgerState }) =>
  state.burger.token;
export const selectUser = (state: { burger: BurgerState }) => state.burger.user;

export default burgerSlice.reducer;
