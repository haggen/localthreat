import { Component } from 'preact';

import EVE from '../lib/eve';
import Entity from './entity';

function rescale(value, oldMin, oldMax, newMin, newMax) {
  return Math.floor((((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin);
}

function getDangerRatioColor(ratio) {
  const r = rescale(ratio, 0, 100, 40, 220);
  const g = rescale(ratio, 0, 100, 167, 53);
  return `rgb(${r}, ${g}, 69)`;
}

export default class Row extends Component {
  state = {
    id: 0,
    corporation: {},
    alliance: {},
    killboard: {},
  };

  componentDidMount() {
    EVE.queryIDs(this.props.name, 'character', true).then((json) => {
      if (!json.character) return;
      const id = json.character[0];
      this.setState({ id });

      EVE.getCharacterAffiliation(id).then((affiliation) => {

        // Get character's Corporation.
        EVE.getCorporation(affiliation.corporationID).then((corporation) => {
          this.setState({ corporation });
        });

        // Get character's Alliance.
        if (affiliation.allianceID) {
          EVE.getAlliance(affiliation.allianceID).then((alliance) => {
            this.setState({ alliance });
          });
        }
      });

      // Get character's Killboard.
      EVE.getCharacterKillboard(id).then((killboard) => {
        killboard.dangerRatio = killboard.dangerRatio || 0;
        this.props.onCharacterUpdate('dangerRatio', killboard.dangerRatio);
        this.setState({ killboard });
      });
    });
  }

  render({ name }, { id, corporation, alliance, killboard }) {
    const soloRatio = killboard.gangRatio ? `${100 - killboard.gangRatio}%` : '-';
    const dangerRatio = killboard.dangerRatio ? `${killboard.dangerRatio}%` : '-';
    const dangerRatioColor = killboard.dangerRatio ? getDangerRatioColor(killboard.dangerRatio) : 'inherit';
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
        <td style={`text-align: center; color: ${dangerRatioColor}`}><strong>{dangerRatio}</strong></td>
        <td style="text-align: center">{soloRatio}</td>
        <td style="text-align: right">{killboard.shipsDestroyed || 0}</td>
        <td>{killboard.shipsLost || 0}</td>
      </tr>
    );
  }
}
