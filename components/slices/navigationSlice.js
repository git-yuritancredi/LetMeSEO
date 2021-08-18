import {createSlice} from "@reduxjs/toolkit";

export const navigationSlice = createSlice({
	name: 'navigation',
	initialState: {
		section: 'analyze'
	},
	reducers: {
		navigate: (state, action) => {
			state.section = action.payload;
		}
	}
})
export const {navigate} = navigationSlice.actions;
export default navigationSlice.reducer;
