import { useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
export default () => {
  let { businessUrlKey } = useParams();
  let history = useHistory();
  const { search, pathname } = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpen = () => setOpenDrawer(true);
  const handleClose = () => setOpenDrawer(false);
  const handleGoBack = () => {
    return pathname.indexOf('shopping-cart') !== -1
      ? history.push(`/${businessUrlKey}/order-details${search}`)
      : history.push(`/${businessUrlKey}/${search}`);
  }; /*history.goBack();*/
  return [openDrawer, handleOpen, handleClose, handleGoBack];
};
