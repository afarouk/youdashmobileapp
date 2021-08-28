import { useEffect, useState } from 'react';
import {
  registerNewMemberRequest,
  updateEmailMobileNamesForUserRequest
} from '../../redux/slices/auth';
import useUserCookie from './useUserCookie';

import { BusinessData } from '../../types/businessData';
import { User, Credentials, KeyTagChangeEvent } from '../../types/user';
import { useDispatch, useSelector } from '../../redux/store';

type UseMemberDataResult = [
  Credentials, 
  boolean, 
  (e: any) => void,
  (updateMode: any, user: any, shouldChangeUpdateMode: any) => any,
  boolean | string,
  boolean,
 ];

const useMemberData = (businessData: BusinessData, user: User, updateMode?: boolean, setUpdateMode?: () => void): UseMemberDataResult => {
  const dispatch = useDispatch();
  const [requestError, setRequestError] = useState<boolean | string>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useUserCookie();
  const [credentialsChanged, setCredentialsChanged] = useState(false);
  const userLoading = useSelector(state => state.auth.loading)


  const [credentials, setCredentials] = useState<Credentials>({
    firstName: '',
    mobile: '',
    email: '',
    kUID: '',
    serviceAccommodatorId: undefined,
    serviceLocationId: undefined,
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
        kUID: (user as any).kUID ? (user as any).kUID : null
      });
    }
  }, [user]);
  const handleCredentialsChange = (event: React.ChangeEvent<HTMLInputElement> | KeyTagChangeEvent) => {
    const e: any = event;

    if (e.detail   && e.detail.keyTagEvent) {
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
  const handleSubmit = (updateMode: boolean, user: User, shouldChangeUpdateMode: boolean) => {
    if (credentials.firstName && credentials.mobile && credentials.email) {
      setRequestError(false);
      if (user && user.uid && credentialsChanged) {
        return dispatch(
          updateEmailMobileNamesForUserRequest({
            credentials: credentials,
            user: user
          })
        ).then(({ payload, error }: any) => {
          if (error) {
            setRequestError(error.message ? error.message : true);
            return Promise.reject(error.message ? error.message : true);
          }
          setCookie(payload.uid);
          return Promise.resolve(payload);
        });
      } else if (!user) {
        setCredentialsChanged(false);
        return dispatch(registerNewMemberRequest(credentials)).then(({ payload, error }: any) => {
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
  return [credentials, credentialsChanged, handleCredentialsChange, handleSubmit, requestError, userLoading];
};

export default useMemberData;