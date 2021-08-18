import {configureStore} from '@reduxjs/toolkit';

export default configureStore({
	preloadedState: {
		config: {
			darkMode: false,
			saveHistory: false,
			language: 'en'
		}
	}
});
