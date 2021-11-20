import {createSlice} from "@reduxjs/toolkit";

export const historySlice = createSlice({
	name: 'history',
	initialState: {
		items: []
	},
	reducers: {
		setHistory: (state, action) => {
			state.items = action.payload;
		}
	}
});

export const {setHistory} = historySlice.actions;
export default historySlice.reducer;
