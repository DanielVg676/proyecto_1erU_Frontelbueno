import { Layout, Button } from 'antd';
import { Header, Content, Footer } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { Outlet } from 'react-router-dom';
import MenuComponents from '../MenuComponent';
import { useAuth } from '../../auth/AuthContext'; // Ajusta el path según tu estructura

function MenuSideBar() {
  const { logout } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <MenuComponents />
        </div>

        {/* Botón Logout abajo */}
        <div style={{ padding: '16px' }}>
          <Button type="primary" danger block onClick={logout}>
            Logout
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header style={{ padding: 0 }} />
        <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>© 2025 Mi App</Footer>
      </Layout>
    </Layout>
  );
}

export default MenuSideBar;
