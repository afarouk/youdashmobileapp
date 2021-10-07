import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import stickybits from 'stickybits';
import throttle from 'lodash/throttle';
import scrollIntoView from 'scroll-into-view'

import './Groups.css';
import { ArrowLeftOutlinedIcon, ArrowRightOutlinedIcon } from "../../Shared/Icons/Icons";
import { scrollToElement } from '../../../utils/helpers';
import { Group } from './Group/Group';
const { TabPane } = Tabs;

// stickybits('.groups-tabs ', { noStyles: true });
export const Groups = memo(({ groups }) => {
  const [activeKey, setActiveKey] = useState(1);
  const isScrollingToSectionRef = useRef(false);

  const getSectionId = (index) => {
    return `section-${index}`;
  }

  const scrollToSection = (key) => {
    isScrollingToSectionRef.current = true;
    const section = document.getElementById(getSectionId(key));

    const scrollConfig = { 
      time: 400,
      align: {
        top: 0,
        topOffset: 100,
      }
    }
    scrollIntoView(section, scrollConfig, () => {
      isScrollingToSectionRef.current = false;
    })
  }

  const handleTabClick = ([key]) => {
    scrollToSection(key)
    setActiveKey(parseInt(key));
  };
  const resizeTab = groups.length && groups.length < 3;

  const arrowLeftRef = useRef(null);
  const arrowRightRef = useRef(null);


  useEffect(() => {
    const handleScroll = throttle(() => {
      // this is quick solution, check if we have performance issues
      // add requestAnimationFrame here
      if (isScrollingToSectionRef.current) return;

      const g = (groups || []);

      for(let i = 0; i <= g.length; i++) {
        const section = document.getElementById(getSectionId(i + 1));
        
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        
        const headerHeight = 45;
        const menuHeight = 45;
        const gap = 140;
        const topOffset = headerHeight + menuHeight + gap;
        if (rect.y + rect.height - topOffset > 0) {
          if (activeKey !== i + 1) {
            setActiveKey(i + 1);
          }

          break;
        }

      }
      
    }, 100)

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [activeKey])

  const handleLeftClick = (event) => {
    if (activeKey !== 1) {
      const newKey = activeKey - 1;
      setActiveKey(newKey);
      scrollToSection(newKey)
    }
  };

  const handleRightClick = (event) => {
    if (activeKey !== groups.length) {
      const newKey = activeKey + 1
      setActiveKey(newKey);
      scrollToSection(newKey)
    }
  };

  return (
    <div className={`groups-tabs ${resizeTab ? `tabs-${groups.length}-only` : ''}`}>
      <Tabs 
        className="so-groups-tabs"
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
            </TabPane>
          )
        })}
      </Tabs>

      {(groups || []).map(({ groupDisplayText, id, unSubgroupedItems }, index) => {
        return (
          <Group 
            key={index}
            title={groupDisplayText} 
            id={getSectionId(index + 1)}
            products={unSubgroupedItems}
          />
        );
      })}
    </div>
  );
});

Groups.propTypes = {
  groups: PropTypes.array
};
