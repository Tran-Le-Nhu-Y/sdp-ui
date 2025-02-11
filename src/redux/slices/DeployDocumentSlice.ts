import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<DeployDocument, string>({
	selectId: (deploydocument) => deploydocument.id,
	// sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// By default, `createEntityAdapter` gives you `{ ids: [], entities: {} }`.
// If you want to track 'loading' or other keys, you would initialize them here:
// `getInitialState({ loading: false, activeRequestId: null })`
const initialState = entityAdapter.getInitialState({
	loading: false,
});

export const slice = createSlice({
	name: 'deployDocuments',
	initialState,
	reducers: {
		createDeployDocument: (state, action: PayloadAction<DeployDocument>) => {
			const newDeployDocument = action.payload;
			entityAdapter.addOne(state, newDeployDocument);
		},
		updateDeployDocument: (state, action: PayloadAction<DeployDocument>) => {
			const updateDeployDocument = action.payload;
			entityAdapter.updateOne(state, {
				id: updateDeployDocument.id,
				changes: {
					name: updateDeployDocument.name,
				},
			});
		},
		deleteDeployDocumentById: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			entityAdapter.removeOne(state, id);
		},
	},
	// extraReducers: (builder) => {},
});

// Action creators are generated for each case reducer function
export const {
	createDeployDocument,
	updateDeployDocument,
	deleteDeployDocumentById,
} = slice.actions;
export const {
	selectAll: selectAllDeployDocuments,
	selectById: selectDeployDocumentById,
} = entityAdapter.getSelectors<RootState>((state) => state.deployDocuments);
export default slice.reducer;
