// hooks/useToken.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeFromStorage } from '@/store/slices/userSlice';

export const useToken = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);
};