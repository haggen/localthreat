const isActive = (key, sorting) => {
  if (key === sorting.key) {
    return sorting.dir;
  }
  return false;
};

const getArrow = (key, sorting) => {
  switch (isActive(key, sorting)) {
    case 1:
      return <span class="table__sortable">↑</span>;
    case -1:
      return <span class="table__sortable">↓</span>;
  }
};

const getClasses = (key, sorting) => {
  switch (isActive(key, sorting)) {
    case 1:
      return "table__sortable table__sortable--asc";
    case -1:
      return "table__sortable table__sortable--desc";
    default:
      return "table__sortable";
  }
};

export const Sortable = ({
  children,
  sortKey,
  activeSorting,
  style,
  onSort
}) => {
  const arrow = getArrow(sortKey, activeSorting);
  const classes = getClasses(sortKey, activeSorting);
  return (
    <th class={classes} style={style} onClick={e => onSort(sortKey)}>
      {/text-align:\s*right/.exec(style)
        ? [arrow, children]
        : [children, arrow]}
    </th>
  );
};
