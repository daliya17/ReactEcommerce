import {
  Grid,
  Typography,
  withStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import expandable from '../../../components/hoc/expandable';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = {
  splitContainer: {
    width: 'auto',
    margin: '0px -12px 10px -12px',
    overflow: 'auto',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  item: {
    maxWidth: 'fit-content'
  },
  abpHeader: {
    color: '#555555'
  },
  code: {
    color: '#555555',
    marginTop: '10px'
  }
};

const CustomExpansionPanel = expandable(ExpansionPanel);

class ABPDisplay extends React.Component {
  static defaultProps = {};

  static propTypes = {
    originalRemittanceText: PropTypes.string.isRequired,
    generatedRemittanceText: PropTypes.string.isRequired
  };

  render() {
    const {
      classes,
      originalRemittanceText,
      generatedRemittanceText
    } = this.props;

    return (
      <CustomExpansionPanel className="expandable">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subheading" className="subheading">
            {'Remittance texts'}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24} className={classes.splitContainer}>
            <Grid item sm={6} className={classes.item}>
              <Typography variant="subheading" className={classes.abpHeader}>
                {'Original ABP'}
              </Typography>
              <Typography
                variant="body2"
                component="pre"
                className={classes.code}
              >
                {originalRemittanceText}
              </Typography>
            </Grid>
            <Grid item sm={6} className={classes.item}>
              <Typography variant="subheading" className={classes.abpHeader}>
                {'Generated ABP'}
              </Typography>
              <Typography
                variant="body2"
                component="pre"
                className={classes.code}
              >
                {generatedRemittanceText}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </CustomExpansionPanel>
    );
  }
}

export default withStyles(styles)(ABPDisplay);
