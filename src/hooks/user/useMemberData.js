import { useEffect, useState } from 'react';
import {
  registerNewMemberRequest,
  updateEmailMobileNamesForUserRequest
} from '../../redux/slices/auth';
import { useDispatch } from 'react-redux';
import useUserCookie from './useUserCookie';
export default (businessData, user, updateMode, setUpdateMode) => {
  const dispatch = useDispatch();
  const [requestError, setRequestError] = useState(false);
  const [cookies, setCookie] = useUserCookie();
  const [credentialsChanged, setCredentialsChanged] = useState(false);
  const [credentials, setCredentials] = useState({
    firstName: '',
    mobile: '',
    email: '',
    kUID: ''
  });
  useEffect(() => {
    if (businessData && businessData.serviceAccommodatorId && businessData.serviceLocationId) {
      setCredentials({
        ...credentials,
        serviceAccommodatorId: businessData.serviceAccommodatorId,
        serviceLocationId: businessData.serviceLocationId
      });
    }
  }, [businessData]);
  useEffect(() => {
    if (user) {
      setCredentials({
        ...credentials,
        firstName: user.firstName,
        mobile: user.phoneNumber,
        email: user.email,
        kUID: user.kUID ? user.kUID : null
      });
    }
  }, [user]);
  const handleCredentialsChange = (e) => {
    if (e.detail && e.detail.keyTagEvent) {
      setCredentials({
        ...credentials,
        [e.detail.name]: e.detail.value
      });
    } else {
      setCredentials({
        ...credentials,
        [e.target.name]: e.target.value
      });
    }

    if (!credentialsChanged) setCredentialsChanged(true);
  };
  const handleSubmit = (updateMode, user, shouldChangeUpdateMode) => {
    if (credentials.firstName && credentials.mobile && credentials.email) {
      setRequestError(false);
      if (user && user.uid && credentialsChanged) {
        return dispatch(
          updateEmailMobileNamesForUserRequest({
            credentials: credentials,
            user: user
          })
        ).then(({ payload, error }) => {
          if (error) {
            setRequestError(error.message ? error.message : true);
            return Promise.reject(error.message ? error.message : true);
          }
          setCookie(payload.uid);
          return Promise.resolve(payload);
        });
      } else if (!user) {
        setCredentialsChanged(false);
        return dispatch(registerNewMemberRequest(credentials)).then(({ payload, error }) => {
          if (error) {
            setRequestError(error.message ? error.message : true);
            return Promise.reject(error.message ? error.message : true);
          }
          setCookie(payload.uid);
          return Promise.resolve(payload);
        });
      }
    }
  };
  return [credentials, credentialsChanged, handleCredentialsChange, handleSubmit, requestError];
};
