import React from 'react';
import { Link } from 'react-router-dom';

class Redirector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectTo: ''
    };

    this.link = null;
  }

  componentDidMount() {
    window.addEventListener('router-redirect', this.redirectToPage);
  }

  componentWillUnmount() {
    window.removeEventListener('router-redirect', this.redirectToPage);
  }

  componentDidUpdate() {
    if (this.state.redirectTo) {
      if (this.link) {
        this.link.click();
      }
      this.setState({
        redirectTo: ''
      });
    }
  }

  /**
   * Display the alert message
   * @param {object} event
   */
  redirectToPage = event => {
    const redirectTo = (event.detail || {}).redirectTo;

    this.setState({
      redirectTo
    });
  };

  render() {
    const { redirectTo } = this.state;
    return redirectTo ? (
      <Link
        innerRef={node => (this.link = node)}
        to={redirectTo}
        className="hidden"
      />
    ) : null;
  }
}

export default Redirector;
