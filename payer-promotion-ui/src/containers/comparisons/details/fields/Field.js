import { Tooltip, withStyles } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { statusLabels } from '../../../../constants/FieldStatuses';
import Lib from '../../../../lib';
import { select } from '../../../../lib/selectors/field';
import diffCategorizable from '../../../diffs/diffCategorizable';
import * as Colors from '../../colors';
import DiffCategoryTooltip from './diffCategoryTooltip';
import Evaluations from './Evaluations';
import IgnoredTooltip from './ignoredTooltip';

const styles = {
  ...Colors.backgroundColors,
  toolTipPopper: {
    opacity: 1
  },
  toolTip: {
    padding: '8px',
    fontSize: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  category: {
    fontSize: '12px !important',
    maxWidth: '100px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
};

const Field = props => {
  const { classes, isVisible, field, contextMenuHandler, level } = props;
  if (!isVisible) return null;

  const { stat: status, diff, originalStatus } = field;
  const title = field.sf ? 'Source Mapping : ' + field.sf : '';

  return (
    <tr
      className={classes[Colors.backgroundColorStatusMappings[status]]}
      onContextMenu={contextMenuHandler(diff)}
    >
      <Tooltip
        title={
          originalStatus
            ? 'Status before categorization : ' + statusLabels[originalStatus]
            : ''
        }
      >
        <td
          className={classNames(
            'original-status-cell',
            'nopadding',
            classes[Colors.backgroundColorStatusMappings[originalStatus]]
          )}
        />
      </Tooltip>
      <td className="name-cell">
        <Tooltip
          title={title}
          classes={{
            tooltip: classes.toolTip,
            popper: classes.toolTipPopper
          }}
        >
          <span>{Lib.fieldDisplayName(field.id, level)}</span>
        </Tooltip>
        {field.ignoreRuleId && <IgnoredTooltip field={field} />}
      </td>
      <td>{field.av}</td>
      <td>{field.ov}</td>
      <td>{field.gv}</td>
      <td className={classNames('nopadding', classes.category)}>
        {diff && diff.category && <DiffCategoryTooltip diff={diff} />}
      </td>
      <td className="nopadding">
        {field.evals.length > 0 && (
          <Evaluations fieldId={field.id} evals={field.evals} />
        )}
      </td>
    </tr>
  );
};

Field.propTypes = {
  classes: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  field: PropTypes.shape({
    id: PropTypes.string,
    ov: PropTypes.string,
    gv: PropTypes.string,
    av: PropTypes.string,
    stat: PropTypes.string,
    evals: PropTypes.array.isRequired,
    ignoreRuleId: PropTypes.number,
    diff: PropTypes.shape({
      id: PropTypes.string.isRequired,
      category: PropTypes.string,
      description: PropTypes.string,
      notes: PropTypes.string,
      claimId: PropTypes.string,
      chargeId: PropTypes.string,
      batchExceptionId: PropTypes.string,
      fieldName: PropTypes.string,
      ruleId: PropTypes.number
    })
  }),
  level: PropTypes.string.isRequired,
  contextMenuHandler: PropTypes.func.isRequired
};

export default connect(select)(withStyles(styles)(diffCategorizable(Field)));
