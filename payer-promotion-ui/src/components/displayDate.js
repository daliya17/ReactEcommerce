import React from 'react';
import { Tooltip } from '@material-ui/core';

/**
 * Displays date with timestamp as tooltip
 * @param {string} date
 */
export const displayDate = (date, spanClassName = '') => {
  const dateObj = new Date(date);
  const dateString = dateObj.toLocaleDateString('en-US');
  const timeString = dateObj.toLocaleTimeString('en-US');

  return (
    <Tooltip title={timeString}>
      <span className={spanClassName}>{dateString}</span>
    </Tooltip>
  );
};
