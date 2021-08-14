import { useParams, useHistory } from 'react-router-dom';

type RouteConfig = {
  url: string,
}

export enum ROUTE_NAME {
  CART = 'CART',
  LANDING = 'LANDING',
  ORDER_STATUS = 'ORDER_STATUS',
  RESERVATION = 'RESERVATION',
  RESERVATION_DETAILS = 'RESERVATION_DETAILS',
}

const routes: Record<ROUTE_NAME, RouteConfig> = {
  [ROUTE_NAME.CART]: {
    url: '/order-details',
  },
  [ROUTE_NAME.LANDING]: {
    url: '/',
  },
  [ROUTE_NAME.ORDER_STATUS]: {
    url: '/order-status/:orderId',
  },
  [ROUTE_NAME.RESERVATION]: {
    url: '/reservation',
  },
  [ROUTE_NAME.RESERVATION_DETAILS]: {
    url: '/reservation-details',
  },
}

type GoToArgs = {
  routeName: ROUTE_NAME,
}

export const useRouting = () => {
  const history = useHistory();
  const { businessUrlKey } = useParams<any>();


  const goTo = ({ routeName }: GoToArgs) => {
    history.push(getRouteUrl(routeName));
  }

  const getRouteUrl = (routeName: ROUTE_NAME) => {
    const route = routes[routeName];
    return `/${businessUrlKey}${route.url}${window.location.search}`
  }

  const addQueryParams = ({ params, replace = false }: any) => {
    // TODO: implement it
    const urlParams = new URLSearchParams(history.location.search);
    params.forEach((param: any) => {
      urlParams.set(param.name, param.value);
    });


    // history.replace(`?${urlParams}`)
  }

  return { goTo, addQueryParams, getRouteUrl };
}