import { useEffect, useState } from 'react';
import { produce } from 'immer';
export const updateSubSubItemsVersionPriceAdjustment = (version, items) => {
  let oldPriceDifference = 0;
  let newPriceDifference = 0;
  let updatedItems = items.map((item) => {
    if (!item || !item.sS/*subSubItems*/ || !item.sS/*subSubItems*/.length) return item;
    return {
      ...item,
      sS/*subSubItems*/: item.sS/*subSubItems*/.map((subSubItem) => {
        //update for subSubItems with multiple versionPriceAdjustment array
        if (subSubItem.v1/*versionPriceAdjustment*/ && subSubItem.v1/*versionPriceAdjustment*/.length > 0) {
          const innerFiltered = subSubItem.v1/*versionPriceAdjustment*/.filter(
            (adjustment) => adjustment.versionIndex === version
          );

          if (innerFiltered && innerFiltered.length > 0) {
            if (subSubItem.p1/*priceAdjustment*/ && innerFiltered[0].cost) {
              //re-calc cost only is item was selected
              if (subSubItem.iS/*isSelected*/) {
                //need to get previous versionPriceAdjustment value and subtract it from overall price value
                oldPriceDifference += subSubItem.p1/*priceAdjustment*/;
                //then need to apply new price
                newPriceDifference += innerFiltered[0].cost;
              }
              subSubItem.p1/*priceAdjustment*/ = innerFiltered[0].cost;
            }
          }
        } else if (!subSubItem.v1/*versionPriceAdjustment*/ && subSubItem.p1/*priceAdjustment*/) {
          //update for subSubItems with single priceAdjustment property
          if (subSubItem.iS/*isSelected*/) {
            oldPriceDifference += subSubItem.p1/*priceAdjustment*/;
            newPriceDifference += subSubItem.p1/*priceAdjustment*/;
          }
        }
        //TODO: need to check this with some working radio values
        /*        if (
          !subSubItem.versionPriceAdjustment &&
          subSubItem.isSelected &&
          subSubItem.priceAdjustment &&
          item.selectorType &&
          item.selectorType === 'RADIO'
        ) {
          newPriceDifference += subSubItem.priceAdjustment;
        }*/

        return subSubItem;
      })
    };
  });

  return {
    oldPriceDifference,
    newPriceDifference,
    items: updatedItems
  };
};
export default (item) => {
  const [productItem, setProductItem] = useState(null);
  const handleSubItemCheckboxChange = (
    parentPropIndex,
    parentPropName,
    subPropIndex,
    subPropName,
    p1/*priceAdjustment*/,
    value,
    isRadio
  ) => {
    setProductItem(
      produce(productItem, (draft) => {
        if (isRadio) {
          draft.itemOptions[parentPropName][parentPropIndex]['sS'/*subSubItems*/] = draft.itemOptions[
            parentPropName
          ][parentPropIndex]['sS'/*subSubItems*/].map((radioItem) => {
            if (radioItem.p1/*priceAdjustment*/ && radioItem.iS/*isSelected*/) {
              let tmpPrice = (draft.price -= radioItem.p1/*priceAdjustment*/);
              draft.price = tmpPrice >= 0 ? tmpPrice : 0;
            }
            return {
              ...radioItem,
              iS/*isSelected*/: false
            };
          });
        }

        draft.itemOptions[parentPropName][parentPropIndex]['sS'/*subSubItems*/][subPropIndex][
          subPropName
        ] = value;

        if (p1/*priceAdjustment*/ && value) {
          draft.price += p1/*priceAdjustment*/;
        } else if (p1/*priceAdjustment*/ && !value) {
          let tmpPrice = (draft.price -= p1/*priceAdjustment*/);
          draft.price = tmpPrice >= 0 ? tmpPrice : 0;
        }

        const { m4/*maxSubSubCount*/, m3/*minSubSubCount*/ } = draft.itemOptions[parentPropName][
          parentPropIndex
        ];
        if (m4/*maxSubSubCount*/ && !isRadio) {
          const selectedLength = draft.itemOptions[parentPropName][parentPropIndex][
            'sS'/* 'subSubItems'*/
          ].filter((i) => i.iS/*isSelected*/).length;
          if (selectedLength === m4/*maxSubSubCount*/) {
            draft.itemOptions[parentPropName][parentPropIndex]['sS'/*subSubItems*/] = draft.itemOptions[
              parentPropName
            ][parentPropIndex]['sS'/*subSubItems*/].map((item) =>
              item.iS/*isSelected*/ ? item : { ...item, iD/*isDisabled*/: true }
            );
          } else {
            draft.itemOptions[parentPropName][parentPropIndex]['sS'/*subSubItems*/] = draft.itemOptions[
              parentPropName
            ][parentPropIndex]['sS'/*subSubItems*/].map((item) =>
              item.iD/*isDisabled*/ ? { ...item, iD/*isDisabled*/: false } : item
            );
          }
        }
      })
    );
  };

  const handleCommentsChange = (e) => {
    setProductItem(
      produce(productItem, (draft) => {
        draft.comments = e.target.value;
      })
    );
  };
  const handleQuantityPlus = () => {
    setProductItem(
      produce(productItem, (draft) => {
        draft.quantity = draft.quantity + 1;
      })
    );
  };
  const handleQuantityMinus = () => {
    setProductItem(
      produce(productItem, (draft) => {
        draft.quantity = draft.quantity > 1 ? draft.quantity - 1 : 1;
      })
    );
  };

  const handleItemVersionChange = (version) => {
    setProductItem(
      produce(productItem, (draft) => {
        const filtered = draft.itemVersions.filter(({ itemVersion }) => itemVersion === version);
        const previousItemVersion = draft.itemVersion;

        const filteredPreviousVersionData = draft.itemVersions.filter(
          ({ itemVersion }) =>
            itemVersion ===
            (typeof previousItemVersion === 'object'
              ? previousItemVersion.versionId
              : previousItemVersion)
        );
        if (
          filteredPreviousVersionData &&
          filteredPreviousVersionData.length > 0 &&
          filtered &&
          filtered.length > 0
        ) {
          let oldPrice = filteredPreviousVersionData[0].price;
          let newPrice = filtered[0].price;
          draft.price -= oldPrice;
          draft.price += newPrice;

          draft.itemVersion = filtered[0].itemVersion;

          let s0/*subOptions*/ = draft?.itemOptions?.s0/*subOptions*/;
          let s1/*subItems*/ = draft?.itemOptions?.s1/*subItems*/;
          let s2/*subItemsLeft*/ = draft?.itemOptions?.s2/*subItemsLeft*/;

          if (s0/*subOptions*/  && s0/*subOptions*/ .length) {
            const result = updateSubSubItemsVersionPriceAdjustment(version, s0/*subOptions*/ );
            draft.itemOptions.s0/*subOptions*/  = result.items;
            draft.price -= result.oldPriceDifference;
            draft.price += result.newPriceDifference;
          }
          if (s1/*subItems*/ && s1/*subItems*/.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(version, s1/*subItems*/);
            draft.itemOptions.s1/*subItems*/ = result.items;
            draft.price -= result.oldPriceDifference;
            draft.price += result.newPriceDifference;
          }
          if (s2/*subItemsLeft*/ && s2/*subItemsLeft*/.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(version, s2/*subItemsLeft*/);
            draft.itemOptions.s2/*subItemsLeft*/ = result.items;
            draft.price -= result.oldPriceDifference;
            draft.price += result.newPriceDifference;
          }
        }
      })
    );
  };
  useEffect(() => {
    if (item && typeof item !== 'undefined') {
      setProductItem(
        produce(item, (draft) => {
          if (!item.quantity) {
            draft.quantity = 1;
          }
        })
      );
    }
  }, [item]);
  return [
    productItem,
    handleSubItemCheckboxChange,
    handleQuantityPlus,
    handleQuantityMinus,
    handleCommentsChange,
    handleItemVersionChange
  ];
};
