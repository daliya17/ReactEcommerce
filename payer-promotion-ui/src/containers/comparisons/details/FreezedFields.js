import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  handleFieldsMultiClear,
  handleFieldsMultiSelect,
  handleFieldToggle
} from '../../../actions/comparisons';
import MultiSelect from '../../../components/multiselect';
import FieldsLibrary from '../../../lib/FieldsLibrary';

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  const comparisonsView = state.views.comparisons;

  return {
    freezedFields: comparisonsView.freezedFields
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      handleFieldToggle,
      handleFieldsMultiSelect,
      handleFieldsMultiClear
    },
    dispatch
  );
}

const styles = {
  multiSelect: {
    marginTop: '20px'
  }
};

const FreezeFields = props => {
  const fields = FieldsLibrary.getFieldOptions();
  const { classes, freezedFields } = props;

  return (
    <Dialog open aria-labelledby="freeze-fields-dialog" onClose={props.onClose}>
      <DialogTitle id="freeze-fields-dialog">Freeze fields</DialogTitle>
      <DialogContent>
        <Typography>
          Irrespective of the status chosen to display, the following fields
          will always be visible
        </Typography>
        <MultiSelect
          className={classes.multiSelect}
          canToggleMultiple
          options={fields}
          selectedValues={freezedFields}
          onMultiSelect={props.handleFieldsMultiSelect}
          onMultiClear={props.handleFieldsMultiClear}
          onToggle={props.handleFieldToggle}
        />
      </DialogContent>
    </Dialog>
  );
};

FreezeFields.propTypes = {
  freezedFields: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(FreezeFields));
