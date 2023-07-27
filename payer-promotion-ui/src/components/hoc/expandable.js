import React from 'react';
import PropTypes from 'prop-types';

const expandable = WrappedComponent => {
  class ExpandableWrapper extends React.Component {
    static defaultProps = {
      expanded: false
    };

    static propTypes = {
      expanded: PropTypes.bool.isRequired
    };

    state = {
      expanded: this.props.expanded
    };

    componentWillReceiveProps(nextProps) {
      if (this.props.expanded !== nextProps.expanded) {
        this.setState({
          expanded: nextProps.expanded
        });
      }
    }

    handleExpansionChange = () => {
      this.setState(prevState => ({
        expanded: !prevState.expanded
      }));
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          expanded={this.state.expanded}
          onChange={this.handleExpansionChange}
        />
      );
    }
  }

  return ExpandableWrapper;
};

export default expandable;
