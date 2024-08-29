import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from './store';
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
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.burger.isAuthenticated);
  const user = useSelector((state) => state.burger.user);
  const token = useSelector((state) => state.burger.token);
  const userStatus = useSelector((state) => state.burger.status);
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
