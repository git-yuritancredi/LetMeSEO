import {configureStore} from '@reduxjs/toolkit';
import configSlice from './slices/configSlice';
import navigationSlice from "./slices/navigationSlice";
import appSlice from "./slices/appSlice";
import historySlice from "./slices/historySlice";

export const mapState = (state) => {
	return {
		app: state.app,
		config: state.config,
		history: state.history,
		navigation: state.navigation
	};
};

export default configureStore({
	reducer: {
		app: appSlice,
		config: configSlice,
		history: historySlice,
		navigation: navigationSlice
	}
});
