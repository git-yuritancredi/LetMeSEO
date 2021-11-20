import {createSlice} from "@reduxjs/toolkit";

export const appSlice = createSlice({
	name: 'app',
	initialState: {
		logo: '../assets/images/logo_light.svg',
		storedAnalysis: null
	},
	reducers: {
		setLogo: (state, action) => {
			state.logo = action.payload;
		},
		setStoredAnalysis: (state, action) => {
			state.storedAnalysis = action.payload;
		}
	}
});

export const {setLogo, setStoredAnalysis} = appSlice.actions;
export default appSlice.reducer;
