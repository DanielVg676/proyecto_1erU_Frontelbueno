import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";

interface Product {
  _id?: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  status: "activo" | "inactivo";
}

interface ProductModalFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Product>) => void;
  product: Product | null;
  modalMode: "add" | "edit";
  loading?: boolean;
}

export default function ProductModalForm({ visible, onClose, onSubmit, product, modalMode, loading }: ProductModalFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (modalMode === "edit" && product) {
        form.setFieldsValue(product);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: "activo" });
      }
    }
  }, [visible, product, modalMode, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (err) {
      console.log("Error al validar formulario", err);
    }
  };

  return (
    <Modal
      title={modalMode === "edit" ? "Editar producto" : "Crear producto"}
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText={modalMode === "edit" ? "Guardar cambios" : "Crear producto"}
      cancelText="Cancelar"
      okButtonProps={{ loading }}
    >
      <Form form={form} layout="vertical">
        {modalMode === "edit" && (
          <Form.Item name="_id" noStyle>
            <Input type="hidden" />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: "Ingresa el nombre del producto" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Descripción">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Cantidad"
          rules={[{ required: true, type: "number", min: 0, message: "Ingresa una cantidad válida" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item
          name="price"
          label="Precio"
          rules={[{ required: true, type: "number", min: 0, message: "Ingresa un precio válido" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Estado"
          rules={[{ required: true, message: "Selecciona un estado" }]}
        >
          <Select
            options={[
              { value: "activo", label: "Activo" },
              { value: "inactivo", label: "Inactivo" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}