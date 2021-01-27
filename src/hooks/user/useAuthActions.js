import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, logout } from '../../redux/slices/auth';
import { resetData } from '../../redux/slices/loyaltyAndOrderHistory';

import useUserCookie from './useUserCookie';
export default () => {
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useUserCookie();

  const logIn = ({ userid, password }) => {
    return dispatch(
      loginRequest({
        userid,
        password
      })
    );
  };
  const logOut = () => {
    removeCookie();
    dispatch(logout());
    dispatch(resetData());
  };

  return [logIn, logOut];
};
