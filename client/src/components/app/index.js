import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../topBar";
import HistoryPanel from "../historyPanel";
import Welcome from "../welcome";
import ReportTable from "../reportTable";
import "resetize";
import "./global.css";

const Main = styled.main`
  padding: 1.5rem;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
      report: null,
      isHistoryPanelOpen: false
    };
  }

  toggleHistoryPanel(value) {
    this.setState(state => {
      return {
        isHistoryPanelOpen:
          value === undefined ? !state.isHistoryPanelOpen : value
      };
    });
  }

  setReport(report) {
    const history = [];
    for (let i = 0, l = this.state.history.length; i < l; i++) {
      if (this.state.history[i].id != report.id) {
        history.push(this.state.history[i]);
      }
    }
    history.push(report);
    this.setState({ history, report });
  }

  render() {
    return (
      <BrowserRouter>
        <Main>
          <TopBar toggleHistoryPanel={e => this.toggleHistoryPanel()} />
          <div>
            <HistoryPanel
              history={this.state.history}
              isOpen={this.state.isHistoryPanelOpen}
              onRequestClose={() => this.toggleHistoryPanel(false)}
            />
            <Route exact path="/" component={Welcome} />
            <Route
              path="/:reportId"
              render={props => (
                <ReportTable
                  {...props}
                  report={this.state.report}
                  onReportLoaded={report => this.setReport(report)}
                />
              )}
            />
          </div>
        </Main>
      </BrowserRouter>
    );
  }
}

export default App;
