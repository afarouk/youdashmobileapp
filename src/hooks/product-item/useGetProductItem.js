import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default (businessData, isCart = false) => {
  const { businessUrlKey, productId, itemIndex } = useParams();
  const items = useSelector((state) => state.shoppingCart.items);
  const history = useHistory();
  const { search } = useLocation();
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (businessData.itemsById && !isCart) {
      const itemsById = businessData?.itemsById;
      if (itemsById && productId && itemsById[productId] !== undefined) {
        setItem(itemsById[productId]);
      } else if (productId && (!itemsById || itemsById[productId] === undefined)) {
        //redirect to home page on non existing item
        history.push(`/${businessUrlKey}/${search}`);
      }
    }
  }, [businessData, productId]);
  useEffect(() => {
    if (itemIndex && items.length && isCart) {
      if (items[itemIndex] && items[itemIndex] !== undefined) {
        setItem(items[itemIndex]);
      } else if (items[itemIndex] === undefined) {
        history.push(`/${businessUrlKey}/order-details/${search}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData, items, itemIndex]);
  return [item];
};
