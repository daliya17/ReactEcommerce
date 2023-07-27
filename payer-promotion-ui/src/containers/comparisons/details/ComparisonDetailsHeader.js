import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import * as Colors from '../colors';

const styles = {
  summaryHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 56px 6px 24px'
  },
  spacer: {
    flex: '1 1 0%'
  },
  ...Colors.textColors
};

class ComparisonDetailsHeader extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.summaryHeader}>
        <div className={classes.spacer} />
        <Typography variant="caption" className="panel-summary">
          {'fields : '}
        </Typography>
        <Typography variant="caption" className="panel-summary">
          {'total'}
        </Typography>
        <Typography variant="caption" className="panel-summary">
          {'matched'}
        </Typography>
        <Typography
          variant="caption"
          className={'panel-summary ' + classes.addedTxt}
        >
          {'added'}
        </Typography>
        <Typography
          variant="caption"
          className={'panel-summary ' + classes.differentTxt}
        >
          {'different'}
        </Typography>
        <Typography
          variant="caption"
          className={'panel-summary ' + classes.removedTxt}
        >
          {'removed'}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(ComparisonDetailsHeader);
