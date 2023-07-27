import React from 'react';
import {
  CircularProgress,
  DialogContent,
  DialogContentText,
  withStyles
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

const styles = {
  popupContent: {
    textAlign: 'center'
  },
  loadingMessage: {
    margin: '10px 30px'
  }
};

class Loader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      isLoading: false
    };
  }

  componentDidMount() {
    window.addEventListener('show-loading', this.displayLoading);
    window.addEventListener('hide-loading', this.hideLoading);
  }

  componentWillUnmount() {
    window.removeEventListener('show-loading', this.displayLoading);
    window.removeEventListener('hide-loading', this.hideLoading);
  }

  /**
   * Display the loading indicator
   * @param {object} event
   */
  displayLoading = event => {
    const message = (event.detail || {}).message || '';

    this.setState({
      isLoading: true,
      message
    });
  };

  hideLoading = () => {
    this.setState({
      isLoading: false,
      message: ''
    });
  };

  render() {
    const { classes } = this.props;
    const { isLoading, message } = this.state;

    return (
      <Dialog open={isLoading} aria-labelledby="alert-dialog-title">
        <DialogContent
          id="alert-dialog-description"
          className={classes.popupContent}
        >
          <CircularProgress color="secondary" size={50} />
          <DialogContentText className={classes.loadingMessage}>
            {message.split('\n').map(text => (
              <span key={text} className="newline">
                {text}
              </span>
            ))}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(Loader);
