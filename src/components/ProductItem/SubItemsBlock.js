import { SubItems } from './SubItems';
import React from 'react';

export const SubItemsBlock = ({ subItems, onCheckboxChange, parentPropName }) => {
  return (subItems || []).map((subItem, i) => {
    if (!subItem.selectorType) return null;

    return (
      <SubItems
        maxSubSubCount={subItem.maxSubSubCount}
        minSubSubCount={subItem.minSubSubCount}
        selectorType={subItem.selectorType}
        parentPropName={parentPropName}
        parentPropIndex={i}
        onCheckboxChange={onCheckboxChange}
        title={subItem.subItemName}
        promptText={subItem.promptText}
        addOns={subItem.subSubItems}
        key={`${parentPropName}${i}`}
      />
    );
  });
};
