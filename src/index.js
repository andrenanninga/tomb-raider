import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Presentation from './Presentation';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Presentation />, document.getElementById('root'));
registerServiceWorker();
