import React from 'react';
import { Form, Input, Radio,} from 'antd';


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};


const onFinish = (values: any) => {
  console.log('Form values:', values);
};


const UserForm: React.FC = () => (
  <Form
    {...layout}
    name="nest-messages"
    onFinish={onFinish}
    style={{ maxWidth: 600 }}
    validateMessages={validateMessages}
  >
    <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
      <Input />
    </Form.Item>
    <Form.Item name={['user', 'password']} label="Password" rules={[{ required: true, message: 'Please input your Password!' }]}>
      <Input.Password />
    </Form.Item>
    <Form.Item name={['user', 'roles']} label="Roles" rules={[{ required: true }]}>
        <Radio.Group>
          <Radio.Button value="user">User</Radio.Button>
          <Radio.Button value="admin">Admin</Radio.Button>
          <Radio.Button value="moderator">Moderator</Radio.Button>
        </Radio.Group>
      </Form.Item>
  </Form>
);


export default UserForm;
