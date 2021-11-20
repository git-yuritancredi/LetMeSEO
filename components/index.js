import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main/Main.js';
import {Provider} from 'react-redux';
import store from './store';

window.onload = () => {
    ReactDOM.render(
        <Provider store={store}>
            <Main />
        </Provider>,
        document.getElementById('main-dom')
    );
};
