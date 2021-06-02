import { CAYAN_CHECKOUT_KEY } from '../config/constants';
import { request, demo, multientry } from './request';

export const businessAPI = {
  getBusinessData: (urlKey) =>
    request.get(`/apptsvc/rest/sasl/getCatalogAndSiteletteDataModelByURLkey`, {
      params: {
        urlKey
      }
    }),
  getOpeningHours: (params) =>
    request.get(`/apptsvc/rest/sasl/getOpeningHours`, {
      params
    })
};
export const authAPI = {
  login: (credentials) =>
    request({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/authentication/login`,
      data: credentials
    }),
  getRegistrationStatus: (params) =>
    request.get(`/apptsvc/rest/authentication/getRegistrationStatus`, {
      params
    }),
  getCommunityExpressUserSASLSummary: (params) =>
    request.get(`/apptsvc/rest/usersasl/getCommunityExpressUserSASLSummary`, {
      params
    }),
  registerNewMember: (credentials) =>
    request({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/authentication/registerNewMemberWithMobile`,
      data: credentials
    }),
  updateEmailMobileNamesForUser: ({ credentials, user }) =>
    request({
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/authentication/updateEmailMobileNamesForUser?UID=${user.uid}`,
      data: credentials
    }),
  sendVerificationCode: (credentials) =>
    request({
      method: 'put',
      withCredentials: true,
      url: `/apptsvc/rest/authentication/verifyMobile?UID=${credentials.UID}&smsCode=${credentials.smsCode}`
    }),
  resendVerificationCode: (UID) =>
    request({
      method: 'get',
      withCredentials: true,
      url: `/apptsvc/rest/authentication/resendMobileVerificationCode?UID=${UID}`
    })
};

export const userAPI = {
  getLoyaltyAndOrderHistory: (params) =>
    request.get(`apptsvc/rest/usersasl/getUserSASLLoyaltyOrderHistoryData`, {
      params
    })
};

export const orderAPI = {
  createOrder: (data) =>
    request({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/retail/createAdhocOrderWeb?UID=${data.uid}`,
      data: data
    }),
  getOrderStatus: (params) =>
    request.get(`/apptsvc/rest/retail/retrieveOrderStatusData`, {
      params
    }),
  getNextOrderId: ({ serviceAccommodatorId, serviceLocationId  }) => {
    return request.get('apptsvc/rest/retail/getNextOrderId', {
      params: {
        serviceAccommodatorId,
        serviceLocationId,
      }
    })
  }
};

const gwApis = {
  vantiv: {},

}

const getCayanToken = (CayanCheckout) => {
  return new Promise((resolve, reject) => {
    CayanCheckout.createPaymentToken({
      success: resolve,
      error: reject,
    })
  })
}

export const paymentAPI = {
  getTransactionSetupID: (data) =>
    request({
      method: 'post',
      crossDomain: true,
      url: `/apptsvc/rest/ext/vantivTransactionSetup2`,
      data: { ...data, demo: demo && demo === 'true' }
    }),
  getOrderStatus: (params) =>
    request.get(`/apptsvc/rest/retail/retrieveOrderStatusData`, {
      params
    }),
  getPaymentToken: async (data) => {
    const { CayanCheckout } = window;
    CayanCheckout.setWebApiKey(CAYAN_CHECKOUT_KEY)
    return getCayanToken(CayanCheckout)
  }
};

export const pollAPI = {
  submitPoll: (data) => {
    const { choice, UID, uuid } = data;
    return request({
      method: 'post',
      url: `/apptsvc/rest/contests/enterPoll?choice=${choice}&UID=${UID}&uuid=${uuid}${
          multientry && multientry === 'true' ? `&simulate=true` : null
      }`
    });
  }
};
