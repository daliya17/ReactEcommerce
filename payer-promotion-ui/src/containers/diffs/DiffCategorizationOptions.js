import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  withStyles,
  Typography
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import AutoSuggest from 'react-select';
import { bindActionCreators } from 'redux';
import { handleCategorization } from '../../actions/diffs/categorization';
import CustomTextField from '../../components/custom-text-field';
import DiffCategoriesLibrary from '../../lib/DiffCategoriesLibrary';
import PayersLibrary from '../../lib/PayersLibrary';
import { withComparisonsMetadata } from '../comparisons/ComparisonContext';
import Popup from '../../lib/popup';

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
      handleCategorization
    },
    dispatch
  );
}

const ruleLevels = [
  {
    label: 'Global',
    id: 'isGlobal',
    includedLevels: []
  },
  {
    label: 'Payer',
    valueLabel: 'Payer',
    id: 'payerId',
    includedLevels: ['payerId']
  },
  {
    label: 'Batch',
    valueLabel: 'Batch',
    id: 'paymentBatchIdentifier',
    includedLevels: ['payerId', 'paymentBatchIdentifier']
  },
  {
    label: 'Claim',
    valueLabel: 'Claim',
    id: 'claimId',
    includedLevels: ['payerId', 'paymentBatchIdentifier', 'claimId']
  },
  {
    label: 'Charge',
    valueLabel: 'Charge',
    id: 'chargeId',
    includedLevels: ['payerId', 'paymentBatchIdentifier', 'claimId', 'chargeId']
  },
  {
    label: 'Batch Exception',
    valueLabel: 'Batch Exception',
    id: 'batchExceptionId',
    includedLevels: ['payerId', 'paymentBatchIdentifier', 'batchExceptionId']
  }
];

const styles = {
  marginTop: {
    marginTop: '25px'
  },
  littleMarginTop: {
    marginTop: '10px'
  },
  raidoGroup: {
    marginTop: '10px',
    flexDirection: 'row'
  }
};

/**
 * When a user right clicks a diff and choose a category or clear option,
 * then this options will be shown.
 * Note: diffCategoryId will be undefined for clear action
 * For clear action, global and payer options are not shown
 */
class DiffCategorizationOptions extends React.Component {
  constructor(props) {
    super(props);

    this.supportsBulkCategorization = !props.isLevel;
    this.ruleLevels = this.getApplicableRuleLevels();
    this.state = {
      diffCategoryId: props.diffCategoryId,
      ruleLevel: this.ruleLevels.length - 1,
      notes: '',
      fieldName: props.fieldName,
      payerId: props.payerId,
      paymentBatchIdentifier: props.paymentBatchIdentifier,
      claimId: props.claimId,
      chargeId: props.chargeId,
      batchExceptionId: props.batchExceptionId
    };
  }

  getApplicableRuleLevels() {
    return ruleLevels.filter((level, index) => {
      // filter the rule level that apply for this field
      // eg: a batch exception field, doesn't need a claim or charge level
      // if diffCategoryId exist in props, then the action is applying categorization
      // else it is clearing the categorization
      return (
        (this.props.diffCategoryId || index > 1) &&
        (index === 0 || this.props[level.id])
      );
    });
  }

  isGlobal = () => {
    const selectedLevel = this.ruleLevels[this.state.ruleLevel] || {};
    return this.props.diffCategoryId && selectedLevel.id === 'isGlobal';
  };

  handleValueChange = event => {
    const key = event.target.name;
    const value = event.target.value;
    this.setState({
      [key]: value
    });
  };

  handleSave = () => {
    const isBulkCategorization =
      this.state.ruleLevel < this.ruleLevels.length - 1;

    const {
      regressionId,
      id: diffId,
      payerId,
      paymentBatchIdentifier
    } = this.props;
    const categorizationInfo = {
      regressionId,
      diffId,
      diffCategoryId: this.state.diffCategoryId,
      notes: this.state.notes || undefined,
      fieldName: this.state.fieldName
    };

    const batchComparisonInfo = {
      regressionId,
      payerId,
      paymentBatchIdentifier
    };

    const selectedLevel = this.ruleLevels[this.state.ruleLevel];
    if (this.isGlobal()) {
      categorizationInfo.isGlobal = true;
    } else {
      if (!this.state[selectedLevel.id]) {
        Popup.alert(selectedLevel.label + ' is required.');
        return;
      }

      (selectedLevel.includedLevels || []).forEach(
        levelId => (categorizationInfo[levelId] = this.state[levelId])
      );
    }

    this.props.handleCategorization(
      categorizationInfo,
      isBulkCategorization,
      batchComparisonInfo,
      this.props.onClose
    );
  };

  renderRuleLevelValueInput(ruleLevel) {
    if (ruleLevel.id === 'payerId') {
      return (
        <React.Fragment>
          <Typography variant="caption">{'Payer'}</Typography>
          <AutoSuggest
            options={PayersLibrary.getPayerOptions()}
            placeholder="Search Payer"
            value={this.state.payerId}
            onChange={(option = {}) =>
              this.handleValueChange({
                target: { name: ruleLevel.id, value: option.value }
              })
            }
          />
        </React.Fragment>
      );
    }

    return (
      <CustomTextField
        name={ruleLevel.id}
        label={ruleLevel.valueLabel}
        value={this.state[ruleLevel.id]}
        onBlur={this.handleValueChange}
      />
    );
  }

  render() {
    const { classes, fieldName, onClose } = this.props;
    const { diffCategoryId, ruleLevel, notes } = this.state;

    const title = diffCategoryId
      ? 'Apply Diff Categorization'
      : 'Clear Diff Categorization';
    const isClearAction = !diffCategoryId;
    const action = isClearAction
      ? 'Clear'
      : ruleLevel < 2
        ? 'Save & Apply'
        : 'Apply';

    return (
      <Dialog
        open
        aria-labelledby="diff-categorization-options"
        onClose={onClose}
      >
        <DialogTitle id="diff-categorization-options">{title}</DialogTitle>
        <DialogContent>
          {this.supportsBulkCategorization && (
            <React.Fragment>
              <FormControl component="fieldset">
                <FormLabel component="legend">{'Level'}</FormLabel>
                <RadioGroup
                  className={classes.raidoGroup}
                  name="ruleLevel"
                  value={ruleLevel.toString()}
                  onChange={this.handleValueChange}
                >
                  {this.ruleLevels.map((level, index) => (
                    <FormControlLabel
                      key={index}
                      value={index.toString()}
                      control={<Radio color="secondary" />}
                      label={level.label}
                      labelPlacement="end"
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              {!this.isGlobal() && (
                <div className={classes.littleMarginTop}>
                  {this.renderRuleLevelValueInput(this.ruleLevels[ruleLevel])}
                </div>
              )}
              <CustomTextField
                className={classes.marginTop}
                label="Field Name"
                value={fieldName}
                disabled
                fullWidth
              />
            </React.Fragment>
          )}
          {diffCategoryId && (
            <FormControl component="div" className={classes.marginTop}>
              <InputLabel htmlFor="diff-category-id">
                {'Diff Category'}
              </InputLabel>
              <Select
                value={diffCategoryId}
                className={classes.littleMarginTop}
                onChange={this.handleValueChange}
                inputProps={{
                  name: 'diffCategoryId',
                  id: 'diff-category-id'
                }}
              >
                {DiffCategoriesLibrary.getDiffCategories().map(diffCategory => (
                  <MenuItem key={diffCategory.id} value={diffCategory.id}>
                    {diffCategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {!isClearAction && (
            <div className={classes.marginTop}>
              <CustomTextField
                label="Notes"
                name="notes"
                multiline
                fullWidth
                autoFocus
                value={notes}
                onBlur={this.handleValueChange}
                inputProps={{
                  maxLength: 4000
                }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={this.handleSave}
          >
            {action}
          </Button>
          <Button onClick={onClose}>{'Close'}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DiffCategorizationOptions.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  diffCategoryId: PropTypes.number,
  fieldName: PropTypes.string.isRequired,
  regressionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  payerId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  paymentBatchIdentifier: PropTypes.string.isRequired,
  claimId: PropTypes.string,
  chargeId: PropTypes.string,
  batchExceptionId: PropTypes.string,
  handleCategorization: PropTypes.func.isRequired,
  isLevel: PropTypes.bool
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withComparisonsMetadata(DiffCategorizationOptions)));
