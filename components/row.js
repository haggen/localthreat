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
  render({ characterID, characterName, corporationID, corporationName, allianceID, allianceName, threat, gangs, kills, losses }) {
    const threatColor = threat > 0 ? getRatioToColor(threat) : 'inherit';
    threat = threat > 0 ? `${threat}%` : '-';
    const gangsColor = gangs > 0 ? getRatioToColor(gangs) : 'inherit';
    gangs = gangs > 0 ? `${gangs}%` : '-';
    kills = kills > 0 ? kills : '0';
    losses = losses > 0 ? losses : '0';
    return (
      <tr key={characterName}>
        <td>
          <Entity href={`https://zkillboard.com/character/${characterID}/`} image={`https://image.eveonline.com/Character/${characterID}_32.jpg`} size="32" name={characterName} />
        </td>
        <td>
          {corporationID ? (<Entity href={`https://zkillboard.com/corporation/${corporationID}/`} image={`https://image.eveonline.com/Corporation/${corporationID}_32.png`} size="32" name={corporationName} />) : '-'}
        </td>
        <td>
          {allianceID ? (<Entity href={`https://zkillboard.com/alliance/${allianceID}/`} image={`https://image.eveonline.com/Alliance/${allianceID}_32.png`} size="32" name={allianceName} />) : '-'}
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
