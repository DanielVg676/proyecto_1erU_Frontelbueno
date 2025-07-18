import {
  PieChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Icons = {
  PieChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
};

function MenuComponents() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  useEffect(() => {
    console.log("User:", user); // Depuración
    console.log("Token:", token); // Depuración
    console.log("Role:", user?.role?.[0]?.type); // Cambiado de roles a role

    if (!token || !user?.role?.length) {
      console.log("No se ejecuta la solicitud: token o role no disponibles");
      return;
    }

    const getMenu = async () => {
      setLoading(true);
      try {
        const role = user.role[0]?.type; // Cambiado de roles a role
        console.log("Enviando solicitud para role:", role);
        const response = await fetch(
          `http://localhost:3000/menu/getMenuByRole?role=${encodeURIComponent(role)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Asegúrate de que el backend requiere este encabezado
            },
          }
        );

        console.log("Estado de la respuesta:", response.status);
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const menuList = await response.json();
        console.log("Respuesta del backend:", menuList);
        setMenuItems(menuList);
      } catch (error) {
        console.error("Error al obtener menú:", error);
      } finally {
        setLoading(false);
      }
    };

    getMenu();
  }, [user, token]);

  const renderMenu = () => {
    console.log("Rendering menu items:", menuItems);
    return menuItems.map((item) => {
      const IconComponent = Icons[item.icon as keyof typeof Icons];
      if (!IconComponent) {
        console.warn(`Ícono no encontrado: ${item.icon}`);
      }
      return {
        key: item.path,
        icon: IconComponent ? <IconComponent /> : null,
        label: item.title,
      };
    });
  };

  if (loading) {
    return <div>Cargando menú...</div>;
  }

  if (!menuItems.length) {
    return <div>No hay ítems de menú disponibles</div>;
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={renderMenu()}
      onClick={({ key }) => navigate(key)}
      style={{ height: "100%", borderRight: 0 }}
    />
  );
}

export default MenuComponents;