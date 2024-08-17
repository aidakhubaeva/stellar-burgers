import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { fetchCurrentUser } from '../slices/burgerSlice';
import { Preloader } from '../../src/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  unAuthOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  unAuthOnly
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.burger.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.burger.user);
  const token = useSelector((state: RootState) => state.burger.token);
  const userStatus = useSelector((state: RootState) => state.burger.status);
  const location = useLocation();

  React.useEffect(() => {
    if (isAuthenticated && !user && token) {
      dispatch(fetchCurrentUser());
    } else if (!isAuthenticated) {
      console.log('Пользователь не аутентифицирован');
    }
  }, [isAuthenticated, user, token, dispatch]);

  if (userStatus === 'loading') {
    return <Preloader />;
  }

  if (!isAuthenticated && !unAuthOnly) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (unAuthOnly && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return <>{children}</>;
};
