import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCookies as useReactCookie } from 'react-cookie';
import { Layout } from '../components/Layout/Layout';
import { USER_COOKIE } from '../config/constants';

export const ProtectedRoute = ({ component: Component, user, ...rest }) => {
  const [cookies] = useReactCookie();

  return (
    <Route
      {...rest}
      render={(props) => {
        return user || cookies[USER_COOKIE] ? (
          <Layout {...rest} {...props}>
            <Component {...rest} {...props} />
          </Layout>
        ) : (
          <Redirect
            to={{
              // TODO replace it when login page will be enabled
              // pathname: `/${props.match.params.businessUrlKey}/login`,
              // state: {
              //   from: props.location
              // }
              pathname: `/${props.match.params.businessUrlKey}/${window.location.search}`,
            }}
          />
        );
      }}
    />
  );
};
