import React, { Component } from "react";
import styled from "styled-components";
import reportsApi from "../../api/reports";

const Notice = styled.div`
  font-size: 1.25em;
  padding: 10% 15%;
  text-align: center;

  h1 {
    font-size: 1.75em;
    font-weight: bolder;
  }

  p {
    margin-top: 1.5rem;
  }
`;

class Welcome extends Component {
  handlePaste = e => {
    console.log(e);
    const clipboard = e.clipboardData || window.clipboardData;
    const text = clipboard.getData("Text");
    if (!text) return;
    reportsApi
      .create(text)
      .then(report => this.props.history.push("/" + report.id));
  };

  componentDidMount() {
    window.addEventListener("paste", this.handlePaste);
    this.props.resetReport();
  }

  componentWillUnmount() {
    window.removeEventListener("paste", this.handlePaste);
  }

  render() {
    return (
      <Notice>
        <h1>Paste the chat transcript or members here&hellip;</h1>
        <p>
          Right-click on your chat transcript and select{" "}
          <strong>Copy All</strong> or press <strong>CTRL-A</strong> and then{" "}
          <strong>CTRL-C</strong> in the members list and then press{" "}
          <strong>CTRL-V</strong> here to get a report of characters
          affiliations and PvP stats.
        </p>
      </Notice>
    );
  }
}

export default Welcome;
