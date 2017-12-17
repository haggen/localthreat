import { Component } from 'preact';

import Table from './components/table';
import Welcome from './components/welcome';

import './resetize';
import './style';

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
			</main>
		);
	}
}
