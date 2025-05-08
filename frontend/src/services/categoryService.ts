import { ApiRole, useFetch } from '../hooks/useFetch';
import { useEffect } from 'react';

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  // size: string;
  // color: string;
  // itemLocation: string;
  // storageLocation: string;
}

const useCategories = () => {
  const { data, loading, apiError, get } = useFetch<Category[]>(ApiRole.PUBLIC);
  const { data: singleCategory, get: getSingle } = useFetch<Category>(ApiRole.PUBLIC);

  // Load categories on mount
  useEffect(() => {
    getAll();
  }, []);

  const getAll = async (): Promise<Category[]> => {
    if (!loading && !data) {
      await get('categories');
    }
    return data || [];
  };

  const getById = async (id: number): Promise<Category | null> => {
    await getSingle(`categories/${id}`);
    return singleCategory || null;
  };

  return {
    getAll,
    getById,
    categories: data || [],
    loading,
    error: apiError
  };
};

export default useCategories; 