import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  notfound: {
    marginBottom: '15px'
  },
  marginTop: {
    marginTop: '10px'
  },
  link: {
    marginTop: '10px',
    color: '#2078c7'
  }
};

class NotFound extends React.Component {
  static defaultProps = {
    redirectPath: '/'
  };

  static propTypes = {
    redirectPath: PropTypes.string.isRequired
  };

  render() {
    const { redirectPath, classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography
          variant="display3"
          color="secondary"
          className={classes.notfound}
        >
          Page Not Found
        </Typography>
        <Typography variant="title" className={classes.marginTop}>
          Aha! You see! You can be wrong!
        </Typography>
        <Typography variant="caption">(or it could be us)...</Typography>

        <Typography variant="title" className={classes.marginTop}>
          ...either way, you should probably
        </Typography>
        <Link to={redirectPath} className={classes.link}>
          <Typography variant="title" color="inherit">
            go back to the homepage
          </Typography>
        </Link>
      </div>
    );
  }
}

export default withStyles(styles)(NotFound);
