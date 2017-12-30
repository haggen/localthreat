import { Component } from 'preact';

export default class Welcome extends Component {
  render() {
    return (
      <section class="welcome">
        <h1 class="welcome__heading">Paste your <strong>Local</strong> here...</h1>
        <p class="welcome__instruction">Press <code>CTRL+V</code> (or <code>COMMAND+V</code> in macOS) to get characters affiliations and PvP stats.</p>
      </section>
    );
  }
}
