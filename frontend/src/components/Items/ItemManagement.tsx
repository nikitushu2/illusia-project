import React, { useState } from "react";
import { Button, Modal, Typography, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";
import itemService, {
  Item,
  CreateItemData,
  UpdateItemData,
} from "../../services/itemService";

const { Title } = Typography;

const ItemManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [key, setKey] = useState(0); // Used to force ItemList to refresh

  const handleCreate = () => {
    console.log("Opening create modal");
    setSelectedItem(undefined);
    setIsModalVisible(true);
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
      setIsModalVisible(false);
      setSelectedItem(undefined);
      // Force ItemList to refresh
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error submitting item:", error);
      throw error; // Re-throw to let the form handle the error
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>Item Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add New Item
          </Button>
        </div>

        <ItemList key={key} onEdit={handleEdit} />

        <Modal
          title={selectedItem ? "Edit Item" : "Create New Item"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <ItemForm
            initialValues={selectedItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </Modal>
      </Space>
    </div>
  );
};

export default ItemManagement;
