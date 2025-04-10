import { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";

interface Item {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  price: number;
}

const ItemList = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_ORIGIN}/api/items`
        );

        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.status}`);
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <Typography>Loading items...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Our Items
      </Typography>

      {items.length === 0 ? (
        <Typography>No items available.</Typography>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                width: 300,
                padding: 2,
                border: "1px solid #eee",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="h5">{item.name}</Typography>
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                {item.description}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, color: "primary.main" }}>
                ${parseFloat(item.price.toString()).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ItemList;
