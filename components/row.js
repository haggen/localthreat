import { Component } from 'preact';

import Entity from './entity';

function rescale(value, oldMin, oldMax, newMin, newMax) {
  return Math.floor((((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin);
}

function getRatioToColor(ratio) {
  const r = rescale(ratio, 0, 100, 40, 220);
  const g = rescale(ratio, 0, 100, 167, 53);
  return `rgb(${r}, ${g}, 69)`;
}

export default class Row extends Component {
  render({ id, name, corporation, alliance, threat, gangs, kills, losses }) {
    const threatColor = threat > 0 ? getRatioToColor(threat) : 'inherit';
    threat = threat > 0 ? `${threat}%` : '-';
    const gangsColor = gangs > 0 ? getRatioToColor(gangs) : 'inherit';
    gangs = gangs > 0 ? `${gangs}%` : '-';
    kills = kills > 0 ? kills : '0';
    losses = losses > 0 ? losses : '0';
    return (
      <tr>
        <td>
          <Entity href={`https://zkillboard.com/character/${id}/`} image={`https://image.eveonline.com/Character/${id}_32.jpg`} size="32" name={name} />
        </td>
        <td>
          {corporation.id ? (<Entity href={`https://zkillboard.com/corporation/${corporation.id}/`} image={`https://image.eveonline.com/Corporation/${corporation.id}_32.png`} size="32" name={corporation.name} />) : '-'}
        </td>
        <td>
          {alliance.id ? (<Entity href={`https://zkillboard.com/alliance/${alliance.id}/`} image={`https://image.eveonline.com/Alliance/${alliance.id}_32.png`} size="32" name={alliance.name} />) : '-'}
        </td>
        <td style={`text-align: center; color: ${threatColor}`}>
          {threat}
        </td>
        <td style={`text-align: center; color: ${gangsColor}`}>
          {gangs}
        </td>
        <td style="text-align: right">
          {kills}
        </td>
        <td>
          {losses}
        </td>
      </tr>
    );
  }
}
