import { Component } from 'preact';
import ReactGA from 'react-ga';

import Table from './components/table';
import Welcome from './components/welcome';

import './resetize';
import './style';

ReactGA.initialize('UA-111407712-1');
ReactGA.pageview('/');

export default class App extends Component {
	state = {
		characters: [],
	};

	onPaste = (e) => {
		const clipboard = e.clipboardData || window.clipboardData;
		const text = clipboard.getData('Text');
		if (!text) return;
    const characters = text.split("\n").map((name) => {
      return { name, dangerRatio: 0 };
    });
		this.setState({ characters });
	};

	render({}, { characters }) {
		return (
			<main onPaste={this.onPaste}>
				{characters.length ? (<Table characters={characters} />) : (<Welcome />)}
				<footer class="foot">
					<p class="localthreat">
						<a href="https://localthreat.xyz">localthreat.xyz</a> &copy; 2017 Arthur Corenzan &middot; <a href="https://github.com/haggen/localthreat" target="blank" rel="noopener noreferrer">GitHub</a> &middot; Tips go to <a href="https://zkillboard.com/character/95036967/" target="blank" rel="noopener noreferrer">Jason Chorant</a>
					</p>
					<p class="ccp">EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. CCP hf. has granted permission to zKillboard.com to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with, zKillboard.com. CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.</p>
				</footer>
			</main>
		);
	}
}
