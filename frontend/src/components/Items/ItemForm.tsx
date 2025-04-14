import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import {
  Item,
  CreateItemData,
  UpdateItemData,
} from "../../services/itemService";

interface ItemFormProps {
  initialValues?: Item;
  onSubmit: (values: CreateItemData | UpdateItemData) => Promise<void>;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: CreateItemData | UpdateItemData) => {
    try {
      console.log("Form submitted with values:", values);
      await onSubmit(values);
      message.success(
        initialValues
          ? "Item updated successfully"
          : "Item created successfully"
      );
      form.resetFields();
    } catch (err) {
      console.error("Form submission error:", err);
      message.error(
        initialValues ? "Failed to update item" : "Failed to create item"
      );
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input the item name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: "Please input the item description!" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      {/* <Form.Item
        name="imageUrl"
        label="Image URL"
        rules={[{ required: true, message: "Please input the image URL!" }]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please input the price!" }]}
      >
        <InputNumber
          min={0}
          step={0.01}
          formatter={(value: number | string | undefined) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value: string | undefined) =>
            value!.replace(/\$\s?|(,*)/g, "")
          }
        />
      </Form.Item>

      <Form.Item
        name="quantity"
        label="Quantity"
        rules={[{ required: true, message: "Please input the quantity!" }]}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Category ID"
        rules={[{ required: true, message: "Please input the category ID!" }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {initialValues ? "Update" : "Create"}
        </Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ItemForm;
