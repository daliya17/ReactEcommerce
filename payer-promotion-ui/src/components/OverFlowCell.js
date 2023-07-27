import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';

const styles = {
  overflow: {
    maxWidth: '180px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: 'inherit'
  }
};

const OverFlowCell = props => {
  const { classes, displayText = '' } = props;

  return (
    <Tooltip title={displayText}>
      <span className={classes.overflow}>{displayText}</span>
    </Tooltip>
  );
};

OverFlowCell.propTypes = {
  classes: PropTypes.object.isRequired,
  displayText: PropTypes.string
};

export default withStyles(styles)(OverFlowCell);
