import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { CollapsibleDataGrid, DragAndDropForm } from '../../components';
import { useMemo, useState } from 'react';
import { useGetAllCustomers, useGetAllVersionsByUserId } from '../../services';
import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { RoutePaths } from '../../utils';

interface FileAttachment {
	id: number;
	name: string;
	size: string;
	status: 'loading' | 'complete' | 'failed';
	progress: number;
	error?: string;
}

function SelectCustomerSection({
	open,
	onOpenChange,
	onCustomerChange,
}: {
	open: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onCustomerChange: (customerId: string | undefined) => void;
}) {
	const { t } = useTranslation('standard');
	const [customerQuery, setCustomerQuery] = useState<GetAllCustomerQuery>({
		pageNumber: 0,
		pageSize: 6,
	});
	const customers = useGetAllCustomers(customerQuery!, {
		skip: !customerQuery || customerQuery?.pageSize === 0,
	});
	const [selectedCustomer, setSelectedCustomer] = useState<{
		id: string;
		name: string;
	}>();

	return (
		<CollapsibleDataGrid
			open={open}
			label={t('customer')}
			title={selectedCustomer?.name ?? t('notSelected')}
			onOpenChange={onOpenChange}
			dataProps={{
				pageSizeOptions: [5, 10, 25],
				loading: customers.isLoading,
				rows: customers.data?.content,
				rowCount: customers?.data?.totalElements,
				columns: [
					{
						field: 'name',
						type: 'string',
						headerName: t('customerName'),
						sortable: false,
						editable: false,
						filterable: false,
						headerAlign: 'center',
						width: 400,
						minWidth: 250,
					},
					{
						field: 'email',
						type: 'string',
						headerName: t('email'),
						sortable: false,
						editable: false,
						filterable: false,
						headerAlign: 'center',
						align: 'center',
						width: 400,
						minWidth: 250,
					},
				],
				initialState: {
					pagination: {
						paginationModel: { pageSize: 5, page: 0 },
					},
				},
				checkboxSelection: true,
				disableMultipleRowSelection: true,
				getRowId: (row: Customer) => `${row.id}$${row.name}`,
				rowSelectionModel:
					selectedCustomer && `${selectedCustomer.id}$${selectedCustomer.name}`,
				onRowSelectionModelChange: (model) => {
					if (model.length === 1) {
						const [id, name] = model[0].toString().split('$');
						setSelectedCustomer({ id: id, name: name });
						onCustomerChange(id);
					} else {
						setSelectedCustomer(undefined);
						onCustomerChange(undefined);
					}
				},
				onPaginationModelChange: (model) =>
					setCustomerQuery((pre) => ({
						...pre,
						pageNumber: model.page,
						pageSize: model.pageSize,
					})),
			}}
		/>
	);
}

function SelectSoftwareAndVersionSection({
	open,
	onOpenChange,
	onModelChange,
}: {
	open: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onModelChange: (model?: { softwareId: string; versionId: string }) => void;
}) {
	const { t } = useTranslation('standard');
	const [selectedModel, setSelectedModel] = useState<SoftwareAndVersion>();
	const [versionQuery, setVersionQuery] =
		useState<GetAllSoftwareVersionByUserQuery>({
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
			softwareName: '',
			versionName: '',
			pageNumber: 0,
			pageSize: 6,
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
			`${selectedModel?.softwareName ?? t('notSelected')} - ${t('version')}: ${selectedModel?.versionName ?? t('notSelected')}`,
		[selectedModel?.softwareName, selectedModel?.versionName, t]
	);

	const dataProps: DataGridProps = useMemo(
		() => ({
			pageSizeOptions: [5, 10, 25],
			loading: pagingData.isLoading,
			rows: pagingData.data?.content,
			rowCount: pagingData?.data?.totalElements,
			columns: columns,
			initialState: {
				pagination: {
					paginationModel: { pageSize: 5, page: 0 },
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
			onPaginationModelChange: (model) =>
				setVersionQuery((pre) => ({
					...pre,
					pageNumber: model.page,
					pageSize: model.pageSize,
				})),
		}),
		[
			columns,
			onModelChange,
			selectedModel,
			pagingData.data?.content,
			pagingData.data?.totalElements,
			pagingData.isLoading,
		]
	);

	return (
		<CollapsibleDataGrid
			open={open}
			label={t('software')}
			title={title}
			onOpenChange={onOpenChange}
			dataProps={dataProps}
		/>
	);
}

function SelectModuleAndVersionSection({
	softwareVersionId,
	open,
	onOpenChange,
	onChange,
}: {
	softwareVersionId?: string;
	open: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onChange: (modules: Array<{ moduleId: string; versionId: string }>) => void;
}) {
	const { t } = useTranslation('standard');
	const [selectedModules, setSelectedModules] = useState<SoftwareAndVersion[]>(
		[]
	);
	const [versionQuery, setVersionQuery] =
		useState<GetAllSoftwareVersionByUserQuery>({
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
			softwareName: '',
			versionName: '',
			pageNumber: 0,
			pageSize: 6,
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
				width: 200,
				minWidth: 150,
			},
		],
		[t]
	);

	const title = useMemo(
		() => `${selectedModules.length} ${t('selected')}`,
		[selectedModules.length, t]
	);

	const dataProps: DataGridProps = useMemo(
		() => ({
			pageSizeOptions: [5, 10, 25],
			loading: pagingData.isLoading,
			rows: pagingData.data?.content,
			rowCount: pagingData?.data?.totalElements,
			columns: columns,
			initialState: {
				pagination: {
					paginationModel: { pageSize: 5, page: 0 },
				},
			},
			checkboxSelection: true,
			getRowId: (row: SoftwareAndVersion) =>
				`${row.softwareId}$${row.softwareName}$${row.versionId}$${row.versionName}`,
			rowSelectionModel: selectedModules.map(
				(model) =>
					`${model.softwareId}$${model.softwareName}$${model.versionId}$${model.versionName}`
			),
			onRowSelectionModelChange: (selectionModel) => {
				const modules = selectionModel.map((m) => {
					const [softwareId, softwareName, versionId, versionName] = m
						.toString()
						.split('$');
					return {
						softwareId,
						softwareName,
						versionId,
						versionName,
					};
				});
				setSelectedModules(modules);
				onChange(
					modules.map(({ softwareId, versionId }) => ({
						moduleId: softwareId,
						versionId: versionId,
					}))
				);
			},
			onPaginationModelChange: (model) =>
				setVersionQuery((pre) => ({
					...pre,
					pageNumber: model.page,
					pageSize: model.pageSize,
				})),
		}),
		[
			pagingData.isLoading,
			pagingData.data?.content,
			pagingData.data?.totalElements,
			columns,
			selectedModules,
			onChange,
		]
	);

	return (
		<CollapsibleDataGrid
			open={open}
			collapsible={(softwareVersionId?.length ?? 0) > 0}
			disableCollapsedHelperText={t('selectSoftwareBefore')}
			label={t('moduleList')}
			title={title}
			onOpenChange={onOpenChange}
			dataProps={dataProps}
		/>
	);
}

export default function CreateDeploymentProcessPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [expandControl, setExpandControl] = useState({
		customer: false,
		software: false,
		module: false,
	});
	const [processCreating, setProcessCreating] = useState<
		Partial<{
			customerId: string;
			software: { id: string; versionId: string };
			modules: Array<{ id: string; versionId: string }>;
		}>
	>();
	const [, setFiles] = useState<FileAttachment[]>([]);

	const handleSubmit = () => {
		navigate(RoutePaths.DEPLOYMENT_PROCESS);
	};
	const handleCancel = () => {
		navigate(RoutePaths.DEPLOYMENT_PROCESS);
	};

	const handleFilesChange = (uploadedFiles: FileAttachment[]) => {
		setFiles(uploadedFiles);
	};

	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addDeployProductInfor')}
			</Typography>

			<SelectCustomerSection
				open={expandControl.customer}
				onOpenChange={(isOpen) =>
					setExpandControl((pre) => ({ ...pre, customer: isOpen }))
				}
				onCustomerChange={(customerId) => {
					setProcessCreating((pre) => ({
						...pre,
						customerId,
					}));
				}}
			/>

			<SelectSoftwareAndVersionSection
				open={expandControl.software}
				onOpenChange={(isOpen) =>
					setExpandControl((pre) => ({ ...pre, software: isOpen }))
				}
				onModelChange={(model) => {
					setProcessCreating((pre) => ({
						...pre,
						software: model && {
							id: model.softwareId,
							versionId: model.versionId,
						},
					}));
				}}
			/>

			<SelectModuleAndVersionSection
				softwareVersionId={processCreating?.software?.versionId}
				open={expandControl.module}
				onOpenChange={(isOpen) =>
					setExpandControl((pre) => ({ ...pre, module: isOpen }))
				}
				onChange={(modules) => {
					setProcessCreating((pre) => ({
						...pre,
						modules: modules.map(({ moduleId, versionId }) => ({
							id: moduleId,
							versionId: versionId,
						})),
					}));
				}}
			/>

			<Stack mt={1}>
				<Typography variant="h6" sx={{ opacity: 0.8 }}>
					{t('description')}
				</Typography>
				<Box mb={1}>
					<TextField
						fullWidth
						size="medium"
						value={''}
						onChange={(e) => e.target.value}
						placeholder={`${t('enter')} ${t('description').toLowerCase()}...`}
						multiline
						rows={4}
					/>
				</Box>

				<DragAndDropForm onFilesChange={handleFilesChange} />
			</Stack>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button variant="contained" color="primary" onClick={handleSubmit}>
					{t('submit')}
				</Button>
				<Button variant="outlined" color="secondary" onClick={handleCancel}>
					{t('cancel')}
				</Button>
			</Box>
		</Stack>
	);
}
