import { useEffect, useState } from "react";
import { Table, Input, message, Tag, Button } from "antd";
import axios from "axios";
import UserModalForm from "./UserModalForm"; // Ajusta esta ruta si es necesario

const { Search } = Input;

type Role = {
    type: string;
    // Agrega más propiedades si es necesario
};

type User = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role?: Role[]; // Cambiado de 'any' a 'Role[]'
    status?: boolean;
};

export default function UserData() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:3000/user/getAllUsers");
            setUsers(res.data as User[]);
            setFilteredUsers(res.data as User[]);
        } catch (error) {
            message.error("Error al obtener usuarios");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (value: string) => {
        const filtered = users.filter((user: User) =>
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const guardarCambios = async (nuevoUsuario: User) => {
    console.log("Usuario guardado:", nuevoUsuario);
    setLoading(true);
    if (modalMode === "add") {
        // Si es modo agregar, llamamos a agregarUsuario
        await agregarUsuario(nuevoUsuario);
        return;
        
    } else {
        try {
        console.log(nuevoUsuario);
        
        await axios.patch(
            `http://localhost:3000/user/updateUser?id=${nuevoUsuario._id}`,
            nuevoUsuario
        );
        message.success("Cambios guardados correctamente");
        fetchUsers(); // recarga la lista si es necesario
        closeModal();
    } catch (error) {
        message.error("Error al guardar los cambios");
        console.error(error);
    } finally {
        setLoading(false);
    }
    }
};

    const agregarUsuario = async (nuevoUsuario: User) => {
        console.log("Usuario guardado:", nuevoUsuario);
        setLoading(true);
        try {
            console.log(nuevoUsuario);
            
            const response = await axios.post(
                `http://localhost:3000/user/saveUser`,
                nuevoUsuario
            );
            message.success("Usuario guardado correctamente");
            fetchUsers(); // recarga la lista si es necesario
            closeModal();
        } catch (error) {
            message.error("Error al guardar el usuario");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (user: any) => {
        console.log(user);
        setUser(user);
        setModalMode("edit");
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        console.log(user);
        setUser(null); // Resetea el usuario para agregar uno nuevo
        setModalMode("add");
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Correo",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Rol",
            key: "role",
            render: (_: any, record: any) => {
                const roles = record.role;
                if (Array.isArray(roles)) {
                    return roles.map((r: any) => r.type).join(", ");
                }
                return <i>Sin rol</i>;
            },
        },
        {
            title: "Estado",
            key: "status",
            dataIndex: "status",
            render: (status: boolean) => (
                <Tag color={status ? "green" : "red"}>
                    {status ? "Activo" : "Inactivo"}
                </Tag>
            ),
        },

        {
            title: "Acciones",
            key: "actions",
            render: (_: any, record: any) => (
                <Tag color="blue" style={{ cursor: "pointer" }}>
                    <a onClick={() => handleEdit(record)}>Editar</a>
                </Tag>
            ),
        },
    ];

    return (
        <div className="p-4">
            <Search
                placeholder="Buscar por nombre o correo"
                allowClear
                enterButton="Buscar"
                size="large"
                onSearch={handleSearch}
                className="mb-4"
            />
            
            <Button
            type="primary"
                onClick={() => {
                    handleAdd();
                    setIsModalVisible(true);
                }}
                className="mb-4"
            >
                + Agregar usuario
            </Button>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            <UserModalForm
                visible={isModalVisible}
                message={modalMode === "add" ? "Agregar usuario" : "Editar usuario"}
                onClose={closeModal}
                onSubmit={guardarCambios}
                user={user}
                modalMode={modalMode} // Cambia esto si es necesario
            />  

        </div>
    );
}
