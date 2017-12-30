import { Component } from 'preact';

import { EntryRepository } from '../repositories/entry';
import { Sortable } from './sortable';
import { Row } from './row';

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
    const sortedRows = rows.sort(this.compareRows).map((row) => {
      return (
        <Row {...row} />
      );
    });

    return (
      <table class="table">
        <thead>
          <tr>
            <Sortable sortKey="char" style="width: 25%" activeSorting={sorting} onSort={this.handleSort}>
              Character
            </Sortable>
            <Sortable sortKey="corp" style="width: 25%" activeSorting={sorting} onSort={this.handleSort}>
              Corporation
            </Sortable>
            <Sortable sortKey="ally" style="width: 25%" activeSorting={sorting} onSort={this.handleSort}>
              Alliance
            </Sortable>
            <Sortable sortKey="danger" style="text-align: center" activeSorting={sorting} onSort={this.handleSort}>
              <abbr title="Danger level">D</abbr>
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
