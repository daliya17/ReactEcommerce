import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormLabel,
  withStyles
} from '@material-ui/core';
import CustomTextField from '../../components/custom-text-field';
import FieldStatuses from '../../constants/FieldStatuses';
import Popup from '../../lib/popup';
import { saveDiffCategory } from '../../actions/diffs/categories';

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
      saveDiffCategory
    },
    dispatch
  );
}

const styles = {
  content: {
    minWidth: '400px'
  },
  topMargin: {
    marginTop: '30px'
  },
  littleTopMargin: {
    marginTop: '15px'
  },
  select: {
    width: '200px'
  }
};

class AddEditDiffCategory extends React.Component {
  constructor(props) {
    super(props);

    this.statusOptions = this.getStatusOptions();
    this.state = this.getDiffCategory();
  }

  getDiffCategory() {
    const { diffCategory } = this.props;

    if (diffCategory) {
      return {
        name: diffCategory.name,
        status: diffCategory.status || undefined,
        description: diffCategory.description
      };
    }

    return {
      name: '',
      status: undefined,
      description: ''
    };
  }

  getStatusOptions = () => {
    const options = [
      {
        label: 'Preserve Status',
        value: ' '
      }
    ];

    Object.keys(FieldStatuses).forEach(label => {
      if (label === 'Blank') return;

      options.push({
        label,
        value: FieldStatuses[label]
      });
    });

    return options;
  };

  valueChangeHandler = key => event => {
    this.setState({
      [key]: (event.target.value || '').trim()
    });
  };

  handleSave = () => {
    if (!this.state.name) {
      Popup.alert('Name is required');
      return;
    }

    this.props.saveDiffCategory(
      {
        ...this.state,
        status: this.state.status || undefined,
        id: (this.props.diffCategory || {}).id
      },
      () => {
        Popup.alert('Diff category saved successfully');
        this.props.onClose();
      }
    );
  };

  render() {
    const { classes, onClose, diffCategory = {} } = this.props;
    const { id } = diffCategory;
    const { name, status = ' ', description } = this.state;

    return (
      <Dialog open aria-labelledby="add-edit-diff-category">
        <DialogTitle id="add-edit-diff-category">
          {(id ? 'Update' : 'Add') + ' Diff Category'}
        </DialogTitle>
        <DialogContent className={classes.content}>
          <div>
            <CustomTextField
              label="Name"
              value={name}
              fullWidth
              inputProps={{
                maxLength: 100
              }}
              onBlur={this.valueChangeHandler('name')}
            />
          </div>
          <div className={classes.topMargin}>
            <FormLabel component="legend">Assign Status</FormLabel>
            <Select
              className={classes.select}
              value={status}
              onChange={this.valueChangeHandler('status')}
            >
              {this.statusOptions.map(option => (
                <MenuItem value={option.value} key={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.littleTopMargin}>
            <CustomTextField
              label="Description"
              fullWidth
              multiline
              inputProps={{
                maxLength: 4000
              }}
              value={description}
              onBlur={this.valueChangeHandler('description')}
            />
          </div>
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

AddEditDiffCategory.propTypes = {
  classes: PropTypes.object.isRequired,
  diffCategory: PropTypes.object,
  saveDiffCategory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddEditDiffCategory));
