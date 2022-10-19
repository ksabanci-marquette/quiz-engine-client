import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import Master from "./layout/Master";
import {REACT_PATH} from "./constants";

ReactDOM.render(
    <Router basename={REACT_PATH}>
        <Master />
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();
