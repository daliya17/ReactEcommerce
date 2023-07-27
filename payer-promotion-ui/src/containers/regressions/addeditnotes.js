import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as ActionCreators from '../../actions/regressionpayerbatches';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  DialogActions
} from '@material-ui/core';

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
      addRegressionPayerBatchNotes: ActionCreators.addRegressionPayerBatchNotes
    },
    dispatch
  );
}

class AddEditNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.editMode ? this.props.currentNotesText : ''
    };
  }

  handleValueChange = event => {
    this.setState({
      value: event.target.value
    });
  };

  handleSave = () => {
    if (this.state.value === null || this.state.value === '') {
      alert('Enter valid notes');
      return;
    }
    this.props.addRegressionPayerBatchNotes(
      this.props.regressionDataIds,
      this.state.value
    );
    this.props.onClose();
  };

  handleFocus = event => {
    const currentValue = event.target.value;
    event.target.value='';
    event.target.value = currentValue;
  }

  render() {
    return (
      <React.Fragment>
        <Dialog open={this.props.open} aria-labelledby="add-edit-notes-dialog">
          <DialogTitle id="add-edit-notes-dialog"> {this.props.editMode ? "Edit Notes" : "Add Notes"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.props.editMode? 'Edit Notes for the selected payment batch' : 'Add Notes for the selected payment batche(s)'}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={this.props.editMode ? "Edit Notes" : "Add Notes"}
              multiline={true}
              type="text"
              value={this.state.value}
              onChange={this.handleValueChange}
              onFocus={this.handleFocus}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleSave}>
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

AddEditNotes.propTypes = {
  open: PropTypes.bool,
  editMode: PropTypes.bool.isRequired,
  currentNotesText: PropTypes.string,
  regressionDataIds: PropTypes.array.isRequired,
  addRegressionPayerBatchNotes: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditNotes);
