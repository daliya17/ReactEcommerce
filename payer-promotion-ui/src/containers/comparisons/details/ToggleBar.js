import {
  FormControlLabel,
  Switch,
  withStyles,
  Tooltip,
  IconButton,
  Badge
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleKey } from '../../../actions/comparisons';
import * as Colors from '../colors';
import classNames from 'classnames';
import FreezeFieldsIcon from '@material-ui/icons/CalendarViewDay';
import FreezeFields from './FreezedFields';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...state.views.comparisons,
    data: null
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      toggleKey
    },
    dispatch
  );
}

const styles = {
  root: {
    padding: '0px 15px',
    display: 'flex'
  },
  spacer: {
    flex: '1 1 0%'
  },
  ...Colors.toggleBars
};

class ToggleBar extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  state = {
    freezeFieldsPopupOpen: false
  };

  handleSwitchChange = key => {
    const currentValue = this.props[key];
    this.props.toggleKey(key, !currentValue);
  };

  handlePopupOpen = () => {
    this.setState({
      freezeFieldsPopupOpen: true
    });
  };

  handlePopupClose = () => {
    this.setState({
      freezeFieldsPopupOpen: false
    });
  };

  render() {
    const {
      showMatched,
      showAdded,
      showDifferent,
      showRemoved,
      showIgnored,
      showBlanks,
      showPercentage,
      isExpanded,
      freezedFields,
      classes
    } = this.props;
    return (
      <div className={classNames(classes.root, 'sticky-top')}>
        <FormControlLabel
          control={
            <Switch
              checked={showMatched}
              onChange={() => this.handleSwitchChange('showMatched')}
              classes={{
                switchBase: classes.matchedSwitchBase,
                checked: classes.matchedColorChecked,
                bar: classes.matchedColorBar
              }}
            />
          }
          label="Matched"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showAdded}
              onChange={() => this.handleSwitchChange('showAdded')}
              classes={{
                switchBase: classes.addedSwitchBase,
                checked: classes.addedColorChecked,
                bar: classes.addedColorBar
              }}
            />
          }
          label="Added"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showDifferent}
              onChange={() => this.handleSwitchChange('showDifferent')}
              classes={{
                switchBase: classes.diffSwitchBase,
                checked: classes.diffColorChecked,
                bar: classes.diffColorBar
              }}
            />
          }
          label="Different"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showRemoved}
              onChange={() => this.handleSwitchChange('showRemoved')}
              classes={{
                switchBase: classes.removedSwitchBase,
                checked: classes.removedColorChecked,
                bar: classes.removedColorBar
              }}
            />
          }
          label="Removed"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showIgnored}
              onChange={() => this.handleSwitchChange('showIgnored')}
              classes={{
                switchBase: classes.ignoredSwitchBase,
                checked: classes.ignoredColorChecked,
                bar: classes.ignoredColorBar
              }}
            />
          }
          label="Ignored"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showBlanks}
              onChange={() => this.handleSwitchChange('showBlanks')}
              classes={{
                switchBase: classes.ignoredSwitchBase,
                checked: classes.ignoredColorChecked,
                bar: classes.ignoredColorBar
              }}
            />
          }
          label="Blanks"
        />
        <Tooltip title="Freeze fields">
          <IconButton aria-label="Freeze fields" onClick={this.handlePopupOpen}>
            <Badge
              badgeContent={Object.keys(freezedFields).length}
              color="secondary"
            >
              <FreezeFieldsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        {this.state.freezeFieldsPopupOpen && (
          <FreezeFields onClose={this.handlePopupClose} />
        )}
        <div className={classes.spacer} />
        <FormControlLabel
          control={
            <Switch
              checked={showPercentage}
              onChange={() => this.handleSwitchChange('showPercentage')}
            />
          }
          label="Percentage"
        />
        <FormControlLabel
          control={
            <Switch
              checked={isExpanded}
              onChange={() => this.handleSwitchChange('isExpanded')}
            />
          }
          label="Expand All"
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ToggleBar));
