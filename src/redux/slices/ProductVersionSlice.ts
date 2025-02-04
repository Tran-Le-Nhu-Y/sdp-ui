import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<ProductVersion, string>({
	selectId: (product) => product.id,
	// sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// By default, `createEntityAdapter` gives you `{ ids: [], entities: {} }`.
// If you want to track 'loading' or other keys, you would initialize them here:
// `getInitialState({ loading: false, activeRequestId: null })`
const initialState = entityAdapter.getInitialState({
	loading: false,
});

export const slice = createSlice({
	name: 'productVersions',
	initialState,
	reducers: {
		createProductVersion: (state, action: PayloadAction<ProductVersion>) => {
			const newProductVersion = action.payload;
			entityAdapter.addOne(state, newProductVersion);
		},
		updateProductVersion: (state, action: PayloadAction<ProductVersion>) => {
			const updateProductVersion = action.payload;
			entityAdapter.updateOne(state, {
				id: updateProductVersion.id,
				changes: {
					version: updateProductVersion.version,
					changelog: updateProductVersion.changelog,
				},
			});
		},
		deleteProductVersionById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const {
	createProductVersion,
	updateProductVersion,
	deleteProductVersionById,
} = slice.actions;
export const {
	selectAll: selectAllProductVersions,
	selectById: selectProductVersionById,
} = entityAdapter.getSelectors<RootState>((state) => state.productVersions);
export default slice.reducer;
