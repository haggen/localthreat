import React, { Component } from "react";
import styled from "styled-components";

const Table = styled.table`
  margin-top: 1.5rem;
  width: 100%;

  td {
    padding: 0.375rem 0.75rem;
  }
`;

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
      .then(report => this.onReportLoaded(report));
  };

  shouldLoadReport(reportId) {
    return !this.props.report || this.props.report.id !== reportId;
  }

  loadReport(reportId) {
    if (!this.shouldLoadReport(reportId)) return;

    fetch("http://api.localthreat.localhost/reports/" + reportId)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(report => this.onReportLoaded(report));
  }

  onReportLoaded(report) {
    this.props.onReportLoaded(report);
    window.addEventListener("paste", this.handlePaste);
  }

  componentDidMount() {
    this.loadReport(this.props.match.params.reportId);
  }

  componentDidUpdate() {
    this.loadReport(this.props.match.params.reportId);
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
      <Table>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default ReportTable;
