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
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
//import { useState } from "react";
import React, { useEffect, useState } from "react";
// import box from "../images/box.png";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import itemService, { UpdateItemData } from "../../services/itemService";
import { Item } from "../../services/itemService";
import camera from "../../images/camera.png";
import ItemForm from "../Items/ItemForm";
import ItemList from "../Items/ItemList";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import ToogleVisibility from "../functions";

interface ItemListProps {
  onEdit: (item: Item) => void;
  categories?: { id: number; name: string }[];
}

// const AdminProducts: React.FC<ItemListProps> = ({ onEdit, categories = [] }) => {

const AdminProducts: React.FC<ItemListProps> = ({
  onEdit , categories = []}) => {

  const [modeDisplay, setModeDisplay] = React.useState("table");

  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  //const [refreshKey, setRefreshKey] = useState(0); // Used to force ItemList to refresh
 // const [categoriesLoading, setCategoriesLoading] = useState(false);
   const [filteredItems, setFilteredItems] = useState<Item[]>([]);


  const [itemVisibility, setItemVisibility] = useState<{ [itemId: number]: boolean }>({}); // State to track visibility per item

  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const [searchInput, setSearchInput] = useState<string>(""); // for search bar

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
    setSelectedItem(item);
    setIsModalOpen(true);
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
      console.log("Submitting form with values:", values);
      if (selectedItem) {
        // Update existing item
        console.log("Updating item:", selectedItem.id);
        await itemService.update(selectedItem.id, values as UpdateItemData);
      }
      //if modal isn needed
      // setIsModalOpen(false);
      // setSelectedItem(undefined);
      // // Force ItemList to refresh
      // setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error submitting item:", error);
      throw error; // Re-throw to let the form handle the error
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

  // const toggleDisplayMode = () => {
  //   setModeDisplay(prevMode => (prevMode === "table" ? "grid" : "table"));
  // };

  //HANDLE TABLE VIEW
  const handleListView = () => {
    return (
      <TableContainer sx= {{ maxHeight: 800 }}>
        <Table stickyHeader>
          {/* Added stickyHeader for better UX */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: "primary.main",color: "white", fontSize: "1.1rem", fontWeight: "bold", }}>ID</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main",  color: "white", fontSize: "1.1rem", fontWeight: "bold", }} > Image </TableCell>
              <TableCell sx={{ backgroundColor: "primary.main",  color: "white",  fontSize: "1.1rem",  fontWeight: "bold", }} > Name</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main", color: "white",  fontSize: "1.1rem", fontWeight: "bold", }} > Description </TableCell>
              <TableCell sx={{ backgroundColor: "primary.main",  color: "white", fontSize: "1.1rem", fontWeight: "bold",  }}>Size</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main",color: "white", fontSize: "1.1rem", fontWeight: "bold",  }}>  Color </TableCell>
              <TableCell sx={{ backgroundColor: "primary.main", color: "white", fontSize: "1.1rem", fontWeight: "bold", }} > Item Location</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main",  color: "white", fontSize: "1.1rem", fontWeight: "bold", }} >Storage Location</TableCell>
              <TableCell sx={{ backgroundColor: "primary.main", color: "white", fontSize: "1.1rem", fontWeight: "bold",  }}  > Quantity </TableCell>
              {/* <TableCell>Storage Location</TableCell> */}
              <TableCell sx={{ backgroundColor: "primary.main",color: "white", fontSize: "1.1rem", fontWeight: "bold", }} >  Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} style={{opacity: itemVisibility[item.id] ? 1 : 0.5}}>
                <TableCell>{item.id}</TableCell>
                <TableCell>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.description}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={camera} // Use the camera variable here
                      alt="No Image Available"
                      style={{
                        width: "150px",
                        height: "150px",
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
                <TableCell>{item.storageLocation}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", }}>
                    <IconButton color="primary" onClick={() => handleEdit(item)} size="medium"> <EditIcon /> </IconButton>
                    <IconButton color="primary" onClick={() => confirmDelete(item.id)}size="medium"> <DeleteIcon /> </IconButton>
                    <IconButton color="primary" onClick={() => visibilityToggle(item)} size="medium"> 
                    {itemVisibility[item.id] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
          {items.map((item) => (
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
              style={{opacity: itemVisibility[item.id] ? 1 : 0.5}}
            >
              <CardMedia
                sx={{ height: 200, width: "100%", objectFit: "cover" }}
                //image={item.imageUrl || camera}
                image={item.imageUrl}
                title={item.description}
              />
              <CardContent
                sx={{ textAlign: "center", cursor: "pointer" }}
                //onClick={() => openModal(item)}
              >
                <p style={{ fontWeight: "bold", margin: 0 }}>{item.name}</p>
                <p style={{ margin: 0 }}>{item.description}</p>
              </CardContent>
              <CardActions>
                <Button>Edit</Button>
                <Button>Delete</Button>
                <Button onClick={() => visibilityToggle(item)} size="medium"> 
                {itemVisibility[item.id]}Hide</Button>
              </CardActions>
            </Card>
          ))}
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

      const initialVisibility:{[itemId: number]: boolean} = {};
      data.forEach((item) => {
        initialVisibility[item.id] = true; // Set initial visibility to true for all items
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

  // Log when categories change to help debugging
  useEffect(() => {
    console.log("Categories in ItemList:", categories);
  }, [categories]);

  //HANDLE CATEGORY FILTER
    const handleByCategory = (event: SelectChangeEvent) => {
        setCategoryFilter(event.target.value);
      };

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
    const handleAddNew = () => {
      console.log("add new item");
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
        }
        else {
          const filteredItems = items.filter((item) =>
            item.description.toLowerCase().includes(searchInput.toLowerCase())
          );
          setFilteredItems(filteredItems);
        }
      }
    

  return (
    <div>
      <Box sx={{display: "column", marginBottom: "50px", marginTop: "10px", gap: "20px", paddingX: "20px", }} >

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "50px", gap: "50px" }}>
          <TextField onChange={handleSearch} value={searchInput} label="search item" sx={{ width: "50%" }}></TextField>
          <Button onClick={handleAddNew}>ADD NEW ITEM</Button>
        </Box>

          {/* filter by category */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <AppsIcon sx={{ fontSize: 40, color: "primary.main", cursor: "pointer" }} onClick={toggleDisplayMode} />
            <TableRowsIcon sx={{ fontSize: 40, color: "primary.main", cursor: "pointer" }} onClick={toggleDisplayMode} />
          </Box>
        </Box>
      </Box>
      

      {modeDisplay === "table" ? handleListView() : handleGridView()}

      {/* Causing double tables why? */}
      {/*    {categoriesLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ItemList
            key={refreshKey}
            onEdit={handleEdit}
            categories={categories}
          />
        )} */}

      {/* open a modal to edit the item */}
      <Dialog open={isModalOpen} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <ItemForm
              initialValues={selectedItem}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              categories={categories}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default AdminProducts;
