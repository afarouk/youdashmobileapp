import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Radio } from 'antd';
import { Container } from '../Shared/Container/Container';
import { Image } from './Image';

import { Description } from './Description';
import { Comments } from '../Shared/Comments/Comments';

import { Order } from './Order';
import { getMediaImageUrl } from '../../utils/helpers';

import { SubItemsBlock } from './SubItemsBlock';
import { ImagePlaceholder } from '../Shared/ImagePlaceholder/ImagePlaceholder';
import { Card } from '../Shared/Card/Card';
import './ProductItem.css';
import { SideSplitter } from './SideSplitter';

export const ProductItem = ({
  productItem,
  onQtyPlus,
  onQtyMinus,
  onCheckboxChange,
  addToCart,
  isShoppingCart = false,
  onTextChange,
  onItemVersionChange,
  preventOrdering,
  allowItemComments
}) => {
  let {
    mediaURLs,
    itemName,
    price,
    shortDescription,
    longDescription,
    comments,
    canSplitLeftRight
  } = productItem;
  let s0/*subOptions*/ = productItem?.itemOptions?.s0 /*subOptions*/;
  let s1/*subItems*/ = productItem?.itemOptions?.s1/*subItems*/;
  let s2/*subItemsLeft*/ = productItem?.itemOptions?.s2 /*subItemsLeft*/;
  let selectDefaultValue =
    productItem.itemVersion && typeof productItem.itemVersion === 'object'
      ? productItem.itemVersion.itemVersion
      : productItem.itemVersion;

  const canSplit = canSplitLeftRight && s1/*subItems*/ && s2/*subItemsLeft*/;
  const handleVersionChange = (e) => onItemVersionChange(e.target.value);
  return (
    <Container>
      {productItem && (
        <Card className="product">
          <ImagePlaceholder>
            <Image url={getMediaImageUrl(mediaURLs)} itemName={itemName} />
          </ImagePlaceholder>
          <div className="p-default product-card__wrapper">
            <Description
              itemName={itemName}
              description={longDescription || shortDescription}
              price={price}
            />
            {productItem.hasVersions &&
              productItem.itemVersions &&
              productItem.itemVersions.length > 0 && (
                <div className="product-card__item-versions">
                  {/*<AntDSelect defaultValue={selectDefaultValue} onChange={onItemVersionChange}>
                    {productItem.itemVersions.map(
                      ({ itemVersion, version1DisplayText }, vIndex) => (
                        <Option value={itemVersion} key={`itemVersion${vIndex}`}>
                          {version1DisplayText}
                        </Option>
                      )
                    )}
                  </AntDSelect>*/}
                  <Radio.Group onChange={handleVersionChange} value={selectDefaultValue}>
                    {productItem.itemVersions.map(
                      ({ itemVersion, version1DisplayText }, vIndex) => (
                        <Radio key={`itemVersion${vIndex}`} value={itemVersion}>
                          {version1DisplayText}
                        </Radio>
                      )
                    )}
                  </Radio.Group>
                  {/* <NativeSelect
                    onChange={onItemVersionChange}
                    value={selectDefaultValue}
                    options={productItem.itemVersions}
                  />*/}
                </div>
              )}
            <SubItemsBlock
              s1={s0}
              onCheckboxChange={onCheckboxChange}
              parentPropName="s0"
            />
            {canSplit && <SideSplitter side="left" />}
            <SubItemsBlock
              s1={s2}
              onCheckboxChange={onCheckboxChange}
              parentPropName="s2"
            />
            {canSplit && <SideSplitter side="right" />}
            <SubItemsBlock
              s1={s1}
              onCheckboxChange={onCheckboxChange}
              parentPropName="s1"
            />
            {allowItemComments && <Comments comments={comments} onTextChange={onTextChange} />}

            <Order
              preventOrdering={preventOrdering}
              quantity={productItem.quantity}
              onQtyPlus={onQtyPlus}
              onQtyMinus={onQtyMinus}
              addToCart={addToCart}
              isShoppingCart={isShoppingCart}
            />
          </div>
        </Card>
      )}
    </Container>
  );
};

ProductItem.propTypes = {
  productItem: PropTypes.shape({
    mediaURLs: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    itemName: PropTypes.string,
    price: PropTypes.any,
    shortDescription: PropTypes.any,
    longDescription: PropTypes.any,
    addOns: PropTypes.array,
    preferences: PropTypes.array,
    notes: PropTypes.string
  }),
  allowItemComments: PropTypes.bool,
  quantity: PropTypes.number,
  onCheckboxChange: PropTypes.func.isRequired,
  onQtyPlus: PropTypes.func.isRequired,
  onQtyMinus: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  onItemVersionChange: PropTypes.func.isRequired,
  onTextChange: PropTypes.func.isRequired
};
