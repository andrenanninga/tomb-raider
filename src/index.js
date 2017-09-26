import React from 'react';
import ReactDOM from 'react-dom';
import hamsters from 'hamsters.js';

import './index.css';
import Presentation from './Presentation';
import registerServiceWorker from './registerServiceWorker';

import Assault from './Assault';

ReactDOM.render(<Assault />, document.getElementById('root'));
hamsters.init();
registerServiceWorker();
