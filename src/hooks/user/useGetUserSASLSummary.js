import { useDispatch, useSelector } from 'react-redux';

import {
  setAuthenticationStatus,
  getCommunityExpressUserSASLSummaryRequest,
  login
} from '../../redux/slices/auth';
import { setLoyaltyAndOrderHistoryData } from '../../redux/slices/loyaltyAndOrderHistory';
import { useEffect } from 'react';

import useAuthActions from './useAuthActions';
import useUserCookie from './useUserCookie';

export default (initLoad = false) => {
  const dispatch = useDispatch();
  const [userCookie, setCookie] = useUserCookie();
  const [logIn, logOut] = useAuthActions();
  const loyaltyAndOrderHistory = useSelector((state) => state.loyaltyAndOrderHistory.data);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const businessData = useSelector((state) => state.business.data);

  const { serviceAccommodatorId, serviceLocationId } = businessData;
  const authenticationStatus = useSelector((state) => state.auth.authenticationStatus);
  const reloadData = () => {
    if (userCookie && serviceAccommodatorId && serviceLocationId) {
      dispatch(
        getCommunityExpressUserSASLSummaryRequest({
          UID: userCookie,
          serviceAccommodatorId,
          serviceLocationId
        })
      ).then(({ payload, error }) => {
        if (error) return;
        const { loyaltyOrderHistoryForUser, notification, priority, pollResults } = payload;

        dispatch(
          setLoyaltyAndOrderHistoryData({
            ...loyaltyOrderHistoryForUser,
            notification,
            pollResults,
            priority
          })
        );
      });
    }
  };
  useEffect(() => {
    if (
      userCookie &&
      !authenticationStatus &&
      serviceAccommodatorId &&
      serviceLocationId &&
      !loading &&
      initLoad
    ) {
      dispatch(
        getCommunityExpressUserSASLSummaryRequest({
          UID: userCookie,
          serviceAccommodatorId,
          serviceLocationId
        })
      ).then(({ payload, error }) => {
        if (error) return;
        const {
          authenticationDetails,
          loyaltyOrderHistoryForUser,
          notification,
          priority,
          pollResults
        } = payload;
        const { userRegistrationDetails, action, welcomeMessage } = authenticationDetails;
        if (authenticationDetails && action && action.enumText) {
          switch (action.enumText) {
            case 'NO_ACTION':
              if (userRegistrationDetails) {
                dispatch(
                  login({
                    ...userRegistrationDetails,
                    welcomeMessage: welcomeMessage
                  })
                );
              }
              break;
            case 'FORCE_RELOGIN':
              break;
            case 'FORCE_LOGOUT':
              logOut();
              break;
            case 'REFRESH_UID':
              break;
          }
          dispatch(setAuthenticationStatus(action.enumText));
        }
        dispatch(
          setLoyaltyAndOrderHistoryData({
            ...loyaltyOrderHistoryForUser,
            notification,
            pollResults,
            priority
          })
        );
      });
    }
  }, [serviceAccommodatorId, serviceLocationId]);

  useEffect(() => {
    if (user && !userCookie) {
      setCookie(user.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return [user, loyaltyAndOrderHistory, reloadData, loading];
};
