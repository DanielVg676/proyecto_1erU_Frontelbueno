import { useEffect, useState } from "react";
import { Table, Input, Tag, message, Button } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import ProductModalForm from "./ProductModalForm";

const { Search } = Input;

interface Product {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  status: "activo" | "inactivo";
  createdAt: string;
}

export default function ProductData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/products/getAllProducts");
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      message.error("Error al obtener productos");
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (value: string) => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.description?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setModalMode("add");
    setIsModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalVisible(true);
  };

  const handleDelete = async (productId: string) => {
    setLoading(true);
    try {
      await axios.patch(`http://localhost:3000/products/deleteProduct?productId=${productId}`);
      message.success("Producto eliminado correctamente");
      fetchProducts();
    } catch (error: any) {
      const errorMessage = error.response?.status === 404
        ? "Producto no encontrado"
        : "Error al eliminar el producto";
      message.error(errorMessage);
      console.error("Delete product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setModalMode("add");
  };

  const handleSave = async (productData: Partial<Product>) => {
    setLoading(true);
    try {
      console.log("Product data to save:", productData); // Debug log
      if (modalMode === "edit" && productData._id) {
        await axios.patch(
          `http://localhost:3000/products/updateProduct?productId=${productData._id}`,
          {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            quantity: productData.quantity,
            status: productData.status,
          }
        );
        message.success("Producto actualizado correctamente");
      } else {
        await axios.post("http://localhost:3000/products/createProduct", {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          quantity: productData.quantity,
          status: productData.status || "activo",
        });
        message.success("Producto creado correctamente");
      }
      fetchProducts();
      handleModalClose();
    } catch (error: any) {
      const action = modalMode === "edit" ? "actualizar" : "crear";
      const errorMessage = error.response?.status === 404
        ? "Producto no encontrado. Verifica el ID del producto."
        : `Error al ${action} el producto`;
      message.error(errorMessage);
      console.error(`Error ${action} product:`, error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "activo" ? "green" : "red"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Product) => (
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
        placeholder="Buscar por nombre o descripción"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={handleSearch}
        className="mb-4"
      />

      <Button type="primary" onClick={handleAdd} className="mb-4">
        + Agregar producto
      </Button>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <ProductModalForm
        visible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handleSave}
        product={selectedProduct}
        modalMode={modalMode}
        loading={loading}
      />
    </div>
  );
}