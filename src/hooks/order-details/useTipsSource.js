import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default () => {
  const [tipsSource, setTipsSource] = useState(null);
  const businessData = useSelector((state) => state.business.data);

  useEffect(() => {
    const { tips } = businessData.onlineOrder;
    if (!tipsSource && businessData && tips && tips.length) {
      let tipsObj = {};
      tips.map(({ percent, displayText }) => (tipsObj[+percent] = displayText));
      if (Object.keys(tipsObj).length > 0) {
        setTipsSource(tipsObj);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData]);
  return tipsSource;
};
