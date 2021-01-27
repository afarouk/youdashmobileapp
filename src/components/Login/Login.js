import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { Container } from '../Shared/Container/Container';
import { Form } from '../Shared/Form/Form';
import { Card } from '../Shared/Card/Card';
export const Login = ({ credentials, onChange, onSubmit }) => (
  <Container>
    <Card className={'user-settings'}>
      <Form onSubmit={onSubmit}>
        <h3>Login</h3>
        <div>
          <label htmlFor="userName">Login</label>
          <Input
            placeholder="Phone number"
            name="userid"
            value={credentials.userid}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="firstName">Password</label>
          <Input
            placeholder="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
        <Button type="primary" block htmlType="submit">
          Login
        </Button>
      </Form>
    </Card>
  </Container>
);

Login.propTypes = {
  credentials: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
