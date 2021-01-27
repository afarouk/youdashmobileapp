import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import stickybits from 'stickybits';

import './Groups.css';
import { ProductCard } from './ProductCard/ProductCard';
const { TabPane } = Tabs;

stickybits('.groups-tabs ', { noStyles: true });
export const Groups = memo(({ groups }) => {
  const [activeKey, setActiveKey] = useState('1');
  const handleTabClick = ({ key }) => setActiveKey(key);
  const resizeTab = groups.length && groups.length < 4;
  return (
    <div className={`groups-tabs ${resizeTab ? `tabs-${groups.length}-only` : ''}`}>
      <Tabs activeKey={activeKey} onTabClick={handleTabClick}>
        {(groups || []).map(({ groupDisplayText, id, unSubgroupedItems }, index) => (
          <TabPane tab={groupDisplayText} key={index + 1}>
            {(unSubgroupedItems || []).map((product, productIndex) => (
              <ProductCard product={product} key={`product${index}${productIndex}`} />
            ))}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
});

Groups.propTypes = {
  groups: PropTypes.array
};
