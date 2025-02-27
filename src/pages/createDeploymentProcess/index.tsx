import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
	Accordion,
	AccordionSummary,
	Box,
	Button,
	LinearProgress,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { CollapsibleDataGrid, DragAndDropForm } from '../../components';
import { useEffect, useMemo, useState } from 'react';
import {
	useCreateDeploymentProcess,
	useGetAllCustomers,
	useGetAllVersionsBySoftwareVersionId,
	useGetAllVersionsByUserId,
} from '../../services';
import { DataGridProps, GridColDef } from '@mui/x-data-grid';
import { HideDuration, RoutePaths } from '../../utils';
import { useNotifications } from '@toolpad/core';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
		pageSize: 5,
	});
	const customers = useGetAllCustomers(customerQuery!, {
		skip: !customerQuery || customerQuery?.pageSize === 0,
	});
	const [selectedCustomer, setSelectedCustomer] = useState<{
		id: string;
		name: string;
	}>();

	const dataProps: DataGridProps = useMemo(
		() => ({
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
		}),
		[
			customers.data?.content,
			customers.data?.totalElements,
			customers.isLoading,
			onCustomerChange,
			selectedCustomer,
			t,
		]
	);

	const title = useMemo(
		() => selectedCustomer?.name ?? t('notSelected'),
		[selectedCustomer?.name, t]
	);

	return (
		<CollapsibleDataGrid
			expanded={open}
			label={t('customer')}
			title={title}
			dataProps={dataProps}
			onChange={(_e, expanded) => {
				onOpenChange(expanded);
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

	const dataProps: DataGridProps = useMemo(
		() => ({
			pageSizeOptions: [5, 10, 25],
			loading: pagingData.isLoading,
			rows: pagingData.data?.content,
			rowCount: pagingData?.data?.totalElements,
			columns: columns,
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
			expanded={open}
			label={t('software')}
			title={title}
			dataProps={dataProps}
			onChange={(_e, expanded) => {
				onOpenChange(expanded);
			}}
		/>
	);
}

function SelectModuleAndVersionSection({
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
			onPaginationModelChange: (model) =>
				setVersionQuery(
					(pre) =>
						pre && {
							...pre,
							pageNumber: model.page,
							pageSize: model.pageSize,
						}
				),
		}),
		[
			pagingData.isLoading,
			pagingData.data?.content,
			pagingData.data?.totalElements,
			columns,
			selectedModules,
			onModelChange,
		]
	);

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
			dataProps={dataProps}
			onChange={(_e, expanded) => {
				onOpenChange(expanded);
			}}
		/>
	);
}

export default function CreateDeploymentProcessPage() {
	const { t } = useTranslation();
	const notifications = useNotifications();
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
	const userId = 'd28bf637-280e-49b5-b575-5278b34d1dfe';

	const [createProcessTrigger, { isLoading: isCreateLoading }] =
		useCreateDeploymentProcess();

	const handleSubmit = async () => {
		function validate() {
			if (processCreating?.customerId === undefined) {
				notifications.show(t('customerNotSelected'), {
					autoHideDuration: HideDuration.fast,
					severity: 'info',
				});
				return false;
			}

			if (processCreating?.modules === undefined) {
				notifications.show(t('moduleNotSelected'), {
					autoHideDuration: HideDuration.fast,
					severity: 'info',
				});
				return false;
			}

			return true;
		}
		if (!validate()) return;

		try {
			const moduleVersionIds = processCreating?.modules?.map(
				(m) => m.versionId
			);
			const customerId = processCreating?.customerId;
			const softwareVersionId = processCreating?.software?.versionId;

			await createProcessTrigger({
				userId,
				customerId: customerId!,
				softwareVersionId: softwareVersionId!,
				moduleVersionIds: moduleVersionIds!,
			}).unwrap();
			notifications.show(t('createDeployProcessSuccess'), {
				autoHideDuration: HideDuration.fast,
				severity: 'success',
			});
			navigate(RoutePaths.DEPLOYMENT_PROCESS);
		} catch (error) {
			console.error(error);
			notifications.show(t('createDeployProcessError'), {
				autoHideDuration: HideDuration.fast,
				severity: 'error',
			});
		}
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
				{t('addDeploymentProcess')}
			</Typography>

			{isCreateLoading && <LinearProgress />}

			<Stack gap={1}>
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
							modules: undefined,
						}));
					}}
				/>

				<SelectModuleAndVersionSection
					softwareVersionId={processCreating?.software?.versionId}
					open={expandControl.module}
					onOpenChange={(isOpen) =>
						setExpandControl((pre) => ({ ...pre, module: isOpen }))
					}
					onModelChange={(modules) => {
						setProcessCreating((pre) => ({
							...pre,
							modules: modules.map(({ moduleId, versionId }) => ({
								id: moduleId,
								versionId: versionId,
							})),
						}));
					}}
				/>

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
