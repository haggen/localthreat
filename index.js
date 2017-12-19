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

  onPaste = (e) => {
    const clipboard = e.clipboardData || window.clipboardData;
    const text = clipboard.getData('Text');
    if (!text) return;
    const paste = text.split("\n").map((name) => {
      return { name, dangerRatio: 0 };
    });
    let notification = '';
    if (paste.length > 500) {
      paste.splice(500);
      notification = 'Natural phenomena disrupts this paste (only 500 names at a time).';
    }
    this.setState({ paste, notification });
  };

  render({}, { notification, paste }) {
    return (
      <main onPaste={this.onPaste}>
        {notification ? (<Notification text={notification} />) : ''}
        {paste.length ? (<Table characters={paste} />) : (<Welcome />)}
        <footer class="footer">
          <p class="footer__legal-1"><a href="https://localthreat.xyz">localthreat.xyz</a> &copy; 2017 Arthur Corenzan &middot; <a href="https://github.com/haggen/localthreat" target="blank" rel="noopener noreferrer">GitHub</a> &middot; Data provided by <a href="https://esi.tech.ccp.is/latest/" target="blank" rel="noopener noreferrer">ESI</a> and <a href="https://zkillboard.com/" target="blank" rel="noopener noreferrer">zKillboard</a> &middot; Tips go to <a href="https://zkillboard.com/character/95036967/" target="blank" rel="noopener noreferrer">Jason Chorant</a></p>
          <p class="footer__legal-2">EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. CCP hf. has granted permission to localthreat.xyz to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with, localthreat.xyz. CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.</p>
        </footer>
      </main>
    );
  }
}
