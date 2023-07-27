import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateRegression from "../components/CreateRegression";
import RegressionReport from "../components/RegressionReport";
import { ComparisonPageComponent } from "../components/comparisonResult/ComparisonResult";
import RegressionList from "../components/RegressionList";

function AppRouter (): JSX.Element {
    return(
        <React.Fragment>
             <Routes>
             <Route
              path={''}
              Component={RegressionList}
            />
             <Route
              path={'/regressions'}
              Component={RegressionList}
            />
             <Route
              path={'/createregression'}
              Component={CreateRegression}
            />
             <Route
              path={'/regression/:regressionId/comparisonresult'}
              Component={ComparisonPageComponent}
            />
              <Route
              path={'/regression/report/:regressionIds'}
              Component={RegressionReport}
            />
             </Routes>
            
        </React.Fragment>
    );
}
export default AppRouter;
