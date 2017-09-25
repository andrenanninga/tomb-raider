import React, { PureComponent } from 'react';
import { Deck, Slide, Heading, CodePane, defaultTheme } from 'spectacle';

import Tomb from '../Tomb';
import SlideTextiles from './SlideTextiles';

export default class Presentation extends PureComponent { 
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Deck
				transition="slide"
				progress="bar"
				theme={defaultTheme}
				contentHeight={window.innerHeight}
				contentWidth={window.innerWidth}
			>
				<Slide>
					<div>
						<SlideTextiles />
					</div>
				</Slide>
			</Deck>
		)
	}
}
