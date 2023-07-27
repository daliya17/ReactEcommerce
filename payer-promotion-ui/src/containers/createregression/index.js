import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Typography,
  withStyles
} from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as ActionCreators from '../../actions/createregression';
import CustomTextField from '../../components/custom-text-field';
import MultiSelect from '../../components/multiselect';
import Vendors from '../../constants/vendors.json';
import RegressionTypes from '../../constants/RegressionTypes.json';
import RegressionReasons from '../../constants/RegressionReasons.json';
import Path from '../../lib/path';
import Selector from '../../lib/selectors';
import SelectPayerPaymentBatches from './SelectPayerPaymentBatches';
import CSVReader from 'react-csv-reader';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...Selector.createRegression(state)
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      startRegression: ActionCreators.startRegression,
      handleValueChange: ActionCreators.handleValueChange,
      handlePayerMultiSelect: ActionCreators.handlePayerMultiSelect,
      handlePayerMultiClear: ActionCreators.handlePayerMultiClear,
      handlePayerToggle: ActionCreators.handlePayerToggle,
      handlePayerHighlight: ActionCreators.handlePayerHighlight,
      handleSave: ActionCreators.handleSave
    },
    dispatch
  );
}

const styles = {
  margin: {
    margin: '15px'
  },
  button: {
    margin: '10px 15px'
  },
  grid: {
    minWidth: '700px'
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  multiSelect: {
    minWidth: '300px',
    margin: '0px 15px 15px 15px',
    height: '420px'
  },
  checkbox: {
    margin: '10px 5px'
  },
  dropDown: {
    display: 'block',
    margin: '10px 15px',
    width: '240px'
  }
};

class CreateRegression extends React.Component {
  handleRegressionNameChange = event => {
    this.props.handleValueChange('name', event.target.value);
  };

  handleVendorChange = event => {
    this.props.handleValueChange('vendor', event.target.value);
  };

  handleVendorRoutingToggle = () => {
    this.props.handleValueChange('routeToVendor', !this.props.routeToVendor);
  };

  handleRegressionTypeChange = event => {
    this.props.handleValueChange('type', event.target.value);
    if (event.target.value === 'RANDOM')
      this.props.handleValueChange('routeToVendor', true);
    else {
      this.props.handleValueChange('routeToVendor', false);
      this.props.handleValueChange('reasonCode', 'TESTING');
    }
  };

  handleReasonChange = event => {
    this.props.handleValueChange('reasonCode', event.target.value);
  };

  handleBatchCountChange = event => {
    this.props.handleValueChange('batchCount', event.target.value);
  };

  handleBatchUploadChange = data => {
    // Remove empty row from CSV data. 
    let validRows = data.reduce((arr, current) => {
    return (Object.values(current).some(value =>(value && value.trim())))?arr.concat(current):arr;
    }, []);
     
    this.props.handleValueChange('batchUpload', validRows);
  };

  render() {
    const {
      classes,
      name: regressionName,
      type: regressionType,
      reasonCode,
      routeToVendor,
      vendor,
      selectedPayerIndex,
      payerOptions,
      payerSelections,
      batchCount
    } = this.props;

    return (
      <div className="scrollable">
        <Typography className="headline" variant="headline">
          {'New Regression'}
        </Typography>
        <CustomTextField
          className={classes.margin}
          label={'Regression Name'}
          inputProps={{
            size: 40
          }}
          required
          autoFocus
          value={regressionName}
          onBlur={this.handleRegressionNameChange}
        />
        <Typography variant="subheading" className={classes.margin}>
          {'Regression Type'}
        </Typography>
        <Select
          className={classes.dropDown}
          value={regressionType}
          onChange={this.handleRegressionTypeChange}
        >
          {RegressionTypes.map(regressionType => (
            <MenuItem key={regressionType.id} value={regressionType.id}>
              {regressionType.name}
            </MenuItem>
          ))}
        </Select>
        {regressionType === 'RANDOM' && (
          <React.Fragment>
            <Typography variant="subheading" className={classes.margin}>
              {'Choose File'}
            </Typography>
            <CSVReader
              inputStyle={{ margin: '15px' }}
              onFileLoaded={this.handleBatchUploadChange}
              parserOptions={{
                header: true
              }}
            />
            <Typography variant="subheading" className={classes.margin}>
              {'Batch Count'}
            </Typography>
            <CustomTextField
              className={classes.margin}
              label={'No. of Batches'}
              inputProps={{
                size: 15
              }}
              required
              value={batchCount}
              onBlur={this.handleBatchCountChange}
            />
          </React.Fragment>
        )}
        {regressionType === 'SAMPLE' && (
          <React.Fragment>
            <Grid container spacing={24} className={classes.grid}>
              <Grid item sm={6} className={classes.gridItem}>
                <Typography variant="subheading" className={classes.margin}>
                  {'Select Payers'}
                </Typography>
                <MultiSelect
                  canToggleMultiple
                  highlightable
                  className={classes.multiSelect}
                  options={payerOptions}
                  selectedValues={payerSelections}
                  onMultiSelect={this.props.handlePayerMultiSelect}
                  onMultiClear={this.props.handlePayerMultiClear}
                  onToggle={this.props.handlePayerToggle}
                  onHighlight={this.props.handlePayerHighlight}
                  highlightedIndex={selectedPayerIndex}
                />
              </Grid>
              <Grid item sm={6} className={classes.gridItem}>
                <SelectPayerPaymentBatches
                  classes={{
                    heading: classes.margin,
                    multiSelect: classes.multiSelect
                  }}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        )}
        <Typography variant="selectreason" className={classes.margin}>
          {'Reason'}
        </Typography>
        <Select
          value={reasonCode}
          onChange={this.handleReasonChange}
          inputProps={{
            id: 'reason-selection'
          }}
          className={classes.dropDown}
        >
          {RegressionReasons.map(reasonCode => (
            <MenuItem key={reasonCode.id} value={reasonCode.id}>
              {reasonCode.name}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="subheading" className={classes.margin}>
          {'Select Vendor'}
        </Typography>
        <Select
          value={vendor}
          onChange={this.handleVendorChange}
          inputProps={{
            id: 'vendor-selection'
          }}
          className={classes.dropDown}
        >
          {Vendors.map(vendor => (
            <MenuItem key={vendor.id} value={vendor.id}>
              {vendor.name}
            </MenuItem>
          ))}
        </Select>
        <FormControlLabel
          className={classes.checkbox}
          control={
            <Checkbox
              checked={routeToVendor}
              onChange={this.handleVendorRoutingToggle}
              value=""
            />
          }
          label="Route the payment batches to vendor"
        />
        <div className={classes.margin}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={this.props.handleSave}
          >
            {'Start'}
          </Button>
          <Link to={Path.RegressionsRoute} className="link">
            <Button>{'Cancel'}</Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateRegression));
