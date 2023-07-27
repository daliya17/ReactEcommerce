import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  withStyles,
  Popper,
  Paper,
  ClickAwayListener
} from '@material-ui/core';
import lib from '../../../../lib';

const styles = {
  link: {
    textDecoration: 'underline',
    color: 'blue',
    cursor: 'pointer',
    padding: '9px 16px',
    fontSize: '12px'
  },
  paper: {
    padding: '20px'
  },
  title: {
    marginBottom: '20px'
  },
  popper: {
    zIndex: 350
  }
};

class Evaluations extends React.Component {
  static defaultProps = {
    fieldId: ''
  };

  state = {
    anchorEl: null
  };

  handleOpen = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { fieldId, evals, classes } = this.props;
    const rules = evals.map(e => lib.fieldDisplayName(e.id)).join(', ');
    const { anchorEl } = this.state;

    return (
      evals.length > 0 && (
        <React.Fragment>
          <Typography
            variant="inherit"
            className={classes.link}
            onClick={this.handleOpen}
          >
            {rules}
          </Typography>
          <div className={'screen ' + (anchorEl ? 'open' : '')} />
          <Popper
            id={fieldId + '_menu'}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
            className={classes.popper}
          >
            <ClickAwayListener onClickAway={this.handleClose}>
              <Paper className={classes.paper}>
                <Typography variant="subheading" className={classes.title}>
                  {'Evaluations for the field: ' + fieldId}
                </Typography>
                <Table className="evaluation-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>{'Rule'}</TableCell>
                      <TableCell>{'Type'}</TableCell>
                      <TableCell>{'Action'}</TableCell>
                      <TableCell>{'Is Valid'}</TableCell>
                      <TableCell>{'Old Value'}</TableCell>
                      <TableCell>{'New Value'}</TableCell>
                      <TableCell>{'Athena Value'}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {evals.map(e => {
                      return (
                        <TableRow key={'rule' + e.id}>
                          <TableCell>{e.id}</TableCell>
                          <TableCell>{e.type}</TableCell>
                          <TableCell>
                            {e.act === 'null' ? '-' : e.act}
                          </TableCell>
                          <TableCell>{e.valid + ''}</TableCell>
                          <TableCell>{e.ov || ''}</TableCell>
                          <TableCell>
                            {e.id !== 'SOURCE_VALIDATION' ? e.nv || '' : '-'}
                          </TableCell>
                          <TableCell>
                            {e.id === 'SOURCE_VALIDATION' ? e.nv || '' : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </React.Fragment>
      )
    );
  }
}

Evaluations.propTypes = {
  fieldId: PropTypes.string.isRequired,
  evals: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      ov: PropTypes.string,
      nv: PropTypes.string,
      type: PropTypes.string,
      act: PropTypes.string,
      valid: PropTypes.bool
    })
  )
};

export default withStyles(styles)(Evaluations);
