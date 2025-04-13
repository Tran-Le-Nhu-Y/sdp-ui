import { useTranslation } from 'react-i18next';
import { CollapsibleDataGrid } from '../../components';
import { useMemo, useState } from 'react';
import { useGetAllVersionsByUserId } from '../../services';
import { GridColDef } from '@mui/x-data-grid';

export default function SelectSoftwareAndVersionSection({
	userId,
	open,
	onOpenChange,
	onModelChange,
}: {
	userId: string;
	open: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onModelChange: (model?: { softwareId: string; versionId: string }) => void;
}) {
	const { t } = useTranslation('standard');
	const [selectedModel, setSelectedModel] = useState<SoftwareAndVersion>();
	const [versionQuery, setVersionQuery] =
		useState<GetAllSoftwareVersionByUserQuery>({
			userId: userId,
			softwareName: '',
			versionName: '',
			pageNumber: 0,
			pageSize: 5,
		});
	const pagingData = useGetAllVersionsByUserId(versionQuery, {
		skip: versionQuery.pageSize === 0,
	});

	const columns: GridColDef[] = useMemo(
		() => [
			{
				field: 'softwareName',
				type: 'string',
				headerName: t('softwareName'),
				sortable: false,
				editable: false,
				filterable: false,
				headerAlign: 'center',
				width: 450,
				minWidth: 250,
			},
			{
				field: 'versionName',
				type: 'string',
				headerName: t('version'),
				sortable: false,
				editable: false,
				filterable: false,
				headerAlign: 'center',
				align: 'center',
				width: 200,
				minWidth: 150,
			},
		],
		[t]
	);

	const title = useMemo(
		() =>
			selectedModel
				? `${selectedModel.softwareName} - ${t('version')}: ${selectedModel.versionName}`
				: t('notSelected'),
		[selectedModel, t]
	);

	return (
		<CollapsibleDataGrid
			expanded={open}
			label={t('software')}
			title={title}
			dataProps={{
				pageSizeOptions: [5, 10, 25],
				loading: pagingData.isLoading,
				rows: pagingData.data?.content,
				rowCount: pagingData?.data?.totalElements,
				columns: columns,
				initialState: {
					pagination: {
						paginationModel: {
							page: 0,
							pageSize: 5,
						},
					},
				},
				checkboxSelection: true,
				disableMultipleRowSelection: true,
				getRowId: (row: SoftwareAndVersion) =>
					`${row.softwareId}$${row.softwareName}$${row.versionId}$${row.versionName}`,
				rowSelectionModel:
					selectedModel &&
					`${selectedModel.softwareId}$${selectedModel.softwareName}$${selectedModel.versionId}$${selectedModel.versionName}`,
				onRowSelectionModelChange: (model) => {
					if (model.length === 1) {
						const [softwareId, softwareName, versionId, versionName] = model[0]
							.toString()
							.split('$');
						setSelectedModel({
							softwareId,
							softwareName,
							versionId,
							versionName,
						});
						onModelChange({ softwareId, versionId });
					} else {
						setSelectedModel(undefined);
						onModelChange(undefined);
					}
				},
				paginationModel: {
					pageSize: versionQuery.pageSize ?? 5,
					page: versionQuery.pageNumber ?? 0,
				},
				onPaginationModelChange: (model) =>
					setVersionQuery((pre) => ({
						...pre,
						pageNumber: model.page,
						pageSize: model.pageSize,
					})),
			}}
			onChange={(_e, expanded) => {
				onOpenChange(expanded);
			}}
		/>
	);
}
