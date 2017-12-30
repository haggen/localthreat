import { Component } from 'preact';

import EVE from '../lib/eve';
import Sortable from './sortable';
import Row from './row';

export default class Table extends Component {
  state = {
    rows: [],
    sorting: {
      key: 'threat',
      dir: -1
    }
  };

  handleSort = key => {
    if (key === this.state.sorting.key) {
      this.setState({ sorting: { key, dir: this.state.sorting.dir * -1 } });
    } else {
      this.setState({ sorting: { key, dir: -1 } });
    }
  };

  compareRows = (a, b) => {
    const { key, dir } = this.state.sorting;
    if (a[key] === b[key]) {
      return 0;
    } else {
      return (a[key] < b[key] ? -1 : 1) * dir}
  };

  updateRows(props) {
    const rows = props.rows.map((name) => {
      const row = {
        characterID: 0,
        characterName: name,
        corporationID: 0,
        corporationName: '',
        allianceID: 0,
        allianceName: '',
        threat: 0,
        gangs: 0,
        kills: 0,
        losses: 0
      };

      EVE.queryIDs(name, 'character', true).then((ids) => {
        if (!ids.character) return;
        row.characterID = ids.character[0];

        EVE.getCharacterAffiliation(row.characterID).then((affiliation) => {
          row.corporationID = affiliation[0];
          if (affiliation.length > 1) row.allianceID = affiliation[1];

          EVE.getNames(affiliation).then((names) => {
            row.corporationName = names[0];
            if (names.length > 1) row.allianceName = names[1];
            this.setState({ rows: this.state.rows });
          });
        });

        EVE.getCharacterKillboard(row.characterID).then((killboard) => {
          if (!killboard) return;
          row.threat = killboard.dangerRatio || 0;
          row.gangs = killboard.gangRatio || 0;
          row.kills = killboard.shipsDestroyed || 0;
          row.losses = killboard.shipsLost || 0;
          this.setState({ rows });
        });
      });

      return row;
    });
    this.setState({ rows });
  }

  componentDidMount() {
    this.updateRows(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateRows(props);
  }

  render({}, { rows, sorting }) {
    const sortedRows = rows.sort(this.compareRows).map((row) => {
      return (
        <Row {...row} />
      );
    });

    return (
      <table class="table">
        <thead>
          <tr>
            <Sortable sortKey="characterName" style="width: 25%" activeSorting={sorting} onSort={this.handleSort}>
              Character
            </Sortable>
            <Sortable sortKey="corporationName" style="width: 25%" activeSorting={sorting} onSort={this.handleSort}>
              Corporation
            </Sortable>
            <Sortable sortKey="allianceName" style="width: 25%" activeSorting={sorting} onSort={this.handleSort}>
              Alliance
            </Sortable>
            <Sortable sortKey="threat" style="text-align: center" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="Threat">T</abbr>
            </Sortable>
            <Sortable sortKey="gangs" style="text-align: center" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="% of fights in gangs">G</abbr>
            </Sortable>
            <Sortable sortKey="kills" style="text-align: right" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="Kills">K</abbr>
            </Sortable>
            <Sortable sortKey="losses" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="Losses">L</abbr>
            </Sortable>
          </tr>
        </thead>
        <tbody>
          {sortedRows}
        </tbody>
      </table>
    );
  }
}
