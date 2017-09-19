import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Tomb from './Tomb';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Tomb />, document.getElementById('root'));
registerServiceWorker();
