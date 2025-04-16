import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
              description: "Military helmets and accessories",
              createdAt: "",
              updatedAt: "",
            },
            {
              id: 2,
              name: "Combat Vests",
              description: "Tactical vests and gear",
              createdAt: "",
              updatedAt: "",
            },
            {
              id: 3,
              name: "Medical Supplies",
              description: "First aid kits and medical equipment",
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
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError("Failed to load categories. Using fallback data.");

        // Use fallback categories if API fails
        setCategories([
          {
            id: 1,
            name: "Helmets",
            description: "Military helmets and accessories",
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 2,
            name: "Combat Vests",
            description: "Tactical vests and gear",
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 3,
            name: "Medical Supplies",
            description: "First aid kits and medical equipment",
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

  const handleCreate = () => {
    console.log("Opening create modal");
    setSelectedItem(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = async (values: CreateItemData | UpdateItemData) => {
    try {
      console.log("Submitting form with values:", values);
      if (selectedItem) {
        // Update existing item
        console.log("Updating item:", selectedItem.id);
        await itemService.update(selectedItem.id, values as UpdateItemData);
      } else {
        // Create new item
        console.log("Creating new item");
        await itemService.create(values as CreateItemData);
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
           Inventory
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ borderRadius: 2 }}
          >
            Add New Item
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {categoriesError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {categoriesError}
          </Alert>
        )}

        {categoriesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ItemList
            key={refreshKey}
            onEdit={handleEdit}
            categories={categories}
          />
        )}

        <Dialog
          open={isModalOpen}
          onClose={handleCancel}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedItem ? "Edit Item" : "Create New Item"}
          </DialogTitle>
          <DialogContent dividers>
            <ItemForm
              initialValues={selectedItem}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              categories={categories}
            />
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
