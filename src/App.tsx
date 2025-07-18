import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MenuSideBar from './modules/dashboard/MenuSideBar';
import routes from './core/menuRoutes'; // Este debe contener solo contenido, no layout
import AuthRoutes from './auth/AuthRoutes';
import { AuthProvider } from './auth/AuthContext';
import LoginPage from './modules/user/LoginPage';
import DashBoard from './modules/dashboard/dashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Layout general para rutas privadas */}
          <Route
            path="/"
            element={
              <AuthRoutes>
                <MenuSideBar />
              </AuthRoutes>
            }
          >
            {/* Rutas privadas dentro del layout */}
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path.slice(1)} // quita el "/" inicial
                element={route.element}
              />
            ))}
            {/* Ruta base (opcional) */}
            <Route path='/dashboard' element={<DashBoard/>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
