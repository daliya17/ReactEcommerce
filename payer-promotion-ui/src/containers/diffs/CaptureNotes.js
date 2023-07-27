import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  textbox: {
    minWidth: '400px',
    marginTop: '30px',
    flexDirection: 'row'
  }
};

/**
 * This component is used to capture notes during diff categorization
 */
class CaptureNotes extends React.Component {
  state = {
    notes: ''
  };

  handleSave = () => {
    if (this.props.onSave) {
      this.props.onSave(this.state.notes);
    }
  };

  handleChange = event => {
    this.setState({
      notes: event.target.value
    });
  };

  render() {
    const { classes, open, onClose, type } = this.props;
    const { notes } = this.state;

    return (
      <Dialog
        open={open}
        aria-labelledby="add-categorization-notes"
        onClose={onClose}
      >
        <DialogTitle id="add-categorization-notes">{'Add Notes'}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {'Diff Category : '}
            <b>{type}</b>
          </Typography>
          <TextField
            className={classes.textbox}
            autoFocus
            label="Notes"
            placeholder="Enter you notes"
            fullWidth
            multiline
            variant="outlined"
            value={notes}
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={this.handleSave}
          >
            {'Save'}
          </Button>
          <Button onClick={onClose}>{'Close'}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

CaptureNotes.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default withStyles(styles)(CaptureNotes);
