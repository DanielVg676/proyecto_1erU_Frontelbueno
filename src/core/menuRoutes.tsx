import DashBoard from "../modules/dashboard/DashBoard";
import Dashboard from "../modules/dashboard/MenuSideBar";
import OrderData from "../modules/order/OrderData";
import ProductData from "../modules/products/ProductData";
import ReportData from "../modules/reports/ReportData";
import LoginPage from "../modules/user/LoginPage";
import UserData from "../modules/user/UserData";
import UserForm from "../modules/user/UserForm";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  label?: string;
  icon?: string;
  roleIds?: string[]; // si quieres filtrar por rol
  hidden?: boolean;
}

const routes: AppRoute[] = [
  {
    path: '/dashboard',
    element: <DashBoard />,
    label: 'Inicio',
    icon: 'HomeOutlined',
  },
  {
    path: '/users',
    element: <UserData />,
    label: 'Usuarios',
    icon: 'UserOutlined',
  },
  {
    path: '/orders',
    element: <OrderData />,
    label: 'Usuarios',
    icon: 'UserOutlined',
  },
  {
    path: '/products',
    element: <ProductData />,
    label: 'Productos',
    icon: 'UserOutlined',
  },
  {
    path: '/reports',
    element: <ReportData />,
    label: 'Productos',
    icon: 'UserOutlined',
  },
  {
    path: '/login',
    element: <LoginPage />,
    label: 'Login',
    icon: 'UserOutlined',
  },
]

export default routes;
