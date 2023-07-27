import { Grid } from '@material-ui/core';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import NotFound from '../components/notfound';
import Path from '../lib/path';
import BatchComparisonsByPath from './comparisons/BatchComparisonsByPath';
import CreateRegression from './createregression';
import DiffRules from './diffs/DiffRules';
import DiffCategories from './diffs/DiffCategories';
import PayerDetails from './payers/payerdetails';
import PayersList from './payers/payerslist';
import RegressionPayerBatches from './regressions/regressionpayerbatches';
import RegressionPayers from './regressions/regressionpayers';
import RegressionsList from './regressions/RegressionsList';
import RegressionReport from './regressions/reports';
import RegressionDiffsViewManager from './regressions/reports/RegressionDiffsViewManager';
import DiffCategorizationRules from './diffs/DiffCategorizationRules';

/**
 * NOTE: This compoenent will not work when binded to redux store
 *
 */
class ViewResolver extends React.Component {
  static defaultProps = {};

  static propTypes = {};

  renderPayersSplitPane() {
    return (
      <Route path={Path.PayersRoute}>
        <Grid className={'splitcontainer'} container spacing={24}>
          <Grid className={'pane leftpane'} item sm={3}>
            <Route
              exact
              path={Path.SelectedPayerRoute}
              component={PayersList}
            />
            <Route
              exact
              path={Path.PayerPaymentBatchesRoute}
              component={PayersList}
            />
          </Grid>
          <Grid className={'pane rightpane'} item sm={9}>
            <Switch>
              <Route
                exact
                path={Path.PayerPaymentBatchesRoute}
                component={PayerDetails}
              />
              <Route
                render={() => <NotFound redirectPath={Path.RegressionsRoute} />}
              />
            </Switch>
          </Grid>
        </Grid>
      </Route>
    );
  }

  renderRegressionsSplitPane() {
    return (
      <Route path={Path.RegressionsRoute}>
        <Grid className={'splitcontainer'} container spacing={24}>
          <Grid className={'pane leftpane'} item sm={3}>
            <Route
              exact
              path={Path.RegressionPayersRoute}
              component={RegressionsList}
            />
            <Route
              exact
              path={Path.RegressionPayerBatchesRoute}
              component={RegressionPayers}
            />
            <Route
              exact
              path={Path.RegressionPayerBatchComparisonsRoute}
              component={RegressionPayerBatches}
            />
          </Grid>
          <Grid className={'pane rightpane'} item sm={9}>
            <Switch>
              <Route
                exact
                path={Path.RegressionPayersRoute}
                component={RegressionPayers}
              />
              <Route
                exact
                path={Path.RegressionPayerBatchesRoute}
                component={RegressionPayerBatches}
              />
              <Route
                exact
                path={Path.RegressionPayerBatchComparisonsRoute}
                component={BatchComparisonsByPath}
              />
              <Route
                render={() => <NotFound redirectPath={Path.RegressionsRoute} />}
              />
            </Switch>
          </Grid>
        </Grid>
      </Route>
    );
  }

  render() {
    return (
      <Switch>
        <Route exact path="/">
          <Redirect to={Path.PayersRoute} />
        </Route>
        <Route exact path={Path.PayersRoute} component={PayersList} />
        <Route path={Path.PayersRoute}>{this.renderPayersSplitPane}</Route>

        <Route exact path={Path.DiffRulesRoute} component={DiffRules} />
        <Route
          exact
          path={Path.DiffCategoriesRoute}
          component={DiffCategories}
        />
        <Route
          exact
          path={Path.DiffCategorizationRulesRoute}
          component={DiffCategorizationRules}
        />
        <Route exact path={Path.RegressionsRoute} component={RegressionsList} />
        <Route
          exact
          path={Path.NewRegressionRoute}
          component={CreateRegression}
        />
        <Route
          exact
          path={Path.RegressionReportRoute}
          component={RegressionReport}
        />
        <Route
          exact
          path={Path.RegressionDiffsRoute}
          component={RegressionDiffsViewManager}
        />
        {this.renderRegressionsSplitPane()}

        <Route path="*" exact component={NotFound} />
      </Switch>
    );
  }
}

export default ViewResolver;
