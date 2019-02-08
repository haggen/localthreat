import React, { Component } from "react";
import styled from "styled-components";
import reportsApi from "../../api";

const Table = styled.table`
  margin-top: 1.5rem;
  width: 100%;

  td {
    padding: 0.375rem 0.75rem;
  }
`;

class ReportTable extends Component {
  handlePaste = e => {
    const clipboard = e.clipboardData || window.clipboardData;
    const text = clipboard.getData("Text");
    if (!text) return;
    reportsApi
      .update(this.props.reportId, text)
      .then(report => this.props.onReportLoaded(report));
  };

  componentDidMount() {
    reportsApi
      .fetch(this.props.reportId)
      .then(report => this.props.onReportLoaded(report));
  }

  componentDidUpdate(prevProps) {
    window.addEventListener("paste", this.handlePaste);

    if (prevProps.reportId !== this.props.reportId) {
      reportsApi
        .fetch(this.props.reportId)
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
