import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main/Main.js';

window.onload = () => {
    ReactDOM.render(<Main />, document.getElementById('main-dom'));
};