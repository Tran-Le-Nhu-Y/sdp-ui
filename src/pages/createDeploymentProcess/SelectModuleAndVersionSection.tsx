import { useTranslation } from 'react-i18next';
import {
	Accordion,
	AccordionSummary,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { CollapsibleDataGrid } from '../../components';
import { useEffect, useMemo, useState } from 'react';
import { useGetAllVersionsBySoftwareVersionId } from '../../services';
import { GridColDef } from '@mui/x-data-grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SelectModuleAndVersionSection({
	softwareVersionId,
	open,
	onOpenChange,
	onModelChange,
}: {
	softwareVersionId?: string;
	open: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onModelChange: (
		modules: Array<{ moduleId: string; versionId: string }>
	) => void;
}) {
	const { t } = useTranslation('standard');
	const [selectedModules, setSelectedModules] = useState<ModuleAndVersion[]>(
		[]
	);
	const [versionQuery, setVersionQuery] = useState<
		Partial<GetAllModuleVersionBySoftwareVersionQuery>
	>({
		softwareVersionId: softwareVersionId,
		moduleName: '',
		versionName: '',
		pageNumber: 0,
		pageSize: 5,
	});

	useEffect(() => {
		if (softwareVersionId === versionQuery.softwareVersionId) return;
		setVersionQuery((pre) => ({ ...pre, softwareVersionId }));
		setSelectedModules([]);
	}, [softwareVersionId, versionQuery.softwareVersionId]);

	const pagingData = useGetAllVersionsBySoftwareVersionId(
		{ softwareVersionId: versionQuery.softwareVersionId!, ...versionQuery },
		{
			skip: !versionQuery.softwareVersionId || versionQuery.pageSize === 0,
		}
	);

	const columns: GridColDef[] = useMemo(
		() => [
			{
				field: 'moduleName',
				type: 'string',
				headerName: t('moduleName'),
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
				width: 200,
				minWidth: 150,
			},
		],
		[t]
	);

	const title = `${selectedModules.length} ${t('selected')}`;

	if ((softwareVersionId?.length ?? 0) <= 0)
		return (
			<Tooltip followCursor title={t('selectSoftwareBefore')}>
				<Accordion disabled>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Stack direction={'row'} gap={1}>
							<Typography variant="h6" sx={{ opacity: 0.8 }}>
								{t('moduleList')}:
							</Typography>
							<Typography
								variant="h6"
								overflow={'hidden'}
								textOverflow={'ellipsis'}
								sx={{ maxWidth: 600, fontWeight: 10, opacity: 0.8 }}
							>
								{title}
							</Typography>
						</Stack>
					</AccordionSummary>
				</Accordion>
			</Tooltip>
		);
	return (
		<CollapsibleDataGrid
			label={t('moduleList')}
			expanded={open}
			title={title}
			dataProps={{
				pageSizeOptions: [5, 10, 25],
				loading: pagingData.isLoading || pagingData.isFetching,
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
				getRowId: (row: ModuleAndVersion) =>
					`${row.moduleId}$${row.moduleName}$${row.versionId}$${row.versionName}`,
				rowSelectionModel: selectedModules.map(
					(model) =>
						`${model.moduleId}$${model.moduleName}$${model.versionId}$${model.versionName}`
				),
				onRowSelectionModelChange: (selectionModel) => {
					const modules = selectionModel.map((m) => {
						const [moduleId, moduleName, versionId, versionName] = m
							.toString()
							.split('$');
						return {
							moduleId,
							moduleName,
							versionId,
							versionName,
						};
					});
					setSelectedModules(modules);
					onModelChange(
						modules.map(({ moduleId, versionId }) => ({
							moduleId: moduleId,
							versionId: versionId,
						}))
					);
				},
				paginationModel: {
					pageSize: versionQuery.pageSize ?? 5,
					page: versionQuery.pageNumber ?? 0,
				},
				onPaginationModelChange: (model) =>
					setVersionQuery(
						(pre) =>
							pre && {
								...pre,
								pageNumber: model.page,
								pageSize: model.pageSize,
							}
					),
			}}
			onChange={(_e, expanded) => {
				onOpenChange(expanded);
			}}
		/>
	);
}
