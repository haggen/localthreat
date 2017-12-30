import { Component } from 'preact';

import { EntryRepository } from '../repositories/entry';
import { Sortable } from './sortable';
import { Row } from './row';

export default class Table extends Component {
  compareChar = (a, b) => {
    return a.char.name.localeCompare(b.char.name) * this.state.sorting.dir;
  };

  compareCorp = (a, b) => {
    return a.corp.name.localeCompare(b.corp.name) * this.state.sorting.dir;
  };

  compareAlly = (a, b) => {
    return a.ally.name.localeCompare(b.ally.name) * this.state.sorting.dir;
  };

  compareDanger = (a, b) => {
    return (a.danger == b.danger) ? 0 : (a.danger < b.danger ? -1 : 1) * this.state.sorting.dir;
  };

  compareGangs = (a, b) => {
    return (a.gangs == b.gangs) ? 0 : (a.gangs < b.gangs ? -1 : 1) * this.state.sorting.dir;
  };

  compareKills = (a, b) => {
    return (a.kills == b.kills) ? 0 : (a.kills < b.kills ? -1 : 1) * this.state.sorting.dir;
  };

  compareLosses = (a, b) => {
    return (a.losses == b.losses) ? 0 : (a.losses < b.losses ? -1 : 1) * this.state.sorting.dir;
  };

  state = {
    rows: [],
    sorting: {
      key: 'danger',
      dir: -1,
      func: this.compareDanger,
    }
  };

  handleSort = key => {
    const dir = (key === this.state.sorting.key) ? this.state.sorting.dir * -1 : -1;
    let func;
    switch (key) {
      case 'char':
        func = this.compareChar;
        break;
      case 'corp':
        func = this.compareCorp;
        break;
      case 'ally':
        func = this.compareAlly;
        break;
      case 'danger':
        func = this.compareDanger;
        break;
      case 'gangs':
        func = this.compareGangs;
        break;
      case 'kills':
        func = this.compareKills;
        break;
      case 'losses':
        func = this.compareLosses;
        break;
    }
    this.setState({ sorting: { key, dir, func } });
  };

  refreshRows = _ => {
    this.setState({ rows: this.state.rows.slice() });
  };

  updateRows = paste => {
    const rows = paste.map(name => EntryRepository.fetch(name, this.refreshRows));
    this.setState({ rows });
  };

  componentDidMount() {
    this.updateRows(this.props.paste);
  }

  componentWillReceiveProps(props) {
    this.updateRows(props.paste);
  }

  render({}, { rows, sorting }) {
    const sortedRows = rows.sort(sorting.func).map((row) => {
      return (
        <Row key={row.char.name} {...row} />
      );
    });

    return (
      <table class="table">
        <thead>
          <tr>
            <Sortable sortKey="char" style="width: 20%" activeSorting={sorting} onSort={this.handleSort}>
              Character
            </Sortable>
            <Sortable sortKey="corp" style="width: 20%" activeSorting={sorting} onSort={this.handleSort}>
              Corporation
            </Sortable>
            <Sortable sortKey="ally" style="width: 20%" activeSorting={sorting} onSort={this.handleSort}>
              Alliance
            </Sortable>
            <th>
              <abbr title="Top used ships recently">Ships</abbr>
            </th>
            <Sortable sortKey="danger" style="width: 4rem; text-align: center" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="Danger level">D</abbr>
            </Sortable>
            <Sortable sortKey="gangs" style="width: 4rem; text-align: center" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="% of fights in gangs">G</abbr>
            </Sortable>
            <Sortable sortKey="kills" style="width: 4rem; text-align: right" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="Kills">K</abbr>
            </Sortable>
            <Sortable sortKey="losses" style="width: 4rem"activeSorting={sorting} onSort={this.handleSort}>
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
