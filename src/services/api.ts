import { request, demo, multientry } from './request';

import { 
  BlockGreenDiningOrderParams,
  BlockGreenDiningOrderResponse, 
  CancelGreenDiningBlockParams, 
  CancelGreenDiningBlockResponse, 
  GetGreenDiningDetailsParams, 
  GetGreenDiningDetailsResponse,
} from '../types/api';

export const businessAPI = {
  getBusinessData: (urlKey: string) =>
    request.get(`/apptsvc/rest/sasl/getCatalogAndSiteletteDataModelByURLkey`, {
      params: {
        urlKey
      }
    }),
  getOpeningHours: (params: any) =>
    request.get(`/apptsvc/rest/sasl/getOpeningHours`, {
      params
    })
};
export const authAPI = {
  login: (credentials: any) =>
    request({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/authentication/login`,
      data: credentials
    }),
  getRegistrationStatus: (params: any) =>
    request.get(`/apptsvc/rest/authentication/getRegistrationStatus`, {
      params
    }),
  getCommunityExpressUserSASLSummary: (params: any) =>
    request.get(`/apptsvc/rest/usersasl/getCommunityExpressUserSASLSummary`, {
      params
    }),
  registerNewMember: (credentials: any) =>
    request({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/authentication/registerNewMemberWithMobile`,
      data: credentials
    }),
  updateEmailMobileNamesForUser: ({ credentials, user }: any) =>
    request({
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/authentication/updateEmailMobileNamesForUser?UID=${user.uid}`,
      data: credentials
    }),
  sendVerificationCode: (credentials: any) =>
    request({
      method: 'put',
      withCredentials: true,
      url: `/apptsvc/rest/authentication/verifyMobile?UID=${credentials.UID}&smsCode=${credentials.smsCode}`
    }),
  resendVerificationCode: (UID: string) =>
    request({
      method: 'get',
      withCredentials: true,
      url: `/apptsvc/rest/authentication/resendMobileVerificationCode?UID=${UID}`
    })
};

export const userAPI = {
  getLoyaltyAndOrderHistory: (params: any) =>
    request.get(`apptsvc/rest/usersasl/getUserSASLLoyaltyOrderHistoryData`, {
      params
    })
};

type CreateOrderAdditionalData = {
  blockUUID: string,
  blockCount: number,
}

export const orderAPI = {
  createOrder: (data: any, additionalData?: CreateOrderAdditionalData) => {
    const searchParams = new URLSearchParams();
    searchParams.set('UID', data.uid);

    if (additionalData) {
      searchParams.set('blockUUID', additionalData.blockUUID);
      searchParams.set('blockCount', additionalData.blockCount.toString());
    }

    return request({
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      url: `/apptsvc/rest/retail/createAdhocOrderWeb?${additionalData}`,
      data: data,
    });
  },
  getOrderStatus: (params: any) =>
    request.get(`/apptsvc/rest/retail/retrieveOrderStatusData`, {
      params
    }),
  getNextOrderId: ({ serviceAccommodatorId, serviceLocationId  }: any) => {
    return request.get('apptsvc/rest/retail/getNextOrderId', {
      params: {
        serviceAccommodatorId,
        serviceLocationId,
      }
    })
  },
};

export const greenDiningAPI = {
  getGreenDiningDetails: (params: GetGreenDiningDetailsParams) => {
    return request.get<GetGreenDiningDetailsResponse>('/apptsvc/rest/promotions/retrieveGreenDiningDetails', {
      params
    })
  },
  blockGreenDiningOrder: (params: BlockGreenDiningOrderParams) => {
    return request.put<BlockGreenDiningOrderResponse>('/apptsvc/rest/promotions/blockGreenDiningOrder', undefined, {
      params
    })
  },
  cancelGreenDiningBlock: (params: CancelGreenDiningBlockParams) => {
    return request.put<CancelGreenDiningBlockResponse>('/apptsvc/rest/promotions/cancelGreenDiningBlock', undefined, {
      params
    })
  },
}

const getCayanToken = (CayanCheckout: any) => {
  return new Promise((resolve, reject) => {
    CayanCheckout.createPaymentToken({
      success: resolve,
      error: reject,
    })
  })
}

export const paymentAPI = {
  getTransactionSetupID: (data: any) =>
    request({
      method: 'post',
      url: `/apptsvc/rest/ext/vantivTransactionSetup2`,
      data: { ...data, demo: demo && demo === 'true' }
    }),
  getOrderStatus: (params: any) =>
    request.get(`/apptsvc/rest/retail/retrieveOrderStatusData`, {
      params
    }),
  getPaymentToken: async () => {
    const { CayanCheckout } = (window as any);
    return getCayanToken(CayanCheckout)
  }
};

export const pollAPI = {
  submitPoll: (data: any) => {
    const { choice, UID, uuid } = data;
    return request({
      method: 'post',
      url: `/apptsvc/rest/contests/enterPoll?choice=${choice}&UID=${UID}&uuid=${uuid}${
          multientry && multientry === 'true' ? `&simulate=true` : null
      }`
    });
  }
};
