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
  IconButton,
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
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import itemService, { Item } from "../../services/itemService";

interface ItemListProps {
  onEdit: (item: Item) => void;
  categories?: { id: number; name: string }[];
}

const ItemList: React.FC<ItemListProps> = ({ onEdit, categories = [] }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log("Fetching items...");
      const data = await itemService.getAll();
      console.log("Fetched items:", data);
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch items",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => item.categoryId === parseInt(categoryFilter))
      );
    }
    // Reset to first page when filter changes
    setPage(0);
  }, [categoryFilter, items]);

  // Log when categories change to help debugging
  useEffect(() => {
    console.log("Categories in ItemList:", categories);
  }, [categories]);

  const handleDelete = async (id: number) => {
    try {
      await itemService.delete(id);
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
    }
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
        <Typography variant="h6">Items List</Typography>
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Image
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => {
                    const category = categories.find(
                      (c) => c.id === item.categoryId
                    );
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: 50, height: 50 }}
                          />
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          €
                          {typeof item.price === "string"
                            ? parseFloat(item.price).toFixed(2)
                            : item.price.toFixed(2)}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {category ? category.name : item.categoryId}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => onEdit(item)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item.id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body1" sx={{ py: 3 }}>
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
    </Box>
  );
};

export default ItemList;
