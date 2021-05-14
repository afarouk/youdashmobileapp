import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBusinessData, updateGroups, hydrateBusinessData } from '../../redux/slices/business';
import { clearCart } from '../../redux/slices/shoppingCart';

export default () => {
  const { businessUrlKey } = useParams();
  const businessData = useSelector((state) => state.business.data);
  const loading = useSelector((state) => state.business.loading);
  const error = useSelector((state) => state.business.error);
  const orderPickUp = useSelector((state) => state.shoppingCart.orderPickUp);
  const dispatch = useDispatch();
  const [isLoadedFromClient, setIsLoadedFromClient] = useState(false);

  useEffect(() => {
    const bd = businessData;
    const wd = window.__SASL_DATA__;

    if (!businessUrlKey) {
      return;
    }

    if (wd) {
      dispatch(
        hydrateBusinessData({
          businessData: wd,
          businessUrlKey
        })
      );
    } else if (!bd.urlKey || !bd.saslName || !bd.groups) {
      dispatch(getBusinessData(businessUrlKey))
      .then(() => {
        setIsLoadedFromClient(true);
        // console.log('Business Data loaded.');
      });
    }

  }, [businessUrlKey]);

  useEffect(() => {
    if (isLoadedFromClient && businessData.ogTags) {
      const { ogTags } = businessData;
      const qs = 'querySelector';
      const sa = 'setAttribute';

      if (ogTags) {
        const { title, description } = ogTags;
        document.title = title;
        document[qs]('meta[property="og:title"]')[sa]('content', title);
        document[qs]('meta[property="og:description"]')[sa]('content', description);
        document[qs]('meta[name="description"]')[sa]('content', description);

        setIsLoadedFromClient(false);

        // console.log('CSR: Updated meta tags.');
      }
    }
  }, [isLoadedFromClient]);

  useEffect(() => {
    if (
      businessData.hasGroupsBasedOnDay &&
      orderPickUp.day &&
      businessData.catalogs &&
      businessData.catalogs.length > 0
    ) {
      const catalog = businessData.catalogs.filter(
        ({ validDay }) => validDay.toLowerCase() === orderPickUp.day
      );
      if (catalog && catalog.length > 0 && catalog[0].groups) {
        dispatch(updateGroups(catalog[0].groups));
        dispatch(clearCart());
      }
    }
  }, [orderPickUp]);

  return [businessData, loading, error];
};
