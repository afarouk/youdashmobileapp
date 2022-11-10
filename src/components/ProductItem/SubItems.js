import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { Radio } from 'antd';

export const SubItems = ({
  title,
  p1/*promptText*/,
  addOns,
  parentPropName,
  parentPropIndex,
  onCheckboxChange,
  t1/*selectorType*/
}) => {
  const handleCheckboxChange = (index, p1/*priceAdjustment*/, e, isRadio = false) => {
    onCheckboxChange(
      parentPropIndex,
      parentPropName,
      index,
      'iS' /*'isSelected'*/,
      p1/*priceAdjustment*/,
      e.target.checked,
      isRadio
    );
  };

  return (
    <div className="product-row bg-secondary">
      <h4 className="font-size-md">{title}</h4>
      {p1/*promptText*/&& <h5 className="font-size-sm">{p1/*promptText*/}</h5>}
      {t1/*selectorType*/ === 'CHECKBOX' && (
        <div className="addons-row">
          {(addOns || []).map(
            (addOn, index) => {
              const { s1/*subSubItemName*/, id, iS/*isSelected*/, iD/*isDisabled*/, p1/*priceAdjustment*/ } = addOn
              return (
                <div key={`${parentPropName}${parentPropIndex}${index}`} className="choice">
                  <Checkbox
                    disabled={iD/*isDisabled*/}
                    onChange={(e) => handleCheckboxChange(index, p1/*priceAdjustment*/, e)}
                    checked={iS/*isSelected*/}
                  >
                    <span className="addon-label addon-label-checkbox font-size-sm">
                      {s1/*subSubItemName*/}
                      {p1/*priceAdjustment*/ ? (
                        <span className="addon-label-checkbox__price font-size-xs">
                          (${p1/*priceAdjustment*/.toFixed(2)})
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

      {t1/*selectorType*/ === 'RADIO' && (
        <div className="addons-row">
          {/*<Radio.Group onChange={handleRadioChange} value={radioValue}>*/}
          <div className="preferences">
            {addOns.map(
              ({ s1/*subSubItemName*/, id, iS/*isSelected*/, iD/*isDisabled*/, p1/*priceAdjustment*/ }, index) => {
                return (
                  <div key={`${parentPropName}${parentPropIndex}${index}`} className="choice">
                    <Radio
                      disabled={iD/*isDisabled*/}
                      value={index}
                      checked={iS/*isSelected*/}
                      onChange={(e) => handleCheckboxChange(index, p1/*priceAdjustment*/, e, true)}
                    >
                      <span className="addon-label font-size-sm">
                        {s1/*subSubItemName*/}
                        {p1/*priceAdjustment*/ ? (
                          <span className="addon-label-checkbox__price font-size-xs">
                            (${p1/*priceAdjustment*/.toFixed(2)})
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
