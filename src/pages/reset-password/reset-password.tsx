import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { useAppNavigation } from '../../hooks/useAppNavigation';

export const ResetPassword: FC = () => {
  const { goToPage } = useAppNavigation();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        goToPage('login', '/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      goToPage('forgot-password', '/forgot-password');
    }
  }, [goToPage]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
