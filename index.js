import { Component } from 'preact';
import ReactGA from 'react-ga';

import Welcome from './components/welcome';
import { Notification } from './components/notification';
import Table from './components/table';

import { PasteRepository } from './repositories/paste';

import './stylesheets/resetize';
import './stylesheets/style';
import './stylesheets/small';
import './stylesheets/large';

ReactGA.initialize('UA-111407712-1');

export default class App extends Component {
  state = {
    loading: false,
    notification: null,
    paste: null,
  };

  handlePaste = (e) => {
    const clipboard = e.clipboardData || window.clipboardData;
    const text = clipboard.getData('Text');
    if (!text) return;
    this.setState({ loading: true });
    let contents = [];
    const re = /<url=showinfo:13..\/\/.+?>(.+?)<\/url>/g;
    if (text.match(re)) {
      let match;
      while (match = re.exec(text)) {
        contents.push(match[1]);
      }
    } else {
      contents = text.split("\n");
    }
    let notification;
    if (contents.length > 500) {
      contents.splice(500);
      notification = (<p>You pasted {contents.length - 500} names over the limit of 500.</p>);
    }
    contents = contents.filter((value, i) => contents.indexOf(value) === i);
    PasteRepository.create(contents).then(paste => {
      this.setState({ paste, notification, loading: false });
    });
  };

  componentDidMount() {
    if (location.pathname != '/') {
      this.setState({ loading: true });
      PasteRepository.fetch(location.pathname.substr(1)).then(paste => {
        this.setState({ paste, loading: false });
      }).catch(_ => {
        this.setState({ notification: (<p>Couldn't find the scan you requested.</p>), loading: false });
      });
    } else {
      ReactGA.pageview(location.pathname);
    }
  }

  componentWillUpdate(props, state) {
    if (state.paste && state.paste.id && state.paste != this.state.paste) {
      history.pushState(null, null, `/${state.paste.id}`);
      ReactGA.pageview(location.pathname);
    }
  }

  render({}, { notification, paste, loading }) {
    return (
      <main class={`main${loading ? ' main--loading' : ''}`} onPaste={this.handlePaste}>
        <h1 class="brand">
          <a href="/">
            <span class="plate">localthreat</span>
          </a>
        </h1>
        <Notification>{notification}</Notification>
        {paste ? (<Table paste={paste} />) : (<Welcome />)}
        <footer class="footer">
          <p class="footer__legal-1">&copy; 2017 Arthur Corenzan &middot; <a href="https://github.com/haggen/localthreat" target="blank" rel="noopener noreferrer"><span class="plate">GitHub</span></a> &middot; Data provided by <a href="https://esi.evetech.net/latest/" target="blank" rel="noopener noreferrer"><span class="plate">ESI</span></a> and <a href="https://zkillboard.com/" target="blank" rel="noopener noreferrer"><span class="plate">zKillboard</span></a> &middot; Tips go to <a href="https://zkillboard.com/character/95036967/" target="blank" rel="noopener noreferrer"><span class="plate">Jason Chorant</span></a></p>
          <p class="footer__legal-2">EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf.</p>
        </footer>
      </main>
    );
  }
}
