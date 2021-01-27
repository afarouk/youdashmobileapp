import React, { useEffect, useState } from 'react';
import { Slider, InputNumber } from 'antd';
import useTipsSource from '../../hooks/order-details/useTipsSource';

export const Tips = ({ tips, onChange }) => {
  const [tipsLabels, setTipsLabels] = useState({});
  const [otherMode, setOtherMode] = useState(false);
  const tipsSource = useTipsSource();
  const max = tipsSource ? +Object.keys(tipsSource)[Object.keys(tipsSource).length - 1] + 5 : 0;
  function formatter(value) {
    return `${value}%`;
  }
  useEffect(() => {
    if (tipsSource) {
      setTipsLabels({
        ...tipsSource,
        [max]: 'Other'
      });
    }
  }, [tipsSource]);
  if (!tipsSource) return null;
  const handleOther = (value) => {
    onChange(value ? value : 0);
  };
  const handleSlider = (value) => {
    if (value === max) {
      if (!otherMode) {
        setOtherMode(true);
      }
      onChange(value);
    } else {
      if (otherMode) {
        setOtherMode(false);
      }
      onChange(value);
    }
  };
  return (
    <div className="tips">
      <Slider
        marks={tipsLabels}
        step={null}
        defaultValue={0}
        value={!otherMode ? tips.value : max}
        tooltipVisible={false}
        onChange={handleSlider}
        min={0}
        max={max}
      />
      {otherMode && (
        <div className="other-amount">
          <span className="font-size-md">Enter amount </span>
          <InputNumber
            prefix={'$'}
            formatter={formatter}
            min={0}
            max={100}
            defaultValue={max + 1}
            value={tips.value}
            onChange={handleOther}
          />
        </div>
      )}
    </div>
  );
};

Tips.propTypes = {
  //myProp: PropTypes.string.isRequired
};
