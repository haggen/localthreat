import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import styled from "styled-components";
import TopBar from "../topBar";
import HistoryPanel from "../historyPanel";
import "resetize";
import "./global.css";

const Placeholder = ({ match }) => String(match.params.reportId);

const Main = styled.main`
  padding: 1.5rem;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    return (
      <BrowserRouter>
        <Main>
          <TopBar toggleHistoryPanel={e => this.toggleHistoryPanel()} />
          <div>
            <HistoryPanel
              isOpen={this.state.isHistoryPanelOpen}
              onRequestClose={() => this.toggleHistoryPanel(false)}
            />
            <Route exact path="/" component={Placeholder} />
            <Route path="/:reportId" component={Placeholder} />
          </div>
        </Main>
      </BrowserRouter>
    );
  }
}

export default App;
