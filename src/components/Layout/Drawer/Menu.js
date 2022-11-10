import React from 'react';
import { Menu } from 'antd';

import { routes } from '../../../config/routes';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  EditIcon,
  HistoryIcon,
  InfoCircleIcon,
  LiveHelpIcon,
  LogoutBoxLineIcon,
  ShopIcon,
  LocationOnIcon,
} from "../../Shared/Icons/Icons";
import { useSelector } from '../../../redux/store';
const { SubMenu } = Menu;

export const MainMenu = ({ user, onClose, onLogout }) => {
  const { search } = useLocation();

  const menuItems = []
  const loyaltyAndOrderHistory = useSelector(state => state.loyaltyAndOrderHistory.data);


  let order = null;
  if (loyaltyAndOrderHistory && loyaltyAndOrderHistory.orderHistory && loyaltyAndOrderHistory.orderHistory.length) {
    order = loyaltyAndOrderHistory.orderHistory[0];
  }

  if (order && order.orderStatus !== 'FULFILLED') {
    menuItems.push({
      ...routes.trackOrder,
      path: routes.trackOrder.path.replace(':orderId', order.orderUUID),
      title: 'Track Last Order',
      icon: <LocationOnIcon />
    })
  }

  menuItems.push(
    {
      ...routes.orderHistory,
      icon: <HistoryIcon />
    },
    {
      ...routes.userSettings,
      icon: <EditIcon />
    },
    {
      icon: <InfoCircleIcon />,
      ...routes.terms
    },
    // {
    //   icon: <LiveHelpIcon />,
    //   ...routes.help
    // },
    // {
    //   icon: <LogoutBoxLineIcon />,
    //   title: 'Logout',
    //   authRequired: true,
    //   onClickAction: () => {
    //     onClose();
    //     onLogout();
    //   }
    // },
    /*user
      ? {}
      : {
          icon: <RiLoginBoxLine />,
          ...routes.login
        }*/
  );
  const { businessUrlKey } = useParams();

  return (
    <Menu mode="inline" selectable={false}>
      {menuItems.map(({ title, path, url, icon, s1/*subItems*/, authRequired, onClickAction, target }, index) => {
        if (authRequired && !user) return null;
        const props = {};
        if (onClickAction) {
          props.onClick = onClickAction;
        } else {
          props.onClick = onClose;
        }

        if (target === '_blank') {
          props.onClick = undefined;
        }

        return s1/*subItems*/ ? (
          <SubMenu
            key={index}
            title={
              <span>
                {icon}
                <span className="submenu-item-title">{title}</span>
              </span>
            }
          >
            {s1/*subItems*/.map(({ title, path, icon }, subIndex) => (
              <Menu.Item key={`${index}${subIndex}`} icon={icon} onClick={onClose}>
                <Link to={`/${businessUrlKey}${path}${search}`}>{title}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item key={index} icon={icon} {...props}>
            {target === '_blank'
              ? <a href={url} target={target}>{title}</a>
              : path ? <Link to={`/${businessUrlKey}${path}${search}`} target={target}>{title}</Link> : title
            }
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
