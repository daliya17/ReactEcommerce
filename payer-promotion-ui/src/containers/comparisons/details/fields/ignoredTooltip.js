import { Tooltip, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import React from 'react';
import DiffRulesLibrary from '../../../../lib/DiffRulesLibrary';
import PayersLibrary from '../../../../lib/PayersLibrary';

const styles = {
  popper: {
    opacity: 1
  },
  tooltip: {
    borderRadius: '2px',
    padding: '1px 15px 10px 15px',
    fontSize: '13px'
  },
  newline: {
    display: 'block',
    marginTop: '10px'
  }
};

const ignoredToolTip = props => {
  const field = props.field || {};
  const ignoreRuleId = field.ignoreRuleId || '';
  const diffRule = DiffRulesLibrary.getDiffRule(ignoreRuleId) || {};
  const classes = props.classes;

  let ruleType = '';
  if (diffRule.isGlobal) {
    ruleType = 'Global Rule';
  } else if (diffRule.payerId) {
    ruleType = 'For Payer: ' + PayersLibrary.getPayerName(diffRule.payerId);
  } else if (diffRule.paymentBatchId) {
    ruleType = 'For Batch: ' + diffRule.paymentBatchId;
  }
  if (diffRule.deleted) {
    ruleType += ' (deleted)';
  }

  return (
    <Tooltip
      classes={{
        tooltip: classes.tooltip,
        popper: classes.popper
      }}
      title={
        <React.Fragment>
          <span className={classes.newline}>
            This field has been ignored for score calculation
          </span>
          {ruleType && (
            <span className={classes.newline}>{'Rule Type: ' + ruleType}</span>
          )}
          {diffRule.notes && (
            <span className={classes.newline}>
              {'Notes: ' + diffRule.notes}
            </span>
          )}
        </React.Fragment>
      }
    >
      <InfoIcon className="diff-icon" />
    </Tooltip>
  );
};

ignoredToolTip.propTypes = {
  classes: PropTypes.object.isRequired,
  field: PropTypes.shape({
    ignoreRuleId: PropTypes.number.isRequired
  }).isRequired
};

export default withStyles(styles)(ignoredToolTip);
