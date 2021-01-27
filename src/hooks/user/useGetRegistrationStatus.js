import { useDispatch } from 'react-redux';
import { useCookies as useReactCookie } from 'react-cookie';
import {
  login,
  getRegistrationStatusRequest,
} from '../../redux/slices/auth';
import { useEffect } from 'react';
import { USER_COOKIE } from '../../config/constants';

export default (user, authenticationStatus) => {
  const dispatch = useDispatch();
  const [cookies, setCookie] = useReactCookie([USER_COOKIE]);
  useEffect(() => {
    if (!user && cookies[USER_COOKIE] && authenticationStatus === 'NO_ACTION') {
      dispatch(getRegistrationStatusRequest({ UID: cookies[USER_COOKIE] })).then(({ payload }) => {
        dispatch(login(payload));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticationStatus]);

  useEffect(() => {
    if (user && !cookies[USER_COOKIE]) {
      setCookie(USER_COOKIE, user.uid, {
        domain: window.location.hostname,
        path: `/`
      });
    }
    /* if (!user && cookies[USER_COOKIE]) {
      dispatch(login(cookies.youDashAuthUser));
    }*/
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
};
