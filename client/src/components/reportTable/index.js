import React, { Component } from "react";
import styled from "styled-components";
import EntityLink from "../entityLink";
import reportsApi from "../../api/reports";
import esiApi from "../../api/esi";
import zkbApi from "../../api/zkb";

const comparators = {
  characterName(a, b) {
    return a.character.name.localeCompare(b.character.name);
  },
  corporationName(a, b) {
    return a.corporation.name.localeCompare(b.corporation.name);
  },
  allianceName(a, b) {
    return a.alliance.name.localeCompare(b.alliance.name);
  },
  dangerRatio(a, b) {
    return a.dangerRatio - b.dangerRatio;
  },
  gangRatio(a, b) {
    return a.gangRatio - b.gangRatio;
  },
  shipsDestroyed(a, b) {
    return a.shipsDestroyed - b.shipsDestroyed;
  },
  shipsLost(a, b) {
    return a.shipsLost - b.shipsLost;
  }
};

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: 100%;

  tr {
    border-radius: 2px;
  }

  th {
    font-weight: bolder;
    opacity: 0.5;
  }

  th.sortable {
    cursor: pointer;
  }

  th.sortable:hover {
    opacity: 1;
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

  tbody tr:nth-child(2n + 1) {
    background-color: rgba(0, 0, 0, 0.25);
  }

  tbody tr:hover {
    background-color: rgba(158, 174, 149, 0.25);
  }
`;

const SortableTableHeader = ({
  sortingKey,
  currentSorting,
  onClick,
  children
}) => (
  <th className="sortable" onClick={e => onClick(sortingKey)}>
    {children}
    {currentSorting.key === sortingKey
      ? currentSorting.direction > 0
        ? "↑"
        : "↓"
      : null}
  </th>
);

const reportPollerInterval = 2500;

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
      reportPoller: null,
      data: [],
      sorting: {
        key: "dangerRatio",
        direction: -1
      }
    };
  }

  changeSorting(key) {
    this.setState({
      sorting: {
        key,
        direction:
          this.state.sorting.key === key
            ? this.state.sorting.direction * -1
            : -1
      }
    });
  }

  pollReportChanges() {
    reportsApi.fetch(this.props.reportId).then(report => {
      if (report.timestamps !== this.props.report.timestamps) {
        this.onReportLoaded(report);
      }
    });
  }

  onReportLoaded(report) {
    this.props.onReportLoaded(report);
    this.buildReportData(report);

    if (!this.state.reportsPoller) {
      this.setState({
        reportPoller: setInterval(
          () => this.pollReportChanges(),
          reportPollerInterval
        )
      });
    }
  }

  buildReportData(report) {
    const data = [];
    report.data.forEach(name => {
      data.push({
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
        shipsDestroyed: 0,
        shipsLost: 0
      });
    });
    this.setState({ data });

    esiApi.fetchByNames(report.data).then(ids => {
      data.forEach(entry => {
        entry.character.id = ids[entry.character.name];

        zkbApi.fetchStats(entry.character.id).then(stats => {
          entry.dangerRatio = stats.dangerRatio || 0;
          entry.gangRatio = stats.gangRatio || 0;
          entry.shipsDestroyed = stats.shipsDestroyed || 0;
          entry.shipsLost = stats.shipsLost || 0;

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
    if (this.state.reportPoller) clearInterval(this.state.reportPoller);
  }

  render() {
    const { data, sorting } = this.state;

    const sortedData = data.sort(
      (a, b) => comparators[sorting.key](a, b) * sorting.direction
    );

    return (
      <Table>
        <thead>
          <tr>
            <SortableTableHeader
              sortingKey="characterName"
              currentSorting={sorting}
              onClick={key => this.changeSorting(key)}
            >
              Character
            </SortableTableHeader>
            <SortableTableHeader
              sortingKey="corporationName"
              currentSorting={sorting}
              onClick={key => this.changeSorting(key)}
            >
              Corporation
            </SortableTableHeader>
            <SortableTableHeader
              sortingKey="allianceName"
              currentSorting={sorting}
              onClick={key => this.changeSorting(key)}
            >
              Alliance
            </SortableTableHeader>
            <th>Ships</th>
            <SortableTableHeader
              sortingKey="dangerRatio"
              currentSorting={sorting}
              onClick={key => this.changeSorting(key)}
            >
              <abbr title="Danger">D</abbr>
            </SortableTableHeader>

            <SortableTableHeader
              sortingKey="gangRatio"
              currentSorting={sorting}
              onClick={key => this.changeSorting(key)}
            >
              <abbr title="Gang ratio">G</abbr>
            </SortableTableHeader>

            <SortableTableHeader
              sortingKey="shipsDestroyed"
              currentSorting={sorting}
              onClick={key => this.changeSorting(key)}
            >
              <abbr title="Kills">K</abbr>
            </SortableTableHeader>

            <SortableTableHeader
              sortingKey="shipsLost"
              currentSorting={sorting}
              onClick={key => this.changeSorting(key)}
            >
              <abbr title="Losses">L</abbr>
            </SortableTableHeader>
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
              <td>{entry.shipsDestroyed}</td>
              <td>{entry.shipsLost}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default ReportTable;
