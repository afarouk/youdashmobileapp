import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { userSASLSummaryPriorities } from '../../../config/constants';
import { Notification } from './Notification/Notification';
import { HighlightedItem } from './HighlightedItem/HighlightedItem';
import useHighLightedItem from './HighlightedItem/useHighLightedItem';
import usePoll from './PollPreview/usePoll';
import { PollPreview } from './PollPreview/PollPreview';

export const PriorityCard = ({ user, priorityBox, loyaltyAndOrderHistory, itemsById }) => {
  let { notification } = priorityBox;
  if (user && loyaltyAndOrderHistory && loyaltyAndOrderHistory.notification) {
    notification = loyaltyAndOrderHistory.notification;
  }
  const { priority, highLightedItem, polls } = priorityBox || {};
  const [item, highLightMessage] = useHighLightedItem(highLightedItem, itemsById);
  const [poll] = usePoll(polls);
  return (
    <>
      {priority === userSASLSummaryPriorities.POLL && poll && <PollPreview poll={poll} />}
      {priority === userSASLSummaryPriorities.HIGHLIGHTED_ITEM && item && (
        <HighlightedItem item={item} message={highLightMessage} />
      )}
      {(priority === userSASLSummaryPriorities.NONE ||
        priority === userSASLSummaryPriorities.NOTIFICATION) &&
        notification && (
          <Notification
            notification={notification}
            title={'Hello'}
            name={user ? user.firstName : ''}
            welcomeMessage={user ? user.welcomeMessage : ''}
          />
        )}
    </>
  );
};

PriorityCard.propTypes = {
  loyaltyAndOrderHistory: PropTypes.object,
  user: PropTypes.object
};
