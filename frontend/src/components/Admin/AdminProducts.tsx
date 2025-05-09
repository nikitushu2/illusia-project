import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Pagination,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useItems, {
  UpdateItemData,
  CreateItemData,
  Item,
} from "../../services/itemService";
import camera from "../../images/camera.png";
import ItemForm from "../Items/ItemForm";
import { useAuth } from "../../context/AuthContext";
import UserSingleProduct from "../User/UserSingleProduct";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface ItemListProps {
  onEdit?: (item: Item) => void;
  categories?: { id: number; name: string }[];
}

const AdminProducts: React.FC<ItemListProps> = ({ categories = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const {
    items,
    loading,
    error,
    create,
    update,
    delete: deleteItem,
    refresh,
  } = useItems();

  // Add debug logging
  console.log("isMobile:", isMobile);
  console.log("window.innerWidth:", window.innerWidth);

  const { isLoggedIn, isAdmin } = useAuth();
  const [modeDisplay, setModeDisplay] = React.useState("table");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");

  const [itemVisibility, setItemVisibility] = useState<{
    [itemId: number]: boolean;
  }>({});

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = React.useState<Item | null>(
    null
  );

  const [singleItemModal, setSingleItemModal] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize the visibility state when items are loaded
  useEffect(() => {
    if (items && items.length > 0) {
      const initialVisibility: { [itemId: number]: boolean } = {};
      items.forEach((item) => {
        initialVisibility[item.id] = true;
      });
      setItemVisibility(initialVisibility);
    }
  }, [items]);

  // Filter items by category
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => item.categoryId === parseInt(categoryFilter))
      );
    }
    // Reset pagination when filter changes
    setPage(1);
  }, [categoryFilter, items]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching items:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch items",
        severity: "error",
      });
    }
  }, [error]);

  const toggleDisplayMode = () => {
    setModeDisplay((prevMode) => (prevMode === "table" ? "grid" : "table"));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleEdit = (item: Item) => {
    if (!isLoggedIn) {
      setSnackbar({
        open: true,
        message: "You must be logged in to edit items",
        severity: "error",
      });
      return;
    }

    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Open and close modal for viewing Single Items details
  const openModal = (item: Item) => {
    setSelectedProduct(item);
    setSingleItemModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSingleItemModal(false);
  };

  // Handle actual deletion when confirmed
  const handleDelete = async () => {
    if (itemToDelete === null) return;

    try {
      await deleteItem(itemToDelete);
      setSnackbar({
        open: true,
        message: "Item deleted successfully",
        severity: "success",
      });
      refresh();
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

  // Show delete confirmation dialog
  const confirmDelete = (id: number) => {
    if (!isLoggedIn) {
      setSnackbar({
        open: true,
        message: "You must be logged in to delete items",
        severity: "error",
      });
      return;
    }

    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: "Only admins can delete items",
        severity: "error",
      });
      return;
    }

    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Close confirmation dialog without deleting
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (values: UpdateItemData) => {
    try {
      if (!isLoggedIn) {
        setSnackbar({
          open: true,
          message: "You must be logged in to perform this action",
          severity: "error",
        });
        return;
      }

      if (
        !isAdmin &&
        (selectedItem === undefined ||
          values.categoryId !== selectedItem.categoryId)
      ) {
        setSnackbar({
          open: true,
          message: "Only admins can change categories or create new items",
          severity: "error",
        });
        return;
      }

      setSnackbar({
        open: false,
        message: "",
        severity: "success",
      });

      if (selectedItem) {
        // Update existing item
        await update(selectedItem.id, values as UpdateItemData);
        setSnackbar({
          open: true,
          message: "Item updated successfully",
          severity: "success",
        });
      } else {
        // Create new item
        const result = await create(values as CreateItemData);
        console.log("Created new item:", result);
        setSnackbar({
          open: true,
          message: "Item created successfully",
          severity: "success",
        });
      }

      // Close modal
      setIsModalOpen(false);
      setSelectedItem(undefined);
      refresh(); // Refresh the items list
    } catch (error) {
      console.error("Error submitting item:", error);
      setSnackbar({
        open: true,
        message: selectedItem
          ? "Failed to update item. Make sure you're logged in with appropriate permissions."
          : "Failed to create item. Make sure you're logged in with appropriate permissions.",
        severity: "error",
      });
    }
  };

  //visibility toggle function
  const visibilityToggle = (item: Item) => {
    setItemVisibility((prevVisibility) => ({
      ...prevVisibility,
      [item.id]: !prevVisibility[item.id],
    }));
  };

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const indexOfLastItem = page * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  //HANDLE CATEGORY FILTER
  const handleByCategory = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  // handle add new item
  const handleCreate = () => {
    if (!isLoggedIn) {
      setSnackbar({
        open: true,
        message: "You must be logged in to create items",
        severity: "error",
      });
      return;
    }

    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: "Only admins can create new items",
        severity: "error",
      });
      return;
    }

    console.log("Opening create modal");
    setSelectedItem(undefined);
    setIsModalOpen(true);
  };

  // SEARCH MANUALLY TYPED ITEMS
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const searchInput = event.target.value;
    setSearchInput(searchInput);

    if (searchInput === "") {
      setFilteredItems(items);
    } else {
      const filteredItems = items.filter((item) =>
        item.description.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredItems(filteredItems);
    }
  };

  // If loading is true, show a loading indicator
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {!isLoggedIn && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You need to be logged in to create, edit, or delete items.
        </Alert>
      )}

      {isLoggedIn && !isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You are logged in but need admin permissions to create or delete
          items.
        </Alert>
      )}

      <Box
        sx={{
          display: "column",
          marginBottom: "50px",
          marginTop: "10px",
          gap: { xs: "30px", sm: "20px" },
          paddingX: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: { xs: "stretch", sm: "center" },
            marginTop: "50px",
            gap: { xs: "20px", sm: "50px" },
          }}
        >
          <TextField
            onChange={handleSearch}
            value={searchInput}
            label="search item"
            sx={{
              width: { xs: "100%", sm: "50%" },
              "& .MuiInputBase-root": {
                height: { xs: "40px", sm: "56px" },
              },
            }}
          />
          <Button
            onClick={handleCreate}
            sx={{
              width: { xs: "100%", sm: "auto" },
              height: { xs: "40px", sm: "56px" },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              // fontWeight: "bold",
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            ADD NEW ITEM
          </Button>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "10px" }}>
        {/* filter by category */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: "20px", sm: "0" },
            marginTop: { xs: "20px", sm: "0" },
            padding: { xs: "20px", sm: "0" },
            backgroundColor: { xs: "background.paper", sm: "transparent" },
            borderRadius: { xs: 2, sm: 0 },
            boxShadow: { xs: 2, sm: 0 },
          }}
        >
          <FormControl
            sx={{
              width: { xs: "100%", sm: 200 },
              "& .MuiInputBase-root": {
                height: { xs: "40px", sm: "56px" },
              },
            }}
          >
            <InputLabel id="category-filter-label">
              Filter by Category
            </InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              label="Filter by Category"
              onChange={handleByCategory}
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

          {/* grid and list views */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: { xs: "center", sm: "flex-end" },
              marginTop: { xs: "10px", sm: "0" },
            }}
          >
            <IconButton
              onClick={toggleDisplayMode}
              sx={{
                fontSize: { xs: 30, sm: 40 },
                color: "primary.main",
                cursor: "pointer",
              }}
            >
              <AppsIcon />
            </IconButton>
            <IconButton
              onClick={toggleDisplayMode}
              sx={{
                fontSize: { xs: 30, sm: 40 },
                color: "primary.main",
                cursor: "pointer",
              }}
            >
              <TableRowsIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {modeDisplay === "table" ? (
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            marginTop: { xs: 2, sm: 4 },
            padding: { xs: 1, sm: 2 },
            "& .MuiTableCell-root": {
              whiteSpace: "nowrap",
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: { xs: "8px 4px", sm: "16px" },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
            "& .MuiTableHead-root": {
              "& .MuiTableCell-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                fontWeight: "bold",
                backgroundColor: "primary.main",
                color: "white",
                padding: { xs: "8px 4px", sm: "16px" },
              },
            },
            "& .MuiTableRow-root": {
              "&:hover": {
                backgroundColor: "action.hover",
              },
              "&:last-child td": {
                borderBottom: 0,
              },
            },
          }}
        >
          <TableContainer
            sx={{
              maxHeight: 800,
              borderRadius: 2,
              boxShadow: 2,
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      minWidth: { xs: "80px", sm: "100px" },
                    }}
                  >
                    Image
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "120px", sm: "150px" },
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "150px", sm: "200px" },
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "60px", sm: "80px" },
                    }}
                  >
                    Size
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "60px", sm: "80px" },
                    }}
                  >
                    Color
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "60px", sm: "80px" },
                    }}
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "100px", sm: "120px" },
                    }}
                  >
                    Item Location
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "80px", sm: "100px" },
                    }}
                  >
                    Category
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: { xs: "100px", sm: "120px" },
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((item) => {
                  const category = categories.find(
                    (c) => c.id === item.categoryId
                  );
                  return (
                    <TableRow
                      key={item.id}
                      onClick={() => openModal(item)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            width: { xs: 50, sm: 100 },
                            height: { xs: 50, sm: 100 },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={item.imageUrl || camera}
                            alt={item.description || "No Image Available"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.itemLocation}</TableCell>
                      <TableCell>
                        {category
                          ? category.name
                          : item.categoryId
                          ? `Category ${item.categoryId}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: { xs: 0.5, sm: 1 },
                            "& .MuiIconButton-root": {
                              padding: { xs: "4px", sm: "8px" },
                            },
                          }}
                        >
                          <IconButton
                            color="primary"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEdit(item);
                            }}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={(event) => {
                              event.stopPropagation();
                              confirmDelete(item.id);
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={(event) => {
                              event.stopPropagation();
                              visibilityToggle(item);
                            }}
                            size="small"
                          >
                            {itemVisibility[item.id] ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <div>
          <Paper
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
              padding: 2,
            }}
          >
            {currentItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <Card
                  key={item.id}
                  sx={{
                    height: 400,
                    width: 250,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                  style={{ opacity: itemVisibility[item.id] ? 1 : 0.5 }}
                >
                  <CardMedia
                    sx={{ height: 200, width: "100%", objectFit: "cover" }}
                    image={item.imageUrl || camera}
                    title={item.description}
                  />
                  <CardContent
                    sx={{ textAlign: "center", cursor: "pointer" }}
                    onClick={() => openModal(item)}
                  >
                    <p style={{ fontWeight: "bold", margin: 0 }}>{item.name}</p>
                    <p style={{ margin: 0 }}>{item.description}</p>
                    <p style={{ margin: 0 }}>ID: {item.id}</p>
                    <p style={{ margin: 0, color: "gray" }}>
                      Category:{" "}
                      {category
                        ? category.name
                        : item.categoryId
                        ? `Category ${item.categoryId}`
                        : "N/A"}
                    </p>
                  </CardContent>
                  <CardActions>
                    <Button onClick={() => handleEdit(item)}>Edit</Button>
                    <Button onClick={() => confirmDelete(item.id)}>
                      Delete
                    </Button>
                    <Button
                      onClick={() => visibilityToggle(item)}
                      size="medium"
                    >
                      {itemVisibility[item.id] ? "Hide" : "Show"}
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Paper>
        </div>
      )}

      {/* open a modal to edit/create an item */}
      <Dialog
        open={isModalOpen}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 5,
            paddingBottom: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            py: 2,
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          {selectedItem ? "Edit Item" : "Create New Item"}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <ItemForm
            initialValues={selectedItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            categories={categories}
          />
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            onClick={handleCancel}
            variant="outlined"
            color="primary"
            size="large"
          >
            Cancel
          </Button>
          <Button
            form="item-form"
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            {selectedItem ? "Save Changes" : "Create Item"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCancelDelete}>
        <DialogTitle sx={{ backgroundColor: "primary.main", color: "white" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 1, px: 3, minWidth: "400px" }}>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
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

      <Stack spacing={2} paddingTop={5} alignItems={"center"}>
        <Pagination
          count={Math.ceil(filteredItems.length / ITEMS_PER_PAGE)}
          onChange={(_, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
        />
      </Stack>

      {singleItemModal && selectedProduct && (
        <div>
          <UserSingleProduct
            item={selectedProduct}
            onClose={closeModal}
            buttonText="Edit"
            onEdit={() => {
              closeModal();
              handleEdit(selectedProduct);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
