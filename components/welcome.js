import { Component } from 'preact';

export default class Welcome extends Component {
  render() {
    return (
      <section class="welcome">
        <h1 class="welcome__heading">Paste your <strong>Local</strong> here...</h1>
        <p class="welcome__instruction">Simply press <code>CTRL+V</code> (or <code>COMMAND+V</code> in macOS) and it'll fetch character's affiliations, threat level, and other combat stats.</p>
      </section>
    );
  }
}
