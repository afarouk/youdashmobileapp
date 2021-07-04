import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { ProductItem } from '../components/ProductItem/ProductItem';
import useProductItem from '../hooks/product-item/useProductItem';
import { addCartItem } from '../redux/slices/shoppingCart';
import { useDispatch } from 'react-redux';
import usePreventOrdering from '../hooks/core/usePreventOrdering';
import useGetProductItem from '../hooks/product-item/useGetProductItem';
import { ROUTE_NAME, useRouting } from '../hooks/useRouting';

const ProductItemPage = ({ businessData }) => {
  const [preventOrdering] = usePreventOrdering(businessData);
  const [item] = useGetProductItem(businessData);
  const { allowItemComments } = businessData.onlineOrder;
  const { goTo } = useRouting();
  const history = useHistory();
  const dispatch = useDispatch();

  const [
    productItem,
    handleSubItemCheckboxChange,
    handleQuantityPlus,
    handleQuantityMinus,
    handleCommentsChange,
    handleItemVersionChange
  ] = useProductItem(item);

  const handleAddToCart = () => {
    dispatch(addCartItem(productItem));
    goTo({ routeName: ROUTE_NAME.LANDING });
  };

  return productItem ? (
    <ProductItem
      allowItemComments={allowItemComments}
      preventOrdering={preventOrdering}
      productItem={productItem}
      onCheckboxChange={handleSubItemCheckboxChange}
      onTextChange={handleCommentsChange}
      onQtyPlus={handleQuantityPlus}
      onQtyMinus={handleQuantityMinus}
      addToCart={handleAddToCart}
      onItemVersionChange={handleItemVersionChange}
    />
  ) : null;
};
export default ProductItemPage;
