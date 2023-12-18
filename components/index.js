import React from 'react';
import store from './store';
import Main from './Main/Main.js';
import {Provider} from 'react-redux';
import {createRoot} from "react-dom/client";

window.onload = () => {
    const root = createRoot(document.getElementById('main-dom'));
    root.render(
        <Provider store={store}>
            <Main />
        </Provider>
    );
};
