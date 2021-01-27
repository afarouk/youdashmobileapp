import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { Radio } from 'antd';

export const SubItems = ({
  title,
  promptText,
  addOns,
  parentPropName,
  parentPropIndex,
  onCheckboxChange,
  selectorType
}) => {
  const handleCheckboxChange = (index, priceAdjustment, e, isRadio = false) => {
    onCheckboxChange(
      parentPropIndex,
      parentPropName,
      index,
      'isSelected',
      priceAdjustment,
      e.target.checked,
      isRadio
    );
  };

  return (
    <div className="product-row bg-secondary">
      <h4 className="font-size-md">{title}</h4>
      {promptText && <h5 className="font-size-sm">{promptText}</h5>}
      {selectorType === 'CHECKBOX' && (
        <div className="addons-row">
          {(addOns || []).map(
            ({ subSubItemName, id, isSelected, isDisabled, priceAdjustment }, index) => {
              // console.log(`${subSubItemName} ${priceAdjustment}`);
              return (
                <div key={`${parentPropName}${parentPropIndex}${index}`} className="choice">
                  <Checkbox
                    disabled={isDisabled}
                    onChange={(e) => handleCheckboxChange(index, priceAdjustment, e)}
                    checked={isSelected}
                  >
                    <span className="addon-label addon-label-checkbox font-size-sm">
                      {subSubItemName}
                      {priceAdjustment ? (
                        <span className="addon-label-checkbox__price font-size-xs">
                          (${priceAdjustment})
                        </span>
                      ) : null}
                    </span>
                  </Checkbox>
                </div>
              );
            }
          )}
        </div>
      )}

      {selectorType === 'RADIO' && (
        <div className="addons-row">
          {/*<Radio.Group onChange={handleRadioChange} value={radioValue}>*/}
          <div className="preferences">
            {addOns.map(
              ({ subSubItemName, id, isSelected, isDisabled, priceAdjustment }, index) => {
                return (
                  <div key={`${parentPropName}${parentPropIndex}${index}`} className="choice">
                    <Radio
                      disabled={isDisabled}
                      value={index}
                      checked={isSelected}
                      onChange={(e) => handleCheckboxChange(index, priceAdjustment, e, true)}
                    >
                      <span className="addon-label font-size-sm">
                        {subSubItemName}
                        {priceAdjustment ? (
                          <span className="addon-label-checkbox__price font-size-xs">
                            (${priceAdjustment})
                          </span>
                        ) : null}
                      </span>
                    </Radio>
                  </div>
                );
              }
            )}
          </div>
          {/*</Radio.Group>*/}
        </div>
      )}
    </div>
  );
};

SubItems.propTypes = {
  addOns: PropTypes.array,
  preferences: PropTypes.array
};
