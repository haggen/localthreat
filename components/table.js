import { Component } from 'preact';

import EVE from '../lib/eve';
import Sortable from './sortable';
import Row from './row';

export default class Table extends Component {
  state = {
    rows: [],
    sortingKey: 'threat',
    sortingDir: -1,
  };

  updateSorting = (sortingKey) => {
    if (sortingKey === this.state.sortingKey) {
      this.setState({ sortingDir: this.state.sortingDir * -1 });
    } else {
      this.setState({ sortingKey, sortingDir: -1 });
    }
  };

  compareRows = (a, b) => {
    const { sortingKey, sortingDir } = this.state;
    if (a[sortingKey] === b[sortingKey]) {
      return 0;
    } else {
      return (a[sortingKey] < b[sortingKey] ? -1 : 1) * sortingDir}
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

  render({}, { rows, sortingKey, sortingDir }) {
    const sortedRows = rows.sort(this.compareRows).map((row) => {
      return (
        <Row {...row} />
      );
    });

    return (
      <section class="paste">
        <table class="table">
          <thead>
            <tr>
              <Sortable sortingKey="characterName" style="width: 25%" activeSortingKey={sortingKey} activeSortingDir={sortingDir} onClick={this.updateSorting}>
                Character
              </Sortable>
              <Sortable sortingKey="corporationName" style="width: 25%" activeSortingKey={sortingKey} activeSortingDir={sortingDir} onClick={this.updateSorting}>
                Corporation
              </Sortable>
              <Sortable sortingKey="allianceName" style="width: 25%" activeSortingKey={sortingKey} activeSortingDir={sortingDir} onClick={this.updateSorting}>
                Alliance
              </Sortable>
              <Sortable sortingKey="threat" style="text-align: center" activeSortingKey={sortingKey} activeSortingDir={sortingDir} onClick={this.updateSorting}>
                <abbr title="Threat">T</abbr>
              </Sortable>
              <Sortable sortingKey="gangs" style="text-align: center" activeSortingKey={sortingKey} activeSortingDir={sortingDir} onClick={this.updateSorting}>
                <abbr title="% of fights in gangs">G</abbr>
              </Sortable>
              <Sortable sortingKey="kills" style="text-align: right" activeSortingKey={sortingKey} activeSortingDir={sortingDir} onClick={this.updateSorting}>
                <abbr title="Kills">K</abbr>
              </Sortable>
              <Sortable sortingKey="losses" activeSortingKey={sortingKey} activeSortingDir={sortingDir} onClick={this.updateSorting}>
                <abbr title="Losses">L</abbr>
              </Sortable>
            </tr>
          </thead>
          <tbody>
            {sortedRows}
          </tbody>
        </table>
      </section>
    );
  }
}
