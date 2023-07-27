import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  withStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@material-ui/core';
import classNames from 'classnames';
import CustomTextField from '../../components/custom-text-field';
import Lib from '../../lib/PayersLibrary';
import Popup from '../../lib/popup';
import * as ActionCreators from '../../actions/payers';

const styles = {
  addPayers: {
    margin: '10px',
    left: '10px',
    right: '10px'
  },
  paper: {
    minWidth: '800px'
  },
  numericCell: {
    minWidth: '100px',
    padding: '20px 20px 0px 0px',
    border: 'none',
    verticalAlign: 'bottom'
  },
  textCell: {
    minWidth: '220px',
    padding: '20px 20px 0px 0px',
    border: 'none',
    verticalAlign: 'bottom'
  }
};

/**
 * bind store and parent props to the component
 * @param {object} state - store object
 * @param {object} props - props passed from the parent component
 */
function mapStateToProps(state, props) {
  return {
    ...state,
    ...props
  };
}

/**
 * bind the actions to the component
 * @param {*function} dispatch
 */
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addPayers: ActionCreators.addPayers
    },
    dispatch
  );
}

class AddPayers extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      payers: []
    };
  }

  handleAddClick = () => {
    this.setState({
      open: true
    });
  };

  handleValueChange = index => event => {
    let id = event.target.id;
    let value = event.target.value;
    this.setState(prevState => {
      return {
        payers: [
          ...prevState.payers.slice(0, index),
          {
            ...prevState.payers[index],
            [id]: value
          },
          ...prevState.payers.slice(index + 1)
        ]
      };
    });
  };

  handleCancel = () => {
    this.setState({
      open: false,
      payers: []
    });
  };

  handleAddPayer = () => {
    let payers = this.state.payers;

    let payerResult = Lib.parsePayerList(payers);

    if (payerResult.payerList.length === 0) {
      Popup.alert('Nothing found to be added.');
      return;
    }

    if (payerResult.invalidText) {
      Popup.alert(
        'Invalid Input found: ' + payerResult.invalidText + ' is not found.'
      );
      return;
    }

    this.props.addPayers(payerResult.payerList);
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="secondary"
          className={classNames(classes.addPayers)}
          onClick={this.handleAddClick}
        >
          {'Add Payers'}
        </Button>
        <Dialog
          open={this.state.open}
          aria-labelledby="add-payers-dialog"
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="add-payers-dialog">Add Payers</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Provide the details of the payer that has to be added
            </DialogContentText>
            <Table>
              <TableBody>
                {this.state.payers.map(this.renderPayerInput)}
                {this.state.payers.length < 20 &&
                  this.renderPayerInput({}, this.state.payers.length)}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAddPayer} color="primary">
              Add
            </Button>
            <Button onClick={this.handleCancel} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  renderPayerInput = (payer, index) => {
    const { classes } = this.props;

    return (
      <TableRow key={index}>
        <TableCell className={classes.numericCell}>
          <CustomTextField
            required
            fullWidth
            id="ircId"
            label="Payer ID"
            type="number"
            value={payer.ircId}
            onBlur={this.handleValueChange(index)}
          />
        </TableCell>
        <TableCell className={classes.textCell}>
          <CustomTextField
            required
            fullWidth
            id="ircName"
            label="Payer Name"
            type="text"
            value={payer.ircName}
            onBlur={this.handleValueChange(index)}
          />
        </TableCell>
        <TableCell className={classes.numericCell}>
          <CustomTextField
            required
            fullWidth
            id="krcId"
            label="KRC ID"
            type="number"
            value={payer.krcId}
            onBlur={this.handleValueChange(index)}
          />
        </TableCell>
        <TableCell className={classes.textCell}>
          <CustomTextField
            required
            fullWidth
            id="krcName"
            label="KRC Name"
            type="text"
            value={payer.krcName}
            onBlur={this.handleValueChange(index)}
          />
        </TableCell>
      </TableRow>
    );
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AddPayers));
