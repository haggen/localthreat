import { Component } from 'preact';
import { Entity } from './entity';

const rescale = (value, oldMin, oldMax, newMin, newMax) => {
  return Math.floor((((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin);
};

const ratioToColor = ratio => {
  if (!ratio) return 'black';
  const r = rescale(ratio, 0, 100, 40, 220);
  const g = rescale(ratio, 0, 100, 167, 53);
  return `rgb(${r}, ${g}, 69)`;
};

export const Row = ({ char, corp, ally, ships, danger, gangs, kills, losses }, {}) => {
  return (
    <tr>
      <td>
        <Entity type="char" {...char} />
      </td>
      <td>
        <Entity type="corp" {...corp} />
      </td>
      <td>
        <Entity type="ally" {...ally} />
      </td>
      <td>
        {ships.map((ship) => (<Entity type="type" {...ship} />))}
      </td>
      <td style={`text-align: center; color: ${ratioToColor(danger)}`}>
        {danger ? `${danger}%` : '-'}
      </td>
      <td style={`text-align: center; color: ${ratioToColor(gangs)}`}>
        {gangs ? `${gangs}%` : '-'}
      </td>
      <td style="text-align: right">
        {kills}
      </td>
      <td>
        {losses}
      </td>
    </tr>
  );
};
