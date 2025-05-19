import { ApiRole, useFetch } from '../hooks/useFetch';
import { useEffect, useCallback } from 'react';

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

export interface CreateCategoryData {
  name: string;
  description: string;
}

const useCategories = () => {
  const { data, loading, apiError, get } = useFetch<Category[]>(ApiRole.PUBLIC);
  const { data: singleCategory, get: getSingle } = useFetch<Category>(ApiRole.PUBLIC);
  // Use PUBLIC role since we're now only using the public endpoint
  const { data: createdCategory, post } = useFetch<Category>(ApiRole.PUBLIC);

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

  const refresh = useCallback(async () => {
    console.log('Forcing refresh of categories from server');
    // Make a new request to get fresh data
    await get('categories');
    return data || [];
  }, [get, data]);

  const getById = async (id: number): Promise<Category | null> => {
    await getSingle(`categories/${id}`);
    return singleCategory || null;
  };

  const create = async (categoryData: CreateCategoryData): Promise<Category | null> => {
    await post('categories', categoryData);
    // Force immediate refresh of categories
    await refresh();
    return createdCategory;
  };

  return {
    getAll,
    getById,
    create,
    refresh,
    categories: data || [],
    loading,
    error: apiError
  };
};

export default useCategories; 