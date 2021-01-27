import React from 'react';
import PropTypes from 'prop-types';
import { Drawer as AntDDrawer } from 'antd';
import './Drawer.css';
import { MainMenu } from './Menu';
export const Drawer = ({ open, onOpen, onClose, user, onLogin, onLogout }) => {
  return (
    <div>
      <AntDDrawer
        width={300}
        title={''}
        placement="left"
        closable={true}
        onClose={onClose}
        visible={open}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <div className="drawer-menu">
          <MainMenu user={user} onLogout={onLogout} onLogin={onLogin} onClose={onClose} />
        </div>
      </AntDDrawer>
    </div>
  );
};

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
