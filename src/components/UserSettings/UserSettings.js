import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { Container } from '../Shared/Container/Container';
// import './UserSettings.css';
import { Form } from '../Shared/Form/Form';
import { UserDataForm } from '../Shared/UserDataForm/UserDataForm';
import { Card } from '../Shared/Card/Card';
export const UserSettings = ({ credentials, user, onChange, onSubmit }) => (
  <Container>
    <Card className={'user-settings'}>
      <UserDataForm user={user} onChange={onChange} onSubmit={onSubmit} credentials={credentials} />
    </Card>
  </Container>
);

UserSettings.propTypes = {
  user: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};
