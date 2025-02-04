import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface FileData {
	id: string;
	name: string;
	size: number;
}

const entityAdapter = createEntityAdapter<FileData, string>({
	selectId: (file) => file.id,
	// sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// By default, `createEntityAdapter` gives you `{ ids: [], entities: {} }`.
// If you want to track 'loading' or other keys, you would initialize them here:
// `getInitialState({ loading: false, activeRequestId: null })`
const initialState = entityAdapter.getInitialState({
	loading: false,
});

export const slice = createSlice({
	name: 'files',
	initialState,
	reducers: {
		createFile: (state, action: PayloadAction<FileData>) => {
			const newFile = action.payload;
			entityAdapter.addOne(state, newFile);
		},
		updateFile: (state, action: PayloadAction<FileData>) => {
			const updateFile = action.payload;
			entityAdapter.updateOne(state, {
				id: updateFile.id,
				changes: {
					name: updateFile.name,
					size: updateFile.size,
				},
			});
		},
		deleteFileById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const { createFile, updateFile, deleteFileById } = slice.actions;
export const { selectAll: selectAllFiles, selectById: selectFileById } =
	entityAdapter.getSelectors<RootState>((state) => state.files);
export default slice.reducer;
