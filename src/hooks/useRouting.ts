import { useParams, useHistory } from 'react-router-dom';

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
  const history = useHistory();
  const { businessUrlKey } = useParams<any>();


  const goTo = ({ routeName }: GoToArgs) => {
    const route = routes[routeName];

    history.push(`/${businessUrlKey}${route.url}${window.location.search}`);
  }

  const addQueryParams = ({ params, replace = false }: any) => {
    // TODO: implement it
    const urlParams = new URLSearchParams(history.location.search);
    params.forEach((param: any) => {
      urlParams.set(param.name, param.value);
    });


    // history.replace(`?${urlParams}`)
  }

  return { goTo, addQueryParams };
}