import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FilterDialog, Guard, PaginationTable } from '../../components';
import { useEffect, useMemo, useState } from 'react';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	TableRow,
} from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
	getDeploymentProcessStatusTransKey,
	HideDuration,
	PathHolders,
	RoutePaths,
} from '../../utils';
import {
	useDeleteDeploymentProcess,
	useGetAllDeploymentProcesses,
} from '../../services';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import EditIcon from '@mui/icons-material/Edit';
import { Filter } from '../../components/FilterDialog';

export default function DeploymentProcessPage() {
	const navigate = useNavigate();
	const { t } = useTranslation('standard');
	const userId = useSession()?.user?.id;
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [processQuery, setProcessQuery] = useState<
		Partial<GetAllDeploymentProcessQuery>
	>({
		pageNumber: 0,
		pageSize: 5,
	});

	const processes = useGetAllDeploymentProcesses(
		{ ...processQuery, userId: userId! },
		{
			skip: !userId,
		}
	);
	useEffect(() => {
		if (processes.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, processes.isError, t]);

	const [deleteProcessTrigger, deleteProcess] = useDeleteDeploymentProcess();

	const handleDeleteProcess = async (processId: number) => {
		const confirmed = await dialogs.confirm(
			t('deleteDeploymentProcessConfirm'),
			{
				okText: t('yes'),
				cancelText: t('cancel'),
				severity: 'error',
				title: t('deleteDeploymentProcess'),
			}
		);
		if (!confirmed) return;

		try {
			await deleteProcessTrigger(processId);
			notifications.show(t('deleteDeploymentProcessSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('deleteDeploymentProcessError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	const handleSetupProcess = (processId: number) => {
		navigate(
			RoutePaths.SETUP_DEPLOYMENT_PROCESS.replace(
				`:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
				`${processId}`
			)
		);
	};

	const handleViewProcess = (processId: number) => {
		navigate(
			RoutePaths.DEPLOYMENT_PROCESS_DETAIL.replace(
				`:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
				`${processId}`
			)
		);
	};

	const filters = useMemo(
		() =>
			[
				{
					key: 'softwareVersionName',
					label: t('softwareName'),
				},
				{
					key: 'customerName',
					label: t('customer'),
				},
				{
					key: 'status',
					label: t('status'),
					type: 'select',
					selectOptions: [
						{
							key: 'INIT',
							value: t(getDeploymentProcessStatusTransKey('INIT')),
						},
						{
							key: 'PENDING',
							value: t(getDeploymentProcessStatusTransKey('PENDING')),
						},
						{
							key: 'IN_PROGRESS',
							value: t(getDeploymentProcessStatusTransKey('IN_PROGRESS')),
						},
						{
							key: 'DONE',
							value: t(getDeploymentProcessStatusTransKey('DONE')),
						},
					],
				},
			] as Filter[],
		[t]
	);

	return (
		<Box>
			{(processes.isLoading || deleteProcess.isLoading) && <LinearProgress />}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<FilterDialog
					filters={filters}
					open={filterDialogOpen}
					onClose={() => setFilterDialogOpen(false)}
					onOpen={() => setFilterDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						setProcessQuery((prev) => ({
							...prev,
							...query,
						}));
					}}
					onReset={() => {
						setProcessQuery((prev) => ({
							...prev,
							softwareName: null,
							customerName: null,
							status: undefined,
						}));
					}}
				/>
				<Button
					variant="contained"
					onClick={() => navigate(RoutePaths.CREATE_DEPLOYMENT_PROCESS)}
				>
					{t('createDeployProcess')}
				</Button>
			</Stack>
			<PaginationTable
				headers={
					<>
						<TableCell key="softwareName">{t('softwareName')}</TableCell>
						<TableCell key="deployFor" align="center">
							{t('deployFor')}
						</TableCell>
						<TableCell key="status" align="center">
							{t('status')}
						</TableCell>
						<TableCell key="createdAt" align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key="updatedAt" align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell />
						<TableCell />
					</>
				}
				count={processes.data?.totalElements ?? 0}
				rows={processes.data?.content ?? []}
				pageNumber={processQuery.pageNumber ?? 0}
				pageSize={processQuery.pageSize ?? 0}
				onPageChange={(newPage) =>
					setProcessQuery((prev) => ({ ...prev, ...newPage }))
				}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`${row.id}-softwareName`}>
							{row.software.name}
						</TableCell>
						<TableCell key={`${row.id}-deployFor`} align="center">
							{row.customer.name}
						</TableCell>
						<TableCell key={`${row.id}-status`} align="center">
							{t(getDeploymentProcessStatusTransKey(row.status))}
						</TableCell>
						<TableCell key={`${row.id}-createdAt`} align="center">
							{row.createdAt}
						</TableCell>
						<TableCell key={`${row.id}-updatedAt`} align="center">
							{row.updatedAt}
						</TableCell>

						<TableCell>
							<Stack direction="row">
								<IconButton
									size="small"
									onClick={() => handleViewProcess(row.id)}
								>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<Guard requiredRoles={['software_admin']}>
									<IconButton
										size="small"
										onClick={() => handleSetupProcess(row.id)}
									>
										<EditIcon color="info" />
									</IconButton>
									<IconButton
										size="small"
										onClick={() => handleDeleteProcess(row.id)}
									>
										<DeleteIcon color="error" />
									</IconButton>
								</Guard>
							</Stack>
						</TableCell>
					</TableRow>
				)}
			/>
		</Box>
	);
}
