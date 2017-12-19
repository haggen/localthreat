import { Component } from 'preact';

import EVE from '../lib/eve';
import Row from './row';

export default class Table extends Component {
  state = {
    characters: [],
  };

  compareCharactersByThreat = (a, b) => {
    if (a.threat != b.threat) {
      return a.threat > b.threat ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  };

  updateCharacters(props) {
    const characters = props.characters.map((name) => {
      const character = {
        id: 0,
        name,
        corporation: {},
        alliance: {},
        threat: 0,
        gangs: 0,
        kills: 0,
        losses: 0
      };

      EVE.queryIDs(name, 'character', true).then((json) => {
        if (!json.character) return;
        character.id = json.character[0];

        EVE.getCharacterAffiliation(character.id).then((affiliation) => {
          character.corporation.id = affiliation[0];
          if (affiliation.length > 1) character.alliance.id = affiliation[1];

          EVE.getNames(affiliation).then((names) => {
            character.corporation.name = names[0];
            if (names.length > 1) character.alliance.name = names[1];
            this.setState({ characters: this.state.characters });
          });
        });

        EVE.getCharacterKillboard(character.id).then((killboard) => {
          if (!killboard) return;
          character.threat = killboard.dangerRatio || 0;
          character.gangs = killboard.gangRatio || 0;
          character.kills = killboard.shipsDestroyed || 0;
          character.losses = killboard.shipsLost || 0;
          this.setState({ characters });
        });
      });

      return character;
    });
    this.setState({ characters });
  }

  componentDidMount() {
    this.updateCharacters(this.props);
  }

  componentWillReceiveProps(props) {
    this.updateCharacters(props);
  }

  render({}, { characters }) {
    const rows = characters.map((character) => {
      return (
        <Row id={character.id} name={character.name} corporation={character.corporation} alliance={character.alliance} threat={character.threat} gangs={character.gangs} kills={character.kills} losses={character.losses} />
      );
    });

    return (
      <section class="table">
        <table>
          <thead>
            <tr>
              <th style="width: 25%">Character</th>
              <th style="width: 25%">Corporation</th>
              <th style="width: 25%">Alliance</th>
              <th style="text-align: center"><abbr title="Threat">T</abbr></th>
              <th style="text-align: center"><abbr title="% of fights in gangs">G</abbr></th>
              <th style="text-align: right"><abbr title="Kills">K</abbr></th>
              <th><abbr title="Losses">L</abbr></th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </section>
    );
  }
}
