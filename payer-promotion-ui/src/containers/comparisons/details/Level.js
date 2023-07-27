import { Tooltip, withStyles, RootRef } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/Comment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import expandable from '../../../components/hoc/expandable';
import { select } from '../../../lib/selectors/level';
import diffCategorizable from '../../diffs/diffCategorizable';
import * as Colors from '../colors';
import { withComparisonsMetadata } from '../ComparisonContext';
import Fields from './fields';
import Lib from '../../../lib';

const styles = {
  spacer: {
    flex: '1 1 0%'
  },
  ...Colors.textColors,
  ...Colors.backgroundColors,
  expansionSummary: {
    alignItems: 'center'
  },
  panelDetails: {
    flexDirection: 'column'
  },
  id: {
    marginLeft: '8px',
    color: '#555555'
  },
  originalStatus: {
    width: '8px',
    display: 'inline-block'
  },
  smallIcon: {
    fontSize: '12px',
    marginLeft: '4px'
  },
  category: {
    maxWidth: '160px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
};

const CustomExpansionPanel = expandable(ExpansionPanel);

class Level extends React.Component {
  static defaultProps = {
    isExpanded: false,
    showPercentage: false,
    fields: [],
    id: '',
    keywords: {}
  };

  levelNode = React.createRef();

  componentDidMount() {
    if (this.props.drillDownDiffId) {
      this.checkScrollToLevel();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.drillDownDiffId &&
      prevProps.drillDownDiffId !== this.props.drillDownDiffId
    ) {
      this.checkScrollToLevel();
    }
  }

  checkScrollToLevel() {
    const { getScrollerRef, keywords, drillDownDiffId } = this.props;
    const scrollerRef = getScrollerRef();

    if (keywords[drillDownDiffId] && this.levelNode && scrollerRef) {
      Lib.scrollIntoView(scrollerRef.current, this.levelNode.current);
    }
  }

  isExpanded() {
    const {
      isExpanded,
      keywords,
      drillDownDiffId,
      drillDownValue,
      drillDownStatus
    } = this.props;

    if (isExpanded) return true;
    let keyword = drillDownDiffId || drillDownValue + '-' + drillDownStatus;
    return !!keywords[keyword];
  }

  renderSummary() {
    const { statistics, showPercentage, classes, diff } = this.props;
    if (!statistics) return;

    const {
      total,
      matched,
      added,
      different,
      removed,
      matchedp,
      addedp,
      differentp,
      removedp
    } = statistics;

    return (
      <React.Fragment>
        {diff && (
          <Tooltip
            title={
              <React.Fragment>
                <div>{'Category : ' + diff.category}</div>
                <div>
                  {diff.description ? 'Description : ' + diff.description : ''}
                </div>
                <div>{diff.notes ? 'Notes : ' + diff.notes : ''}</div>
              </React.Fragment>
            }
          >
            <Typography variant="caption" className={classes.category}>
              {diff.notes && <CommentIcon className={classes.smallIcon} />}
              {diff.category}
            </Typography>
          </Tooltip>
        )}
        <Typography variant="caption" className="panel-summary">
          {total}
        </Typography>
        <Typography variant="caption" className="panel-summary">
          {showPercentage ? matchedp : matched}
        </Typography>
        <Typography
          variant="caption"
          className={'panel-summary ' + classes.addedTxt}
        >
          {showPercentage ? addedp : added}
        </Typography>
        <Typography
          variant="caption"
          className={'panel-summary ' + classes.differentTxt}
        >
          {showPercentage ? differentp : different}
        </Typography>
        <Typography
          variant="caption"
          className={'panel-summary ' + classes.removedTxt}
        >
          {showPercentage ? removedp : removed}
        </Typography>
      </React.Fragment>
    );
  }

  render() {
    const expanded = this.isExpanded();
    const { level, classes, fields, id, diff, index, status } = this.props;

    const statusClass = (status || '').match(/REMOVED|ADDED/)
      ? classes[Colors.backgroundColorStatusMappings[status]]
      : undefined;

    return (
      <RootRef rootRef={this.levelNode}>
        <CustomExpansionPanel
          className={'expandable ' + level}
          expanded={expanded}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            classes={{ content: classes.expansionSummary, root: statusClass }}
            onContextMenu={this.props.contextMenuHandler(diff)}
          >
            <Typography variant="subheading" className="subheading">
              {level}
            </Typography>
            {id && (
              <Typography variant="body1" className={classes.id}>
                {(index !== undefined ? index + 1 : '') + ' : ' + id}
              </Typography>
            )}
            <div className={classes.spacer} />
            {this.renderSummary()}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.panelDetails}>
            {this.props.children}
            <Fields fields={fields} level={level} id={id} />
          </ExpansionPanelDetails>
        </CustomExpansionPanel>
      </RootRef>
    );
  }
}

Level.propTypes = {
  classes: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  level: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  statistics: PropTypes.shape({
    total: PropTypes.number.isRequired,
    matched: PropTypes.number.isRequired,
    added: PropTypes.number.isRequired,
    different: PropTypes.number.isRequired,
    removed: PropTypes.number.isRequired,
    matchedp: PropTypes.string.isRequired,
    addedp: PropTypes.string.isRequired,
    differentp: PropTypes.string.isRequired,
    removedp: PropTypes.string.isRequired
  }).isRequired,
  keywords: PropTypes.object.isRequired,
  showPercentage: PropTypes.bool.isRequired,
  id: PropTypes.string,
  index: PropTypes.number,
  status: PropTypes.string,
  drillDownStatus: PropTypes.string,
  drillDownValue: PropTypes.string,
  drillDownDiffId: PropTypes.string,
  getScrollerRef: PropTypes.func.isRequired,
  contextMenuHandler: PropTypes.func.isRequired,
  diffId: PropTypes.string,
  diff: PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string,
    description: PropTypes.string,
    notes: PropTypes.string,
    claimId: PropTypes.string,
    chargeId: PropTypes.string,
    batchExceptionId: PropTypes.string,
    fieldName: PropTypes.string
  })
};

export default connect(select)(
  withComparisonsMetadata(diffCategorizable(withStyles(styles)(Level)))
);
