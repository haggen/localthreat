import React, { Component } from "react";
import styled from "styled-components";
import reportsApi from "../../api";

const Table = styled.table`
  margin-top: 1.5rem;
  width: 100%;

  th {
    cursor: pointer;
    font-weight: bolder;
    opacity: 0.5;
  }

  th,
  td {
    padding: 0.375rem 0.75rem;
  }

  th:nth-child(5),
  th:nth-child(6),
  th:nth-child(7),
  th:nth-child(8) {
    width: 4.5rem;
  }

  th:nth-child(5),
  td:nth-child(5),
  th:nth-child(6),
  td:nth-child(6) {
    text-align: center;
  }

  th:nth-child(7),
  td:nth-child(7) {
    text-align: right;
  }
`;

class ReportTable extends Component {
  handlePaste = e => {
    const clipboard = e.clipboardData || window.clipboardData;
    const text = clipboard.getData("Text");
    if (!text) return;
    reportsApi
      .update(this.props.reportId, text)
      .then(report => this.onReportLoaded(report));
  };

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  onReportLoaded(report) {
    this.props.onReportLoaded(report);

    const data = report.data.map(entry => ({
      character: {
        id: null,
        name: entry
      },
      corporation: {
        id: null,
        name: null
      },
      alliance: {
        id: null,
        name: null
      },
      ships: [],
      danger: 0,
      gangRatio: 0,
      kills: 0,
      losses: 0
    }));
    this.setState({ data });
  }

  componentDidMount() {
    reportsApi
      .fetch(this.props.reportId)
      .then(report => this.onReportLoaded(report));
  }

  componentDidUpdate(prevProps) {
    window.addEventListener("paste", this.handlePaste);

    if (prevProps.reportId !== this.props.reportId) {
      reportsApi
        .fetch(this.props.reportId)
        .then(report => this.onReportLoaded(report));
    }
  }

  componentWillUnmount() {
    window.removeEventListener("paste", this.handlePaste);
  }

  render() {
    const sortedData = this.state.data.sort((a, b) => {
      return a.character.name.localeCompare(b.character.name);
    });

    return (
      <Table>
        <thead>
          <tr>
            <th>Character</th>
            <th>Corporation</th>
            <th>Alliance</th>
            <th>Ships</th>
            <th>
              <abbr title="Danger">D</abbr>
            </th>
            <th>
              <abbr title="Gang ratio">G</abbr>
            </th>
            <th>
              <abbr title="Kills">K</abbr>
            </th>
            <th>
              <abbr title="Losses">L</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.character.name}</td>
              <td>{entry.corporation.name}</td>
              <td>{entry.alliance.name}</td>
              <td>{entry.ships}</td>
              <td>{entry.danger}</td>
              <td>{entry.gangRatio}</td>
              <td>{entry.kills}</td>
              <td>{entry.losses}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default ReportTable;
