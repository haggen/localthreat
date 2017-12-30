import { Component } from 'preact';
import ReactGA from 'react-ga';

import Welcome from './components/welcome';
import Notification from './components/notification';
import Table from './components/table';

import './resetize';
import './style';

ReactGA.initialize('UA-111407712-1');
ReactGA.pageview('/');

export default class App extends Component {
  state = {
    notification: '',
    paste: [],
  };

  handlePaste = (e) => {
    const clipboard = e.clipboardData || window.clipboardData;
    const text = clipboard.getData('Text');
    if (!text) return;
    let paste = [];
    const re = /<url=showinfo:13..\/\/.+?>(.+?)<\/url>/g;
    if (text.match(re)) {
      let match;
      while (match = re.exec(text)) {
        paste.push(match[1]);
      }
    } else {
      paste = text.split("\n");
    }
    let notification = '';
    if (paste.length > 500) {
      paste.splice(500);
      notification = `You pasted ${paste.length} names but it can only take up to 500.`;
    }
    paste = paste.filter((value, i) => paste.indexOf(value) === i);
    this.setState({ paste, notification });
  };

  render({}, { notification, paste }) {
    return (
      <main class="main" onPaste={this.handlePaste}>
        <h1 class="brand">
          <a href="/">localthreat</a>
        </h1>
        {notification ? (<Notification>{notification}</Notification>) : null}
        {paste.length ? (<Table paste={paste} />) : (<Welcome />)}
        <footer class="footer">
          <p class="footer__legal-1">&copy; 2017 Arthur Corenzan &middot; <a href="https://github.com/haggen/localthreat" target="blank" rel="noopener noreferrer">GitHub</a> &middot; Data provided by <a href="https://esi.tech.ccp.is/latest/" target="blank" rel="noopener noreferrer">ESI</a> and <a href="https://zkillboard.com/" target="blank" rel="noopener noreferrer">zKillboard</a> &middot; Tips go to <a href="https://zkillboard.com/character/95036967/" target="blank" rel="noopener noreferrer">Jason Chorant</a></p>
          <p class="footer__legal-2">EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf.</p>
        </footer>
      </main>
    );
  }
}
