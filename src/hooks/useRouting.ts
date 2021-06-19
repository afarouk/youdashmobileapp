import { useParams, useHistory, useLocation } from 'react-router-dom';

type RouteConfig = {
  url: string,
}

export enum ROUTE_NAME {
  CART = 'CART',
  LANDING = 'LANDING',
}

const routes: Record<ROUTE_NAME, RouteConfig> = {
  [ROUTE_NAME.CART]: {
    url: '/order-details',
  },
  [ROUTE_NAME.LANDING]: {
    url: '/',
  },
}

type GoToArgs = {
  routeName: ROUTE_NAME,
}

export const useRouting = () => {
  const { search } = useLocation();
  const history = useHistory();
  const { businessUrlKey } = useParams<any>();


  const goTo = ({ routeName }: GoToArgs) => {
    const route = routes[routeName];

    history.push(`/${businessUrlKey}${route.url}${search}`);
  }

  return { goTo };
}