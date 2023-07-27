import React from 'react';
import { Link } from 'react-router-dom';
import { Tab } from '@material-ui/core';

class LinkTab extends React.Component {
  render() {
    const { to } = this.props;

    return (
      <Link to={to} className="link">
        <Tab {...this.props} />
      </Link>
    );
  }
}

export default LinkTab;
