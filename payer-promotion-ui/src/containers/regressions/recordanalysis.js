import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ActionCreators from '../../actions/regressionpayerbatches';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Select,
  MenuItem,
  withStyles,
  DialogActions,
  Button
} from '@material-ui/core';
import Analysis from '../../constants/Analysis.json';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {};
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      recordRegressionPayerBatchAnalysis:
        ActionCreators.recordRegressionPayerBatchAnalysis
    },
    dispatch
  );
}

const styles = {
  dropDown: {
    display: 'block',
    margin: '10px 15px',
    width: '400px'
  }
};

class RecordAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  handleValueChange = event => {
    this.setState({
      value: event.target.value
    });
  };

  handleAnalysis = () => {
    if (this.state.value === null || this.state.value === '') {
      alert('Choose a valid analysis');
      return;
    }
    this.props.recordRegressionPayerBatchAnalysis(
      this.props.regressionDataIds,
      this.state.value
    );
    this.props.onClose();
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Dialog open={this.props.open} aria-labelledby="record-analysis-dialog">
          <DialogTitle id="record-analysis-dialog">Analysis</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose the analysis output for the selected batche(s)
            </DialogContentText>
            <Select
              className={classes.dropDown}
              value={this.state.value}
              onChange={this.handleValueChange}
            >
              {Analysis.map(analyse => (
                <MenuItem key={analyse.id} value={analyse.id}>
                  {analyse.name}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleAnalysis}>
              Save
            </Button>
            <Button color="secondary" onClick={this.props.onClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

RecordAnalysis.propTypes = {
  open: PropTypes.bool,
  regressionDataIds: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  recordRegressionPayerBatchAnalysis: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(RecordAnalysis));
