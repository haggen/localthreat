import React, { Component } from "react";
import styled from "styled-components";
import EntityLink from "../entityLink";
import reportsApi from "../../api/reports";
import esiApi from "../../api/esi";
import zkbApi from "../../api/zkb";

const compareCharactersName = direction => (a, b) =>
  a.character.name.localeCompare(b.character.name) * direction;

const compareCorporationName = direction => (a, b) =>
  a.corporation.name.localeCompare(b.corporation.name) * direction;

const compareAllianceName = direction => (a, b) =>
  a.alliance.name.localeCompare(b.alliance.name) * direction;

const compareDangerRatio = direction => (a, b) =>
  (a.dangerRatio - b.dangerRatio) * direction;

const compareGangRatio = direction => (a, b) =>
  (a.gangRatio - b.gangRatio) * direction;

const compareKills = direction => (a, b) => (a.kills - b.kills) * direction;

const compareLosses = direction => (a, b) => (a.losses - b.losses) * direction;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1.5rem;
  table-layout: fixed;
  width: 100%;

  tr {
    border-radius: 2px;
  }

  th {
    cursor: pointer;
    font-weight: bolder;
    opacity: 0.5;
  }

  th,
  td {
    padding: 0.375rem 0.75rem;
  }

  th:nth-child(1),
  td:nth-child(1) {
    border-radius: 2px 0 0 2px;
  }

  th:last-child,
  td:last-child {
    border-radius: 0 2px 2px 0;
  }

  th:nth-child(1),
  th:nth-child(2),
  th:nth-child(3) {
    width: 20%;
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

  tbody tr:hover {
    /* box-shadow: 0 0 0 0.125rem rgba(158, 174, 149, 0.25); */
  }

  tbody tr:hover td {
    background-color: rgba(158, 174, 149, 0.25);
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
      data: [],
      sortingFunc: compareCharactersName,
      sortingDir: -1
    };
  }

  changeSorting(key) {
    let sortingFunc;
    switch (key) {
      case "dangerRatio":
        sortingFunc = compareDangerRatio;
        break;
      case "gangRatio":
        sortingFunc = compareGangRatio;
        break;
      case "kills":
        sortingFunc = compareKills;
        break;
      case "losses":
        sortingFunc = compareLosses;
        break;
      case "alliance":
        sortingFunc = compareAllianceName;
        break;
      case "corporation":
        sortingFunc = compareCorporationName;
        break;
      default:
        sortingFunc = compareCharactersName;
        break;
    }
    this.setState({
      sortingFunc,
      sortingDir:
        this.state.sortingFunc === sortingFunc ? this.state.sortingDir * -1 : -1
    });
  }

  onReportLoaded(report) {
    this.props.onReportLoaded(report);

    const data = report.data.map(name => ({
      character: {
        id: null,
        name
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
      dangerRatio: 0,
      gangRatio: 0,
      kills: 0,
      losses: 0
    }));
    this.setState({ data });

    esiApi.fetchByNames(report.data).then(ids => {
      data.forEach(entry => {
        entry.character.id = ids[entry.character.name];

        zkbApi.fetchStats(entry.character.id).then(stats => {
          entry.dangerRatio = stats.dangerRatio || 0;
          entry.gangRatio = stats.gangRatio || 0;
          entry.kills = stats.shipsDestroyed || 0;
          entry.losses = stats.shipsLost || 0;

          this.setState(state => ({ data }));
        });
      });

      esiApi.fetchAffiliations(Object.values(ids)).then(affiliations => {
        const affiliationsIds = {};

        data.forEach(entry => {
          const affiliationEntry = affiliations[entry.character.id];
          if (affiliationEntry) {
            entry.corporation.id = affiliationEntry.corporationId;
            entry.alliance.id = affiliationEntry.allianceId;
            affiliationsIds[affiliationEntry.corporationId] = true;
            affiliationsIds[affiliationEntry.allianceId] = true;
          }
        });

        delete affiliationsIds[undefined];

        esiApi.fetchByIds(Object.keys(affiliationsIds)).then(names => {
          data.forEach(entry => {
            entry.corporation.name = names[entry.corporation.id] || "";
            entry.alliance.name = names[entry.alliance.id] || "";
          });

          this.setState(state => ({ data }));
        });

        this.setState(state => ({ data }));
      });

      this.setState(state => ({ data }));
    });
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
    const { data, sortingFunc, sortingDir } = this.state;
    const sortedData = data.sort(sortingFunc(sortingDir));

    return (
      <Table>
        <thead>
          <tr>
            <th onClick={e => this.changeSorting("character")}>Character</th>
            <th onClick={e => this.changeSorting("corporation")}>
              Corporation
            </th>
            <th onClick={e => this.changeSorting("alliance")}>Alliance</th>
            <th>Ships</th>
            <th onClick={e => this.changeSorting("dangerRatio")}>
              <abbr title="Danger">D</abbr>
            </th>
            <th onClick={e => this.changeSorting("gangRatio")}>
              <abbr title="Gang ratio">G</abbr>
            </th>
            <th onClick={e => this.changeSorting("kills")}>
              <abbr title="Kills">K</abbr>
            </th>
            <th onClick={e => this.changeSorting("losses")}>
              <abbr title="Losses">L</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((entry, index) => (
            <tr key={entry.character.id || index}>
              <td>
                <EntityLink type="character" entity={entry.character} />
              </td>
              <td>
                <EntityLink type="corporation" entity={entry.corporation} />
              </td>
              <td>
                <EntityLink type="alliance" entity={entry.alliance} />
              </td>
              <td>{entry.ships}</td>
              <td>{entry.dangerRatio}</td>
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
