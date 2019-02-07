import React, { Component } from "react";
import styled from "styled-components";

class ReportTable extends Component {
  handlePaste = e => {
    console.log(e);
    const clipboard = e.clipboardData || window.clipboardData;
    const body = clipboard.getData("Text");
    if (!body) return;
    fetch(
      "http://api.localthreat.localhost/reports/" +
        this.props.match.params.reportId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain"
        },
        body
      }
    )
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(report => {
        this.props.onReportLoaded(report);
      });
  };

  componentDidMount() {
    if (this.props.report) {
      window.addEventListener("paste", this.handlePaste);
    } else {
      fetch(
        "http://api.localthreat.localhost/reports/" +
          this.props.match.params.reportId
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw response;
        })
        .then(report => this.props.onReportLoaded(report));
    }
  }

  componentWillUnmount() {
    window.removeEventListener("paste", this.handlePaste);
  }

  render() {
    if (!this.props.report) {
      return null;
    }

    const data = this.props.report.data || [];
    return (
      <table>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default ReportTable;
