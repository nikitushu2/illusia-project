import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Divider,
  Paper,
} from "@mui/material";
import {
  Item,
  CreateItemData,
  UpdateItemData,
} from "../../services/itemService";

interface ItemFormProps {
  initialValues?: Item;
  onSubmit: (values: CreateItemData | UpdateItemData) => Promise<void>;
  onCancel: () => void;
  categories?: { id: number; name: string }[];
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  categories = [],
}) => {
  const [formValues, setFormValues] = React.useState<
    CreateItemData | UpdateItemData
  >(
    initialValues || {
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
      quantity: 0,
      categoryId: 0,

      size: "",
      color: "",
      itemLocation: "",
      storageLocation: "",
    }
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.description)
      newErrors.description = "Description is required";
    if (
      typeof formValues.price !== "undefined" &&
      (isNaN(Number(formValues.price)) || Number(formValues.price) < 0)
    ) {
      newErrors.price = "Price must be a positive number";
    }
    if (
      typeof formValues.quantity !== "undefined" &&
      (isNaN(Number(formValues.quantity)) || Number(formValues.quantity) < 0)
    ) {
      newErrors.quantity = "Quantity must be a non-negative number";
    }
    if (!formValues.categoryId) newErrors.categoryId = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "quantity" || name === "categoryId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formValues);
      setSnackbar({
        open: true,
        message: initialValues
          ? "Item updated successfully"
          : "Item created successfully",
        severity: "success",
      });

      if (!initialValues) {
        // Reset form if creating new item
        setFormValues({
          name: "",
          description: "",
          imageUrl: "",
          price: 0,
          quantity: 0,
          categoryId: 0,

          size: "",
          color: "",
          itemLocation: "",
          storageLocation: "",
        });
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setSnackbar({
        open: true,
        message: initialValues
          ? "Failed to update item"
          : "Failed to create item",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      component="form"
      id="item-form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        width: "100%",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ color: "#000", fontWeight: "bold", mb: 1 }}
        >
          Basic Information
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            autoFocus
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            required
            multiline
            rows={4}
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            name="imageUrl"
            value={formValues.imageUrl || ""}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            InputProps={{
              startAdornment: <Typography variant="body1">€</Typography>,
              inputProps: { min: 0, step: 0.01 },
            }}
            value={formValues.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            required
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
            value={formValues.quantity}
            onChange={handleChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
            required
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Product Category"
            name="categoryId"
            value={formValues.categoryId || ""}
            onChange={handleChange}
            error={!!errors.categoryId}
            helperText={
              errors.categoryId || "Select which category this item belongs to"
            }
            required
            variant="outlined"
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              },
            }}
            InputLabelProps={{
              sx: {
                fontWeight: "bold",
                color: "#000",
                fontSize: "1rem",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: formValues.categoryId
                    ? "rgba(0, 0, 0, 0.23)"
                    : "primary.main",
                  borderWidth: formValues.categoryId ? 1 : 2,
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
              mb: 1,
            }}
          >
            <MenuItem value="" disabled>
              <em>Please select a product category</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                <strong>{category.name}</strong>
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ color: "#000", fontWeight: "bold", mb: 1 }}
        >
          Additional Details
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Size"
            name="size"
            value={formValues.size || ""}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Color"
            name="color"
            value={formValues.color || ""}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Item Location"
            name="itemLocation"
            value={formValues.itemLocation || ""}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Storage Location"
            name="storageLocation"
            value={formValues.storageLocation || ""}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{
              sx: { fontWeight: "bold", color: "#444" },
            }}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemForm;
