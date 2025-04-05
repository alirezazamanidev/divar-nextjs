import useSWR from 'swr';

import { User } from '../models/user';
import { callApi } from '../helpers/callapi';



interface AuthResponse {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
}

interface ApiResponse {
  user: User;
}

const fetcher = async (url: string) => {
  try {
    const response = await callApi.get<ApiResponse>(url);
    return response.data.user;
    
  } catch (error) {
    return null;
  }
};

export const useAuth = (): AuthResponse => {
  const { data: user, error, isLoading, mutate } = useSWR<User | null>(
    '/auth/check-login',
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      refreshInterval: 0
    }
  );


  return {
    user: user || null,
    isLoading,
    error: error || null,
    mutate,
  };
};
