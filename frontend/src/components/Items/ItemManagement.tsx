import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";
import itemService, {
  Item,
  CreateItemData,
  UpdateItemData,
} from "../../services/itemService";
import categoryService, { Category } from "../../services/categoryService";
import { API_URL } from "../../config";

const ItemManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0); // Used to force ItemList to refresh
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    // Log API URL to help with debugging
    console.log("API URL being used:", API_URL);

    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        console.log("Fetching categories...");
        const data = await categoryService.getAll();
        console.log("Categories fetched successfully:", data);
        setCategories(data);

        // Fallback to hardcoded values if no categories were returned
        if (!data || data.length === 0) {
          console.warn("No categories returned from API, using fallback data");
          setCategories([
            {
              id: 1,
              name: "Helmets",
              description: "Military helmets",
              createdAt: "",
              updatedAt: "",

              // size: "L",
              // color: "red",
              // itemLocation: "Helsinki",
              // storageLocation: "Storage Room 1",
            },
            {
              id: 2,
              name: "Combat Vests",
              description: "Tactical vests",
              createdAt: "",
              updatedAt: "",

              // size: "L",
              // color: "black",
              // itemLocation: "Helsinki",
              // storageLocation: "Storage Room 2",
            },
            {
              id: 3,
              name: "Gloves (Disposable)",
              description: "First aid kits",
              createdAt: "",
              updatedAt: "",

              // size: "L",
              // color: "white",
              // itemLocation: "Helsinki",
              // storageLocation: "Storage Room 3"
            },
            {
              id: 4,
              name: "Goggles/Masks",
              description: "Protective eyewear and masks",
              createdAt: "",
              updatedAt: "",

              // size: "",
              // color: "black",
              // itemLocation: "Helsinki",
              // storageLocation: "Storage Room 2",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError("Failed to load categories. Using fallback data.");

        // Use fallback categories if API fails
        setCategories([
          {
            id: 1,
            name: "Helmets",
            description: "Military helmets",
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 2,
            name: "Combat Vests",
            description: "Tactical vests",
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 3,
            name: "Gloves (Disposable)",
            description: "First aid kits",
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 4,
            name: "Goggles/Masks",
            description: "Protective eyewear and masks",
            createdAt: "",
            updatedAt: "",
          },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  // update edit item not working
  const handleSubmit = async (values: CreateItemData | UpdateItemData) => {
    try {
      console.log("Submitting form with values:", values);
      if (selectedItem) {
        // Update existing item
        console.log("Updating item:", selectedItem.id);
        await itemService.update(selectedItem.id, values as UpdateItemData);
      } else {
        // Create new item is removed as it's not needed here
        console.log("Creating items is not supported in this component");
        return;
      }
      setIsModalOpen(false);
      setSelectedItem(undefined);
      // Force ItemList to refresh
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error submitting item:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            fontWeight="bold"
          >
            Item display for All
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {categoriesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : categoriesError ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {categoriesError}
          </Alert>
        ) : null}

        {/* ItemList component with key to force refresh */}
        <ItemList
          key={refreshKey}
          onEdit={handleEdit}
          categories={categories}
        />

        {/* Edit Item Modal */}
        <Dialog
          open={isModalOpen}
          onClose={handleCancel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <ItemForm
                initialValues={selectedItem}
                onSubmit={handleSubmit}
                categories={categories}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ItemManagement;
