import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<Instance, string>({
	selectId: (module) => module.id,
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
		createModule: (state, action: PayloadAction<Instance>) => {
			const newModule = action.payload;
			entityAdapter.addOne(state, newModule);
		},
		updateModule: (state, action: PayloadAction<Instance>) => {
			const updateModule = action.payload;
			entityAdapter.updateOne(state, {
				id: updateModule.id,
				changes: {
					name: updateModule.name,
					description: updateModule.description,
				},
			});
		},
		deleteModuleById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { createModule, updateModule, deleteModuleById } = slice.actions;
export const { selectAll: selectAllModules, selectById: selectModuleById } =
	entityAdapter.getSelectors<RootState>((state) => state.modules);
export default slice.reducer;
