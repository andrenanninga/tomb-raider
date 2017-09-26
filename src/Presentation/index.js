import React, { PureComponent } from 'react';
import { Deck, Slide, Heading, Appear, Layout, Fit, defaultTheme } from 'spectacle';
import axios from 'axios';

import Tomb from '../Tomb';
import SlideTextiles from './slides/Textiles';

export default class Presentation extends PureComponent { 
	render() {
		return (
			<Deck
				transition="slide"
				progress="bar"
				theme={defaultTheme}
				contentHeight={window.innerHeight}
				contentWidth={window.innerWidth}
			>
				<SlideTextiles hash="textiles" />
				<Slide hash="something">
					<Heading>Hello</Heading>
					<Appear>
						<Heading>one</Heading>
					</Appear>
					<Appear>
						<Heading>two</Heading>
					</Appear>
				</Slide>
			</Deck>
		)
	}
}
