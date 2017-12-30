import { Component } from 'preact';

export default class Sortable extends Component {
  get isActive() {
    if (this.props.sortingKey === this.props.activeSortingKey) {
      return this.props.activeSortingDir;
    }
    return false;
  }

  get cue() {
    switch (this.isActive) {
      case 1:
        return (<span class="table__sortable">↑</span>);
      case -1:
        return (<span class="table__sortable">↓</span>);
    }
  }

  get classes() {
    switch (this.isActive) {
      case 1:
        return 'table__sortable table__sortable--asc';
      case -1:
        return 'table__sortable table__sortable--desc';
      default:
        return 'table__sortable';
    }
  }

  render({ sortingKey, style, children, onClick, activeSortingKey, activeSortingDir }, {}) {
    return (
      <th class={this.classes} onClick={e => this.props.onClick(sortingKey)} style={style}>
        {/text-align:\s*right/.exec(style) ? [this.cue, children] : [children, this.cue]}
      </th>
    );
  }
}
