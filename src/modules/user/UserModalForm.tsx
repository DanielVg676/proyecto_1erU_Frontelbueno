import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";

interface Props {
    visible: boolean;
    message: string;
    onClose: () => void;
    onSubmit: (user: any) => void;
    user: any;
    modalMode: "add" | "edit";
}

export default function UserModalForm({
    visible,
    message,
    onClose,
    onSubmit,
    user,
    modalMode
}: Props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (modalMode === "edit" && user) {
                form.setFieldsValue(user);
            } else {
                form.resetFields();
            }
        }
    }, [visible, user, form, modalMode]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (modalMode === "edit") values._id = user?._id; // solo si es edición
            onSubmit(values);
            onClose();
        } catch (error) {
            console.error("Error en el formulario:", error);
        }
    };

    console.log(user);
    

    return (
        <Modal
            title={modalMode === "edit" ? "Editar usuario" : "Agregar usuario"}
            open={visible}
            onOk={handleOk}
            onCancel={onClose}
            okText={modalMode === "edit" ? "Guardar cambios" : "Crear"}
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[{ required: true, message: "El nombre es obligatorio" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: "email", message: "El email es obligatorio" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Teléfono"
                    rules={[
                        { required: true, message: "El teléfono es obligatorio" },
                        {
                            pattern: /^[0-9]{10}$/,
                            message: "Debe contener exactamente 10 dígitos numéricos",
                        },
                    ]}
                >
                    <Input maxLength={10} />
                </Form.Item>

                {modalMode === "edit" && (
                    <Form.Item name="_id" noStyle>
                        <Input type="hidden" />
                    </Form.Item>
                )}

                {modalMode === "add" && (
                    <>
                        <Form.Item
                            name="password"
                            label="Contraseña"
                            rules={[{ required: true, message: "La contraseña es obligatoria" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Rol"
                            rules={[{ required: true, message: "El rol es obligatorio" }]}
                        >
                            <Select placeholder="Selecciona un rol">
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="user">Usuario</Select.Option>
                                {/* Agrega más roles según lo necesites */}
                            </Select>
                        </Form.Item>
                    </>
                )}


            </Form>
        </Modal>
    );
}
