import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomDataGrid } from '../../components';
import { useGetAllModulesInProcess } from '../../services';
import {
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';

export default function ModuleTab({ processId }: { processId: number }) {
	const { t } = useTranslation('standard');
	const modulesQuery = useGetAllModulesInProcess(processId);

	const cols: GridColDef[] = useMemo(
		() => [
			{
				field: 'moduleName',
				editable: false,
				minWidth: 300,
				headerName: t('moduleName'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.module.name;
				},
				flex: 1,
			},
			{
				field: 'versionName',
				editable: false,
				minWidth: 200,
				headerName: t('version'),
				type: 'string',
				valueGetter: (_value, row) => {
					return row.version.name;
				},
				flex: 1,
			},
		],
		[t]
	);

	return (
		<CustomDataGrid
			slots={{
				toolbar: () => (
					<GridToolbarContainer>
						<GridToolbarFilterButton />
						<GridToolbarDensitySelector />
						<GridToolbarColumnsButton />
						<GridToolbarQuickFilter />
					</GridToolbarContainer>
				),
			}}
			rows={modulesQuery.data}
			columns={cols}
			pageSizeOptions={[5, 10, 15]}
			getRowId={(row) => row.version.id}
			initialState={{
				pagination: {
					paginationModel: {
						page: 0,
						pageSize: 5,
					},
				},
				sorting: {
					sortModel: [{ field: 'moduleName', sort: 'asc' }],
				},
			}}
		/>
	);
}
