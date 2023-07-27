import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, withStyles } from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import DiffCategorizationRulesLibrary from '../../../../lib/DiffCategorizationRulesLibrary';

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
  },
  categoryContent: {
    color: '#777',
    paddingLeft: '6px'
  },
  smallIcon: {
    color: '#777',
    fontSize: '12px'
  }
};

const diffCategoryTooltip = props => {
  const { classes, diff } = props;

  let ruleInfo = '';
  if (diff.ruleId) {
    const rule = DiffCategorizationRulesLibrary.getRuleById(diff.ruleId) || {};
    if (rule.isGlobal) {
      ruleInfo = 'Global Rule';
    } else if (rule.payerId) {
      ruleInfo = 'For Payer: ' + rule.payerName;
    }
    if (rule.deleted) {
      ruleInfo += ' (deleted)';
    }
  }

  return (
    <Tooltip
      classes={{
        tooltip: classes.tooltip,
        popper: classes.popper
      }}
      title={
        <React.Fragment>
          <div className={classes.newline}>{'Category : ' + diff.category}</div>
          {ruleInfo && (
            <div className={classes.newline}>{'Rule: ' + ruleInfo}</div>
          )}
          {diff.description && (
            <div className={classes.newline}>
              {'Description : ' + diff.description}
            </div>
          )}
          {diff.notes && (
            <div className={classes.newline}>{'Notes : ' + diff.notes}</div>
          )}
        </React.Fragment>
      }
    >
      <span className={classes.categoryContent}>
        {diff.notes && <CommentIcon className={classes.smallIcon} />}
        {diff.category}
      </span>
    </Tooltip>
  );
};

diffCategoryTooltip.propTypes = {
  classes: PropTypes.object,
  diff: PropTypes.shape({
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    notes: PropTypes.string,
    ruleId: PropTypes.number
  }).isRequired
};

export default withStyles(styles)(diffCategoryTooltip);
