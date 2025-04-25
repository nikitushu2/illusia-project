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
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
//import { useState } from "react";
import React, { useEffect, useState } from "react";
// import box from "../images/box.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import itemService, {
  UpdateItemData,
  CreateItemData,
} from "../../services/itemService";
import { Item } from "../../services/itemService";
import camera from "../../images/camera.png";
import ItemForm from "../Items/ItemForm";
import { useAuth } from "../../context/AuthContext";
import UserSingleProduct from "../User/UserSingleProduct";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

//import categoryService, { Category } from "../../services/categoryService";
//import ItemList from "../Items/ItemList";
interface ItemListProps {
  onEdit?: (item: Item) => void;
  categories?: { id: number; name: string }[];
}

const AdminProducts: React.FC<ItemListProps> = ({ categories = [] }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const [modeDisplay, setModeDisplay] = React.useState("table");

  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);

  //const [refreshKey, setRefreshKey] = useState(0); // Used to force ItemList to refresh

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchInput, setSearchInput] = useState<string>(""); // for search bar

  const [itemVisibility, setItemVisibility] = useState<{
    [itemId: number]: boolean;
  }>({}); // State to track visibility per item

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
      await itemService.delete(itemToDelete);
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

      console.log("Submitting form with values:", values);
      if (selectedItem) {
        // Update existing item
        console.log("Updating item:", selectedItem.id);
        await itemService.update(selectedItem.id, values as UpdateItemData);
        setSnackbar({
          open: true,
          message: "Item updated successfully",
          severity: "success",
        });
      } else {
        // Create new item
        console.log("Creating new item");
        await itemService.create(values as CreateItemData);
        setSnackbar({
          open: true,
          message: "Item created successfully",
          severity: "success",
        });
      }

      // Close modal and refresh items list
      setIsModalOpen(false);
      setSelectedItem(undefined);
      fetchItems(); // Refresh the items list
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
    console.log("Visibility off for:", item);

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

  //HANDLE TABLE VIEW
  const handleListView = () => {
    return (
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          "& .MuiTableCell-root": {
            whiteSpace: "nowrap",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "@media (max-width: 600px)": {
              padding: "8px",
              fontSize: "0.75rem",
            },
          },
          "& .MuiTableHead-root": {
            "@media (max-width: 600px)": {
              "& .MuiTableCell-root": {
                fontSize: "0.75rem",
                fontWeight: "bold",
              },
            },
          },
          "& .MuiTableRow-root": {
            "@media (max-width: 600px)": {
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
          },
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 800,
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
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "50px",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                >
                  Image
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "150px",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "200px",
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "80px",
                  }}
                >
                  Size
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "80px",
                  }}
                >
                  Color
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "120px",
                  }}
                >
                  Item Location
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "120px",
                  }}
                >
                  Storage Location
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "80px",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "120px",
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
                    style={{ opacity: itemVisibility[item.id] ? 1 : 0.5 }}
                    onClick={() => openModal(item)}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.description}
                          style={{
                            width: { xs: "50px", sm: "150px" },
                            height: { xs: "50px", sm: "150px" },
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <img
                          src={camera}
                          alt="No Image Available"
                          style={{
                            width: { xs: "50px", sm: "150px" },
                            height: { xs: "50px", sm: "150px" },
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.itemLocation}</TableCell>
                    <TableCell>
                      {item.storageLocation || item.storage_location || "N/A"}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
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
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
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
                          onClick={() => confirmDelete(item.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => visibilityToggle(item)}
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
    );
  };

  //HANDLE GRID VIEW
  const handleGridView = () => {
    return (
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
                  <Button onClick={() => confirmDelete(item.id)}>Delete</Button>
                  <Button onClick={() => visibilityToggle(item)} size="medium">
                    {itemVisibility[item.id] ? "Hide" : "Show"}
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Paper>
      </div>
    );
  };

  //FETCH ALL ITEMS
  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log("Fetching items...");
      const data = await itemService.getAll();
      console.log("Fetched items:", data);
      setItems(data);
      setFilteredItems(data);

      const initialVisibility: { [itemId: number]: boolean } = {};
      data.forEach((item) => {
        initialVisibility[item.id] = true;
      });
      setItemVisibility(initialVisibility);
    } catch (error) {
      console.error("Error fetching items:", error);
      // message.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    console.log("Categories in ItemList:", categories);
  }, [categories]);

  // Filter items by category
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => item.categoryId === parseInt(categoryFilter))
      );
    }
    // Reset any pagination if implemented later
  }, [categoryFilter, items]);

  //HANDLE CATEGORY FILTER
  const handleByCategory = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  // const toggleDisplayMode = () => {
  //   setModeDisplay(prevMode => (prevMode === "table" ? "grid" : "table"));
  // };

  // grid view
  //  const handleGridView = () => {
  //   console.log("grid");
  //   setGrid(!grid);
  // };

  // list view
  // const handleListView = () => {
  //   console.log("list");
  //   setList(!list);
  // };

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
    console.log("searching");
    event.preventDefault();

    const searchInput = event.target.value;
    setSearchInput(searchInput);
    console.log("searchInput", searchInput);

    if (searchInput === "") {
      setFilteredItems(items);
    } else {
      const filteredItems = items.filter((item) =>
        item.description.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredItems(filteredItems);
    }
  };

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
          gap: "20px",
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
            }}
          >
            ADD NEW ITEM
          </Button>
        </Box>

        {/* filter by category */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: "20px", sm: "0" },
            marginTop: { xs: "20px", sm: "0" },
          }}
        >
          <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
            <InputLabel id="category-filter-label">
              Filter by Category
            </InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              label="Filter by Category"
              onChange={handleByCategory}
              sx={{
                height: { xs: "40px", sm: "56px" },
              }}
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : modeDisplay === "table" ? (
        handleListView()
      ) : (
        handleGridView()
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
