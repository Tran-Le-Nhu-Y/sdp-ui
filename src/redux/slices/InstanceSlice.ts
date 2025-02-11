import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<Instance, string>({
	selectId: (instance) => instance.id,
	// sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// By default, `createEntityAdapter` gives you `{ ids: [], entities: {} }`.
// If you want to track 'loading' or other keys, you would initialize them here:
// `getInitialState({ loading: false, activeRequestId: null })`
const initialState = entityAdapter.getInitialState({
	loading: false,
});

export const slice = createSlice({
	name: 'instances',
	initialState,
	reducers: {
		createInstance: (state, action: PayloadAction<Instance>) => {
			const newInstance = action.payload;
			entityAdapter.addOne(state, newInstance);
		},
		updateInstance: (state, action: PayloadAction<Instance>) => {
			const updateInstance = action.payload;
			entityAdapter.updateOne(state, {
				id: updateInstance.id,
				changes: {
					name: updateInstance.name,
					description: updateInstance.description,
				},
			});
		},
		deleteInstanceById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { createInstance, updateInstance, deleteInstanceById } =
	slice.actions;
export const { selectAll: selectAllInstances, selectById: selectInstanceById } =
	entityAdapter.getSelectors<RootState>((state) => state.instances);
export default slice.reducer;
