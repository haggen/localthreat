import { Component } from 'preact';

import EVE from '../lib/eve';
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
      return (a[sortingKey] < b[sortingKey] ? -1 : 1) * sortingDir;
    }
  };

  getSortableClassFor = (sortingKey) => {
    if (sortingKey === this.state.sortingKey) {
      return 'table__sortable--active table__sortable--' + (this.state.sortingDir > 0 ? 'asc' : 'desc');
    }
    return '';
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
      <section class="table">
        <table>
          <thead>
            <tr>
              <th style="width: 25%">
                <a href="javascript:" class={`table__sortable ${this.getSortableClassFor('characterName')}`} onClick={(e) => this.updateSorting('characterName')}>
                  Character
                </a>
              </th>
              <th style="width: 25%">
                <a href="javascript:" class={`table__sortable ${this.getSortableClassFor('corporationName')}`} onClick={(e) => this.updateSorting('corporationName')}>
                  Corporation
                </a>
              </th>
              <th style="width: 25%">
                <a href="javascript:" class={`table__sortable ${this.getSortableClassFor('allianceName')}`} onClick={(e) => this.updateSorting('allianceName')}>
                  Alliance
                </a>
              </th>
              <th style="text-align: center">
                <a href="javascript:" class={`table__sortable ${this.getSortableClassFor('threat')}`} onClick={(e) => this.updateSorting('threat')}>
                  <abbr title="Threat">T</abbr>
                </a>
              </th>
              <th style="text-align: center">
                <a href="javascript:" class={`table__sortable ${this.getSortableClassFor('gangs')}`} onClick={(e) => this.updateSorting('gangs')}>
                  <abbr title="% of fights in gangs">G</abbr>
                </a>
              </th>
              <th style="text-align: right">
                <a href="javascript:" class={`table__sortable ${this.getSortableClassFor('kills')}`} onClick={(e) => this.updateSorting('kills')}>
                  <abbr title="Kills">K</abbr>
                </a>
              </th>
              <th>
                <a href="javascript:" class={`table__sortable ${this.getSortableClassFor('losses')}`} onClick={(e) => this.updateSorting('losses')}>
                  <abbr title="Losses">L</abbr>
                </a>
              </th>
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
