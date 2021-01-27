import { useCookies as useReactCookie } from 'react-cookie/es6';
import { USER_COOKIE } from '../../config/constants';

const cookieSettings = {
  domain: window.location.hostname,
  path: `/`,
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
};
export default () => {
  const [cookies, setCookie, removeCookie] = useReactCookie([USER_COOKIE]);

  const handleSetCookie = (value) => {
    setCookie(USER_COOKIE, value, cookieSettings);
  };
  const handleRemoveCookie = () => {
    removeCookie(USER_COOKIE, cookieSettings);
  };

  return [cookies[USER_COOKIE], handleSetCookie, handleRemoveCookie];
};
