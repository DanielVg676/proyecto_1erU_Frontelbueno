import { useEffect, useState } from "react";
import { Table, Input, message, Tag, Button } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import OrderModalForm from "./OrderModalForm";

const { Search } = Input;

interface Order {
  _id: string;
  fkUser: string;
  total: number;
  subtotal: number;
  status: string;
  creationDate: string;
  products: { productId: string; quantity: number; price: number }[];
}

function OrderData() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productMap, setProductMap] = useState<Record<string, string>>({});
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/order/getAllOrders");
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      message.error("Error al obtener órdenes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductNames = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products/getAllProducts");
      const map: Record<string, string> = {};
      (res.data as any[]).forEach((p: any) => {
        map[p._id] = p.name;
      });
      setProductMap(map);
    } catch (err) {
      console.error("Error al cargar nombres de productos:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProductNames();
  }, []);

  const handleSearch = (value: string) => {
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(value.toLowerCase()) ||
        order.status.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setModalMode("edit");
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setSelectedOrder(null);
    setModalMode("add");
    setIsModalVisible(true);
  };

  const handleDelete = async (orderId: string) => {
    try {
      await axios.delete(`http://localhost:3000/order/deleteOrder?orderId=${orderId}`);
      message.success("Orden eliminada correctamente");
      fetchOrders();
    } catch (error) {
      message.error("Error al eliminar la orden");
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const guardarCambios = async (updatedOrder: Order) => {
    try {
      const { _id, products } = updatedOrder;
      if (!products || products.length === 0) {
        message.error("Debe seleccionar al menos un producto");
        return;
      }

      await axios.patch(
        `http://localhost:3000/order/addProductsToOrder?orderId=${_id}`,
        { products }
      );

      message.success("Productos añadidos correctamente");
      fetchOrders();
      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Error al añadir productos a la orden");
    }
  };

  const crearOrden = async (newOrder: Order) => {
    try {
      const { products } = newOrder;
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!products || products.length === 0) {
        message.error("Debe añadir al menos un producto");
        return;
      }

      await axios.post("http://localhost:3000/order/createOrder", {
        userId: user._id,
        status: "pendiente",
        products,
      });

      message.success("Orden creada exitosamente");
      fetchOrders();
      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Error al crear la orden");
    }
  };

  const columns = [
    {
      title: "ID de Orden",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Usuario",
      dataIndex: "fkUser",
      key: "fkUser",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "pendiente" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Fecha de creación",
      dataIndex: "creationDate",
      key: "creationDate",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: Order) => (
        <div>
          <Tag
            onClick={() => handleEdit(record)}
            style={{ color: "#1890ff", cursor: "pointer", marginRight: 8 }}
          >
            Editar
          </Tag>
          <Tag
            onClick={() => handleDelete(record._id)}
            style={{ color: "#ff4d4f", cursor: "pointer" }}
          >
            Eliminar
          </Tag>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Search
        placeholder="Buscar por ID de orden o estado"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={handleSearch}
        className="mb-4"
      />

      <Button type="primary" onClick={handleAdd} className="mb-4">
        + Agregar Orden
      </Button>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        expandable={{
          expandedRowRender: (record: Order) => (
            <ul className="ml-4">
              {record.products.map((product, index) => (
                <li key={index}>
                  Producto: {productMap[product.productId] || product.productId} — Cantidad: {product.quantity} — Precio: ${product.price}
                </li>
              ))}
            </ul>
          ),
          rowExpandable: (record) => record.products.length > 0,
        }}
      />

      <OrderModalForm
        visible={isModalVisible}
        onClose={closeModal}
        onSubmit={modalMode === "edit" ? guardarCambios : crearOrden}
        order={selectedOrder}
        modalMode={modalMode}
      />
    </div>
  );
}

export default OrderData;