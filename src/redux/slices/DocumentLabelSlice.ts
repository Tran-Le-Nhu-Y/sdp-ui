import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<SdpDocumentType, string>({
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
		createNewLabel: (state, action: PayloadAction<SdpDocumentType>) => {
			const newLabel = action.payload;
			entityAdapter.addOne(state, newLabel);
		},
		updateLabel: (state, action: PayloadAction<SdpDocumentType>) => {
			const updateLabel = action.payload;
			entityAdapter.updateOne(state, {
				id: updateLabel.id,
				changes: {
					name: updateLabel.name,
					description: updateLabel.description,
					color: updateLabel.color,
				},
			});
		},
		deleteLabelById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { createNewLabel, updateLabel, deleteLabelById } = slice.actions;
export const { selectAll: selectAllLabels } =
	entityAdapter.getSelectors<RootState>((state) => state.labels);
export default slice.reducer;
