import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../services/store';
import { setCurrentPage } from '../slices/burgerSlice';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToPage = (page: string | number, path: string) => {
    if (typeof page === 'string') {
      dispatch(setCurrentPage(page));
    }
    navigate(path);
  };

  return { goToPage };
};
