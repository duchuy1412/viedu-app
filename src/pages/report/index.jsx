import React from "react";
import { Col, Input, PageHeader, Row } from "antd";
import AppSider from "common/AppSider";
import { Route, Switch, useRouteMatch } from "react-router-dom";

const ReportList = React.lazy(() => import("pages/report/ReportList"));
const ReportDetail = React.lazy(() => import("pages/report/ReportDetail"));
const NotFound = React.lazy(() => import("common/NotFound"));

Report.propTypes = {};

const { Search } = Input;

const routes = [
  {
    path: "/",
    breadcrumbName: "Home",
  },
  {
    path: "/reports",
    breadcrumbName: "Reports",
  },
];

function Report(props) {
  let match = useRouteMatch();

  const onSearch = () => {
    alert("searching...");
  };

  return (
    <Switch>
      <Route
        exact
        path={match.path}
        render={() => (
          <AppSider>
            <PageHeader
              title="My reports"
              breadcrumb={{ routes }}
              subTitle=""
            />
            <Row
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Col span={6}>
                <Search
                  placeholder="Search"
                  allowClear
                  enterButton
                  size="middle"
                  onSearch={onSearch}
                />
              </Col>
            </Row>
            <br />
            <ReportList />
          </AppSider>
        )}
      />
      <Route path={`${match.path}/:gameId`} component={ReportDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Report;
