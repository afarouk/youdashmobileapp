import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return (
          <Layout {...rest} {...props}>
            <Component {...rest} {...props} />
          </Layout>
        );
      }}
    />
  );
};
PublicRoute.propTypes = {
  component: PropTypes.any
};
