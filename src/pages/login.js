import React, { useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Login } from '../components/Login/Login';
import useAuth from '../hooks/user/useAuthActions';
import { useSelector } from 'react-redux';

const LoginPage = () => {
  const { businessUrlKey } = useParams();
  const { search } = useLocation();
  const history = useHistory();
  const [user, logIn, logOut] = useAuth();
  const shoppingCartItems = useSelector((state) => state.shoppingCart.items);
  const [credentials, setCredentials] = useState({
    userid: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.userid) {
      logIn(credentials).then((result) => {
        if (!result.error) {
          history.push(
            shoppingCartItems && shoppingCartItems.length > 0
              ? `/${businessUrlKey}/order-details${search}`
              : `/${businessUrlKey}/${search}`
          );
        }
      });
    }
  };
  return <Login onSubmit={handleSubmit} onChange={handleChange} credentials={credentials} />;
};
export default LoginPage;