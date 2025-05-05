import { ApiRole, useFetch } from '../hooks/useFetch';
import { useEffect, useState, useCallback } from 'react';

export interface Item {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;

  size: string;
  color: string;
  itemLocation: string;
  storageLocation: string;
  storage_location?: string;
}

export interface CreateItemData {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  categoryId: number;

  size: string;
  color: string;
  itemLocation: string;
  storageLocation: string;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
  categoryId?: number;

  size?: string;
  color?: string;
  itemLocation?: string;
  storageLocation?: string;
}

const useItems = () => {
  const { data: fetchedItems, loading, apiError, get } = useFetch<Item[]>(ApiRole.PUBLIC);
  const { data: singleItem, get: getSingle } = useFetch<Item>(ApiRole.PUBLIC);
  const { post } = useFetch<Item>(ApiRole.PRIVATE);
  const { put } = useFetch<Item>(ApiRole.PRIVATE);
  const { remove } = useFetch<void>(ApiRole.ADMIN);
  
  // Local state to manage items
  const [items, setItems] = useState<Item[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Function to force refresh
  const refreshItems = useCallback(() => {
    setRefreshFlag(prev => prev + 1);
  }, []);

  // Load items on mount or when refreshFlag changes
  useEffect(() => {
    const loadItems = async () => {
      await get('items');
    };
    loadItems();
  }, [get, refreshFlag]);

  // Update local items state whenever fetchedItems changes
  useEffect(() => {
    if (fetchedItems) {
      setItems(fetchedItems);
    }
  }, [fetchedItems]);

  const getAll = async (): Promise<Item[]> => {
    await get('items');
    return items || [];
  };

  const getById = async (id: number): Promise<Item | null> => {
    await getSingle(`items/${id}`);
    return singleItem || null;
  };

  const create = async (data: CreateItemData): Promise<Item | null> => {
    await post('items', data);
    // Refresh items list after creating
    refreshItems();
    return singleItem;
  };

  const update = async (id: number, data: UpdateItemData): Promise<Item | null> => {
    await put(`items/${id}`, data);
    // Refresh items list after updating
    refreshItems();
    return singleItem;
  };

  const deleteItem = async (id: number): Promise<void> => {
    await remove(`items/${id}`, null);
    // Refresh items list after deleting
    refreshItems();
  };

  return {
    getAll,
    getById,
    create,
    update,
    delete: deleteItem,
    items: items || [],
    loading,
    error: apiError,
    refresh: refreshItems
  };
};

export default useItems; 