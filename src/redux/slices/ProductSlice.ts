import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<Software, string>({
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
	name: 'products',
	initialState,
	reducers: {
		createProduct: (state, action: PayloadAction<Software>) => {
			const newProduct = action.payload;
			entityAdapter.addOne(state, newProduct);
		},
		updateProduct: (state, action: PayloadAction<Software>) => {
			const updateProduct = action.payload;
			entityAdapter.updateOne(state, {
				id: updateProduct.id,
				changes: {
					name: updateProduct.name,
					description: updateProduct.description,
				},
			});
		},
		deleteProductById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { createProduct, updateProduct, deleteProductById } =
	slice.actions;
export const { selectAll: selectAllProducts, selectById: selectProductById } =
	entityAdapter.getSelectors<RootState>((state) => state.products);
export default slice.reducer;
