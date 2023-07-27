import React from 'react';

import Logger from '../lib/logger';
import Path from '../lib/path';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidMount() {
    this.catchWindowErrors();
  }

  catchWindowErrors() {
    window.onerror = (message, file, line, column, errorObject) => {
      column = column || (window.event && window.event.errorCharacter);

      //trying to get stack from IE
      if (!errorObject || !errorObject.stack) {
        let stack = [];
        try {
          // eslint-disable-next-line no-caller
          var f = arguments.callee.caller;
          while (f) {
            stack.push(f.name);
            f = f.caller;
          }
          errorObject['stack'] = stack;
        } catch (e) {
          // do nothing
        }
      }

      let stack = errorObject ? errorObject.stack : null;

      let errMsg = JSON.stringify({
        message: message,
        file: file,
        line: line,
        column: column,
        errorStack: stack
      });

      Logger.log(errMsg);

      //the error can still be triggered as usual, we just wanted to know what's happening on the client side
      return false;
    };
  }

  componentDidCatch(error, info) {
    // to display the fallback error UI
    this.setState({
      hasError: true
    });

    Logger.log(error + '\n' + info);
  }

  render() {
    if (this.state.hasError) {
      // Render the error message in the UI
      return (
        <div
          style={{
            margin: 'auto',
            width: '400px',
            height: '400px'
          }}
        >
          <img
            src={Path.getStaticFilePath('/images/error.png')}
            alt="Oops! Something went wrong. Please contact you administrator."
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
