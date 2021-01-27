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
    if (window.__SASL_DATA__ && window.__SASL_DATA__ !== undefined && businessUrlKey) {
      dispatch(
        hydrateBusinessData({
          businessData: window.__SASL_DATA__,
          businessUrlKey
        })
      );
    } else if (
      (!businessData.urlKey || !businessData.saslName || !businessData.groups) &&
      businessUrlKey !== undefined
    ) {
      dispatch(getBusinessData(businessUrlKey)).then(() => {
        // do additional work
        setIsLoadedFromClient(true);
        console.log('Business Data loaded.');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessUrlKey]);
  useEffect(() => {
    if (isLoadedFromClient && businessData.ogTags) {
      const { ogTags } = businessData;

      if (ogTags) {
        document.title = ogTags.title;
        document.querySelector('meta[property="og:title"]').setAttribute('content', ogTags.title);
        document
          .querySelector('meta[property="og:description"]')
          .setAttribute('content', ogTags.description);
        document
          .querySelector('meta[name="description"]')
          .setAttribute('content', ogTags.description);
        console.log('CSR: Updated meta tags.');
        setIsLoadedFromClient(false);
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
