import { Form, InputNumber, Modal, Select, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id?: string;
  fkUser?: string;
  products: { productId: string; quantity: number; price: number }[];
}

interface OrderModalFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  order: Order | null;
  modalMode: "add" | "edit";
}

export default function OrderModalForm({ visible, onClose, onSubmit, order, modalMode }: OrderModalFormProps) {
  const [form] = Form.useForm();
  const [productOptions, setProductOptions] = useState<{ label: string; value: string }[]>([]);
  const [productData, setProductData] = useState<Record<string, Product>>({});

  useEffect(() => {
    if (visible) {
      if (modalMode === "edit" && order) {
        form.setFieldsValue({
          _id: order._id,
          fkUser: order.fkUser,
          products: order.products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            price: p.price,
          })),
        });
      } else {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        form.setFieldsValue({ fkUser: user._id, products: [] });
      }
      fetchAllProducts();
    }
  }, [visible, order, modalMode, form]);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products/getAllProducts");
      const data = Array.isArray(res.data) ? res.data : [];
      setProductOptions(data.map((p: Product) => ({ label: p.name, value: p._id })));
      const map: Record<string, Product> = {};
      data.forEach((p: Product) => {
        map[p._id] = p;
      });
      setProductData(map);
    } catch (err) {
      console.error("Error obteniendo productos", err);
    }
  };

  const handleProductSelect = (productId: string, index: number) => {
    const product = productData[productId];
    if (product) {
      const currentProducts = form.getFieldValue("products") || [];
      currentProducts[index] = {
        ...currentProducts[index],
        productId,
        price: product.price,
      };
      form.setFieldsValue({ products: currentProducts });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!values.products || values.products.length === 0) {
        form.setFields([
          {
            name: ["products"],
            errors: ["Debe añadir al menos un producto"],
          },
        ]);
        return;
      }
      onSubmit(values);
    } catch (err) {
      console.log("Validación fallida", err);
    }
  };

  return (
    <Modal
      title={modalMode === "edit" ? "Editar orden" : "Crear orden"}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText={modalMode === "edit" ? "Guardar cambios" : "Crear orden"}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        {modalMode === "edit" && (
          <Form.Item name="_id" noStyle>
            <InputNumber hidden />
          </Form.Item>
        )}

        <Form.Item label="ID Usuario" name="fkUser">
          <InputNumber className="w-full" disabled />
        </Form.Item>

        <Form.List name="products">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Space
                  key={key}
                  direction="vertical"
                  className="w-full border p-2 rounded mb-3"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "productId"]}
                    label="Producto"
                    rules={[{ required: true, message: "Selecciona un producto" }]}
                  >
                    <Select
                      placeholder="Selecciona un producto"
                      options={productOptions}
                      onChange={(value) => handleProductSelect(value, index)}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    label="Cantidad"
                    rules={[{ required: true, type: "number", min: 1, message: "Ingresa una cantidad válida" }]}
                  >
                    <InputNumber min={1} className="w-full" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    label="Precio"
                    rules={[{ required: true, type: "number", min: 0 }]}
                  >
                    <InputNumber min={0} className="w-full" disabled />
                  </Form.Item>

                  <Button
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(name)}
                  >
                    Quitar producto
                  </Button>
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                  block
                >
                  Añadir producto
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}