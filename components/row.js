import { Component } from 'preact';
import EVE from '../eve';

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
    const dangerRatio = killboard.dangerRatio ? `${killboard.dangerRatio}%` : '-';
    const dangerRatioColor = killboard.dangerRatio ? getDangerRatioColor(killboard.dangerRatio) : 'inherit';
    return (
      <tr>
        <td>
          <a href={`https://zkillboard.com/character/${id}/`}>
            <img alt={name} src={`https://image.eveonline.com/Character/${id}_32.jpg`} width="32" height="32" />
            {name}
          </a>
        </td>
        <td>
          <a href={`https://zkillboard.com/corporation/${corporation.id}/`}>
            <img alt={corporation.name} src={`https://image.eveonline.com/Corporation/${corporation.id}_32.png`} width="32" height="32" />
            {corporation.name}
          </a>
        </td>
        <td>
          {alliance.id ? (<a href={`https://zkillboard.com/alliance/${alliance.id}/`}>
            <img alt={alliance.name} src={`https://image.eveonline.com/Alliance/${alliance.id}_32.png`} width="32" height="32" />
            {alliance.name}
          </a>) : '-'}
        </td>
        <td style={`color: ${dangerRatioColor}`}><strong>{dangerRatio}</strong></td>
        <td style="text-align: right">{killboard.shipsDestroyed || 0}</td>
        <td>{killboard.shipsLost || 0}</td>
      </tr>
    );
  }
}
