import React, { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import itemService, { Item } from "../../services/itemService";

interface ItemListProps {
  onEdit: (item: Item) => void;
}

const ItemList: React.FC<ItemListProps> = ({ onEdit }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log("Fetching items...");
      const data = await itemService.getAll();
      console.log("Fetched items:", data);
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      message.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await itemService.delete(id);
      message.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      message.error("Failed to delete item");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number | string) => {
        const numericPrice =
          typeof price === "string" ? parseFloat(price) : price;
        return `$${isNaN(numericPrice) ? "0.00" : numericPrice.toFixed(2)}`;
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number | string) => {
        console.log("Quantity value:", quantity, "Type:", typeof quantity);
        const numericQuantity =
          typeof quantity === "string" ? parseInt(quantity, 10) : quantity;
        return isNaN(numericQuantity) ? "0" : numericQuantity.toString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Item) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table dataSource={items} columns={columns} rowKey="id" loading={loading} />
  );
};

export default ItemList;
