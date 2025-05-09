import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  //IconButton,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
//import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Item } from "../../services/itemService";

import UserSingleProduct from "../User/UserSingleProduct";
import { ApiRole, useFetch } from "../../hooks/useFetch";

interface ItemListProps {
  onEdit: (item: Item) => void;
  categories?: { id: number; name: string }[];
}

const ItemList: React.FC<ItemListProps> = ({ onEdit, categories = [] }) => {
  const { data: items, apiError, loading, get } = useFetch<Item[]>(ApiRole.PUBLIC);
  const { remove } = useFetch(ApiRole.ADMIN);
  // const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  // const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);

  const fetchItems = async () => {
    await get("/items");
    if (apiError) {
      setSnackbar({
        open: true,
        message: "Failed to fetch items",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(items || []);
    } else {
      setFilteredItems(
        items?.filter((item) => item.categoryId === parseInt(categoryFilter)) || []
      );
    }
    // Reset to first page when filter changes
    setPage(0);
  }, [categoryFilter, items]);

  // Log when categories change to help debugging
  useEffect(() => {
  }, [categories]);

  // Show delete confirmation dialog
 /*  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  }; */

  // Handle actual deletion when confirmed
  const handleDelete = async () => {
    if (itemToDelete === null) return;

    try {
      await remove(`/items/${itemToDelete}`);
      setSnackbar({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete item",
        severity: "error",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  // Close confirmation dialog without deleting
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination calculations
  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openModal = (item: Item) => {
      setSelectedProduct(item);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setSelectedProduct(null);
      setIsModalOpen(false);
    };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        {/* <Typography variant="h6">Items List</Typography> */}
        <FormControl sx={{ width: 200 }}>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            label="Filter by Category"
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                No categories available
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Price
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Category
                  </TableCell>
                  
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    location
                  </TableCell>

                 {/*  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Actions
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => {
                    const category = categories.find(
                      (c) => c.id === item.categoryId
                    );
                    return (
                      <TableRow key={item.id} hover onClick={() => openModal(item)}>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: 50, height: 50 }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          {item.description}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          €
                          {typeof item.price === "string"
                            ? parseFloat(item.price).toFixed(2)
                            : item.price.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          {item.quantity}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem" }}>
                          {category ? category.name : item.categoryId}
                        </TableCell>

                        <TableCell sx={{ fontSize: "1rem" }}>
                          {item.itemLocation}
                        </TableCell>

                    {/*     <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            color="primary"
                            onClick={() => onEdit(item)}
                            size="medium"
                          >
                            <EditIcon/>
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => confirmDelete(item.id)}
                            size="medium"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        </TableCell>  */}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography
                        variant="body1"
                        sx={{ py: 3, fontSize: "1rem" }}
                      >
                        No items found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

        {isModalOpen && selectedProduct && (
          <div>
            <UserSingleProduct item={selectedProduct} onClose={closeModal} />
          </div>
        )}
    </Box>
  );
};

export default ItemList;