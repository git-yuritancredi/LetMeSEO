import appSlice from "./slices/appSlice";
import configSlice from './slices/configSlice';
import {configureStore} from '@reduxjs/toolkit';
import historySlice from "./slices/historySlice";
import navigationSlice from "./slices/navigationSlice";

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
