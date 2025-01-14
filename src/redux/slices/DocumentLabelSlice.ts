import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<DocumentLabel, string>({
	selectId: (label) => label.id,
	// sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// By default, `createEntityAdapter` gives you `{ ids: [], entities: {} }`.
// If you want to track 'loading' or other keys, you would initialize them here:
// `getInitialState({ loading: false, activeRequestId: null })`
const initialState = entityAdapter.getInitialState({
	loading: false,
});

export const slice = createSlice({
	name: 'labels',
	initialState,
	reducers: {
		createNewLabel: (state, action: PayloadAction<DocumentLabel>) => {
			const newLabel = action.payload;
			entityAdapter.addOne(state, newLabel);
		},
		deleteLabelById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { createNewLabel, deleteLabelById } = slice.actions;
export const { selectAll: selectAllLabels } =
	entityAdapter.getSelectors<RootState>((state) => state.labels);
export default slice.reducer;
