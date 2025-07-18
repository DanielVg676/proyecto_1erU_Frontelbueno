import { Form, Input, Button, Checkbox } from 'antd';
import { useAuth } from '../../auth/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function LoginPage() {
  const [form] = Form.useForm(); // corregido: destructuramos aquí
  const navigate = useNavigate();
  const { token, login } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Error en la autenticación');

      const data = await response.json();

      // ✅ Alerta exitosa
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${data.user.name || 'usuario'}, has iniciado sesión correctamente.`,
        timer: 2000,
        showConfirmButton: false,
      });

      login(data.accessToken, data.user);
      navigate('/');
      form.resetFields();
    } catch (error) {
      // ❌ Alerta de error
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Correo o contraseña incorrectos. Intenta de nuevo.',
      });
      console.error('Error en el servidor:', error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-600">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg border-0 p-8">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Correo electrónico"
              name="email"
              rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'El correo no es válido' }
              ]}
            >
              <Input placeholder="tu@ejemplo.com" />
            </Form.Item>

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
            >
              <Input.Password placeholder="Tu contraseña" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Recordarme</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                Iniciar sesión
              </Button>
            </Form.Item>

            <div className="text-center text-sm text-gray-600">
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>

            <Form.Item>
              <Button className="w-full" onClick={() => {
                form.setFieldsValue({
                  email: 'demo@email.com',
                  password: '123456'
                });
              }}>
                Usar credenciales de demostración
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          </div>
        </div>
      </div>
    </div>
  );
}
