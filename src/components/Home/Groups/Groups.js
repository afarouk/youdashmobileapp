import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import stickybits from 'stickybits';

import './Groups.css';
import { ProductCard } from './ProductCard/ProductCard';
import { ArrowLeftOutlinedIcon, ArrowRightOutlinedIcon } from "../../Shared/Icons/Icons";
const { TabPane } = Tabs;

stickybits('.groups-tabs ', { noStyles: true });
export const Groups = memo(({ groups }) => {
  const [activeKey, setActiveKey] = useState(1);
  const handleTabClick = ([key]) => {
    setActiveKey(parseInt(key))
  };
  const resizeTab = groups.length && groups.length < 3;

  const arrowLeftRef = useRef(null);
  const arrowRightRef = useRef(null);

  // useEffect(() => {
  //   if (!groups || !groups.length) {
  //     return;
  //   }

  //   const options = {
  //     root: document.querySelector('.groups-tabs .ant-tabs-nav-wrap'),
  //     rootMargin: '0px',
  //     threshold: 1.0
  //   }

  //   const callback = (entries, observer) => {
  //     entries.forEach(entry => {
  //       entry.target.setAttribute('data-is-intersecting', entry.isIntersecting);
  //     });

  //     // TODO: use refs instead of query selectors
  //     const tabs = document.querySelectorAll('.groups-tabs .ant-tabs-tab');
  //     const firstTab = tabs[0];
  //     const lastTab = tabs[tabs.length - 1];

  //     if (firstTab.getAttribute('data-is-intersecting') === 'true') {
  //       arrowLeftRef.current.classList.add('disabled')
  //     } else {
  //       arrowLeftRef.current.classList.remove('disabled')
  //     }

  //     if (lastTab.getAttribute('data-is-intersecting') === 'true') {
  //       arrowRightRef.current.classList.add('disabled')
  //     } else {
  //       arrowRightRef.current.classList.remove('disabled')

  //     }
  //   };
    
  //   const observer = new IntersectionObserver(callback, options);

  //   const targets = document.querySelectorAll('.groups-tabs .ant-tabs-tab');
  //   targets.forEach(target => observer.observe(target));

  //   return () => {
  //     observer.disconnect();
  //   }

  // }, [groups])

  const handleLeftClick = (event) => {
    if (activeKey !== 1) {
      setActiveKey(activeKey - 1);
    }
  }

  const handleRightClick = (event) => {
    if (activeKey !== groups.length) {
      setActiveKey(activeKey + 1);
    }
  }

  return (
    <div className={`groups-tabs ${resizeTab ? `tabs-${groups.length}-only` : ''}`}>
      <Tabs 
        activeKey={`${activeKey}`} 
        onTabClick={handleTabClick} 
        tabBarExtraContent={groups.length > 2 && {
          left: <ArrowLeftOutlinedIcon 
            ref={arrowLeftRef} 
            onClick={handleLeftClick} 
            className={activeKey === 1 ? 'disabled' : ''}
          />,
          right: <ArrowRightOutlinedIcon 
            ref={arrowRightRef} 
            onClick={handleRightClick} 
            className={activeKey === groups.length ? 'disabled' : ''}

          />,
        }}
        renderTabBar={(props, DefaultTabBar) => {
          return <DefaultTabBar {...props} mobile />
        }}
      >
        {(groups || []).map(({ groupDisplayText, id, unSubgroupedItems }, index) => {
          const title = groupDisplayText.length <= 10 ? groupDisplayText : `${groupDisplayText.substring(0, 10)}...`

          return (
            <TabPane tab={title} key={index + 1}>
              {(unSubgroupedItems || []).map((product, productIndex) => (
                <ProductCard product={product} key={`product${index}${productIndex}`} />
              ))}
            </TabPane>
          )
        })}
      </Tabs>
    </div>
  );
});

Groups.propTypes = {
  groups: PropTypes.array
};
