import { useEffect, useState } from 'react';
import { produce } from 'immer';
export const updateSubSubItemsVersionPriceAdjustment = (version, items) => {
  let oldPriceDifference = 0;
  let newPriceDifference = 0;
  let updatedItems = items.map((item) => {
    if (!item || !item.subSubItems || !item.subSubItems.length) return item;
    return {
      ...item,
      subSubItems: item.subSubItems.map((subSubItem) => {
        //update for subSubItems with multiple versionPriceAdjustment array
        if (subSubItem.versionPriceAdjustment && subSubItem.versionPriceAdjustment.length > 0) {
          const innerFiltered = subSubItem.versionPriceAdjustment.filter(
            (adjustment) => adjustment.versionId === version
          );

          if (innerFiltered && innerFiltered.length > 0) {
            if (subSubItem.priceAdjustment && innerFiltered[0].cost) {
              //re-calc cost only is item was selected
              if (subSubItem.isSelected) {
                //need to get previous versionPriceAdjustment value and subtract it from overall price value
                oldPriceDifference += subSubItem.priceAdjustment;
                //then need to apply new price
                newPriceDifference += innerFiltered[0].cost;
              }
              subSubItem.priceAdjustment = innerFiltered[0].cost;
            }
          }
        } else if (!subSubItem.versionPriceAdjustment && subSubItem.priceAdjustment) {
          //update for subSubItems with single priceAdjustment property
          if (subSubItem.isSelected) {
            oldPriceDifference += subSubItem.priceAdjustment;
            newPriceDifference += subSubItem.priceAdjustment;
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
    priceAdjustment,
    value,
    isRadio
  ) => {
    setProductItem(
      produce(productItem, (draft) => {
        if (isRadio) {
          draft.itemOptions[parentPropName][parentPropIndex]['subSubItems'] = draft.itemOptions[
            parentPropName
          ][parentPropIndex]['subSubItems'].map((radioItem) => {
            if (radioItem.priceAdjustment && radioItem.isSelected) {
              let tmpPrice = (draft.price -= radioItem.priceAdjustment);
              draft.price = tmpPrice >= 0 ? tmpPrice : 0;
            }
            return {
              ...radioItem,
              isSelected: false
            };
          });
        }

        draft.itemOptions[parentPropName][parentPropIndex]['subSubItems'][subPropIndex][
          subPropName
        ] = value;

        if (priceAdjustment && value) {
          draft.price += priceAdjustment;
        } else if (priceAdjustment && !value) {
          let tmpPrice = (draft.price -= priceAdjustment);
          draft.price = tmpPrice >= 0 ? tmpPrice : 0;
        }

        const { maxSubSubCount, minSubSubCount } = draft.itemOptions[parentPropName][
          parentPropIndex
        ];
        if (maxSubSubCount && !isRadio) {
          const selectedLength = draft.itemOptions[parentPropName][parentPropIndex][
            'subSubItems'
          ].filter((i) => i.isSelected).length;
          if (selectedLength === maxSubSubCount) {
            draft.itemOptions[parentPropName][parentPropIndex]['subSubItems'] = draft.itemOptions[
              parentPropName
            ][parentPropIndex]['subSubItems'].map((item) =>
              item.isSelected ? item : { ...item, isDisabled: true }
            );
          } else {
            draft.itemOptions[parentPropName][parentPropIndex]['subSubItems'] = draft.itemOptions[
              parentPropName
            ][parentPropIndex]['subSubItems'].map((item) =>
              item.isDisabled ? { ...item, isDisabled: false } : item
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

          let subOptions = draft?.itemOptions?.subOptions;
          let subItems = draft?.itemOptions?.subItems;
          let subItemsLeft = draft?.itemOptions?.subItemsLeft;

          if (subOptions && subOptions.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(version, subOptions);
            draft.itemOptions.subOptions = result.items;
            draft.price -= result.oldPriceDifference;
            draft.price += result.newPriceDifference;
          }
          if (subItems && subItems.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(version, subItems);
            draft.itemOptions.subItems = result.items;
            draft.price -= result.oldPriceDifference;
            draft.price += result.newPriceDifference;
          }
          if (subItemsLeft && subItemsLeft.length) {
            const result = updateSubSubItemsVersionPriceAdjustment(version, subItemsLeft);
            draft.itemOptions.subItemsLeft = result.items;
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
