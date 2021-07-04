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
  ShopIcon
} from "../../Shared/Icons/Icons";
const { SubMenu } = Menu;

export const MainMenu = ({ user, onClose, onLogout }) => {
  const { search } = useLocation();
  const menuItems = [
    /*{
      ...routes.trackOrder,
      icon: <MdLocationOn />
    },*/
    {
      title: 'My Dash',
      icon: <ShopIcon />,
      subItems: [
        {
          ...routes.orderHistory,
          icon: <HistoryIcon />
        },
        {
          ...routes.userSettings,
          icon: <EditIcon />
        },
       /* {
          ...routes.payment,
          icon: <AiOutlineCreditCard />
        }*/
      ],
      authRequired: true
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
  ];
  const { businessUrlKey } = useParams();

  return (
    <Menu mode="inline">
      {menuItems.map(({ title, path, icon, subItems, authRequired, onClickAction }, index) => {
        if (authRequired && !user) return null;
        const props = {};
        if (onClickAction) {
          props.onClick = onClickAction;
        } else {
          props.onClick = onClose;
        }
        return subItems ? (
          <SubMenu
            key={index}
            title={
              <span>
                {icon}
                <span className="submenu-item-title">{title}</span>
              </span>
            }
          >
            {subItems.map(({ title, path, icon }, subIndex) => (
              <Menu.Item key={`${index}${subIndex}`} icon={icon} onClick={onClose}>
                <Link to={`/${businessUrlKey}${path}${search}`}>{title}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item key={index} icon={icon} {...props}>
            {path ? <Link to={`/${businessUrlKey}${path}${search}`}>{title}</Link> : title}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
