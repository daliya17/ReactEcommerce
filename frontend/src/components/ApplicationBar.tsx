import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { withStyles } from '@material-ui/core';
import '../style/css/ApplicationBar.css'

const styles = {
  toolbar: {
    minHeight: '56px',
  },
  title: {
    marginRight: '20px',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  },
  button: {
    marginLeft: '20px',
    color: 'grey',
    fontWeight: 650
  },
};

function ApplicationBar(props: any): JSX.Element {

  const { classes } = props;

  return (
    <AppBar position="relative" color="primary" id='app__bar'>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" color="inherit" className={classes.title} id='app__title'>
          {'RT Regression Tool'}
        </Typography>
        <Link to={'/regressions'} className={classes.link} id='app__bar__items'>
          <Button variant="text"
            color="inherit" className={classes.button}>{'REGRESSIONS'}</Button>
        </Link>
      </Toolbar>
    </AppBar>
  );

}

ApplicationBar.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ApplicationBar);
