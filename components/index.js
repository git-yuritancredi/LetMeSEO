import React from 'react';
import {createRoot} from 'react-dom/client';
import Main from './Main/Main.js';
import {Provider} from 'react-redux';
import store from './store';

window.onload = () => {
    const root = createRoot(document.getElementById('main-dom'));
    root.render(<Provider store={store}><Main /></Provider>)
};
