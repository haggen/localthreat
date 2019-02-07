import React, { Component } from "react";
import styled from "styled-components";

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
    const body = clipboard.getData("Text");
    if (!body) return;
    fetch("http://api.localthreat.localhost/reports", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain"
      },
      body
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(report => {
        this.props.history.push("/" + report.id);
      });
  };

  componentDidMount() {
    window.addEventListener("paste", this.handlePaste);
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
