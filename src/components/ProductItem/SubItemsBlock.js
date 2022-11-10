import { SubItems } from './SubItems';
import React from 'react';

export const SubItemsBlock = ({ s1/*subItems*/, onCheckboxChange, parentPropName }) => {
  return (s1/*subItems*/ || []).map((subItem, i) => {
    if (!subItem.t1/*selectorType*/) return null;

    return (
      <SubItems
        m4/*maxSubSubCount*/={subItem.m4/*maxSubSubCount*/}
        m3/*minSubSubCount*/={subItem.m3/*minSubSubCount*/}
        t1/*selectorType*/={subItem.t1/*selectorType*/}
        parentPropName={parentPropName}
        parentPropIndex={i}
        onCheckboxChange={onCheckboxChange}
        title={subItem.s1/*subItemName*/}
        p1/*promptText*/={subItem.p1/*promptText*/}
        addOns={subItem.sS/*subSubItems*/}
        key={`${parentPropName}${i}`}
      />
    );
  });
};
