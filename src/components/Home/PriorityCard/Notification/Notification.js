import React, { memo } from 'react';
import PropTypes from 'prop-types';
// import avatarIcon from '../../../assets/images/avatar.png';
import './Notification.css';
import { Card } from '../../../Shared/Card/Card';
export const Notification = memo(({ name = '', title, welcomeMessage, notification }) => {
  const { notificationBody, imageURL } = notification;
  return (
    <Card className="greetings">
      <div className="greetings-avatar" style={{ backgroundImage: `url('${imageURL}')` }} />
      <div className="greetings__content">
        <h4 className="greetings__content-title primary-text font-size-md">
          {`${title} ${name}`}!
        </h4>
        {notificationBody && <p>{notificationBody}</p>}
      </div>
    </Card>
  );
});

Notification.propTypes = {
  notification: PropTypes.object,
  avatar: PropTypes.string,
  welcomeMessage: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string
};
