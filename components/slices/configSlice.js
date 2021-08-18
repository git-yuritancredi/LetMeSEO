import {createSlice} from '@reduxjs/toolkit';
import electron from 'electron';

export const configSlice = createSlice({
	name: 'config',
	initialState: {
		darkMode: false,
		saveHistory: true,
		language: 'en'
	},
	reducers: {
		setConfig: (state, action) => {
			state.darkMode = action.payload.darkMode;
			state.saveHistory = action.payload.saveHistory;
			state.language = action.payload.language;
		},
		saveConfig: (state, action) => {
			electron.ipcRenderer.send('save-config', action.payload);
		}
	}
});
export const {setConfig, saveConfig} = configSlice.actions;
export default configSlice.reducer;
