import React from 'react';
import { UserDataForm } from '../components/Shared/UserDataForm/UserDataForm';
import useMemberData from '../hooks/user/useMemberData';
import { Form } from '../components/Shared/Form/Form';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { Container } from '../components/Shared/Container/Container';

const UserSettingsPage = ({ businessData, user }) => {
  const [credentials, credentialsChanged, onCredentialsChange, onSignUpSubmit] = useMemberData(
    businessData,
    user
  );
  const loading = useSelector((state) => state.auth.loading);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUpSubmit(false, user, false);
  };
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <UserDataForm
          user={user}
          toggleUpdateMode={null}
          updateMode={false}
          shouldChangeUpdateMode={false}
          onChange={onCredentialsChange}
          credentials={credentials}
        />
        <Button size="large" type="primary" htmlType="submit" block loading={loading}>
          Update data
        </Button>
      </Form>
    </Container>
  );
};

export default UserSettingsPage;