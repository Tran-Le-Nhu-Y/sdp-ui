import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FilterDialog, PaginationTable } from '../../components';
import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { hideDuration, RoutePaths } from '../../utils';
import {
	useDeleteDeploymentProcess,
	useGetAllDeploymentProcesses,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';

export default function DeploymentProcessPage() {
	const navigate = useNavigate();
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [processQuery, setProcessQuery] =
		useState<GetAllDeploymentProcessQuery>({
			customerName: null,
			softwareVersionName: null,
			status: undefined,
			pageNumber: 0,
			pageSize: 5,
		});

	const processes = useGetAllDeploymentProcesses(processQuery);
	useEffect(() => {
		if (processes.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
	}, [notifications, processes.isError, t]);

	const [deleteProcessTrigger, deleteProcess] = useDeleteDeploymentProcess();

	const handleDeleteProcess = async (processId: number) => {
		const confirmed = await dialogs.confirm('', {
			okText: t('yes'),
			cancelText: t('cancel'),
			severity: 'warning',
			title: t('deleteDeploymentProcessConfirm'),
		});
		if (!confirmed) return;

		try {
			await deleteProcessTrigger(processId);
			notifications.show(t('deleteDeploymentProcessSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('deleteDeploymentProcessError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
			console.error(error);
		}
	};

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
					filters={[
						{
							key: 'softwareVersionName',
							label: t('softwareName'),
						},
						{
							key: 'customerName',
							label: t('softwareName'),
						},
						{
							key: 'status',
							label: t('softwareName'),
						},
					]}
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
							softwareVersionName: null,
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
						<TableCell key="deployFor">{t('deployFor')}</TableCell>
						<TableCell key="status" align="center">
							{t('status')}
						</TableCell>
						<TableCell key="startDate" align="center">
							{t('startDate')}
						</TableCell>
						<TableCell key="endDate" align="center">
							{t('endDate')}
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
						<TableCell key={`${row.id}-deployFor`}>
							{row.customer.name}
						</TableCell>
						<TableCell key={`${row.id}-status`} align="center">
							{row.status}
						</TableCell>
						<TableCell key={`${row.id}-startDate`} align="center">
							{row.createdAt}
						</TableCell>
						<TableCell key={`${row.id}-endDate`} align="center">
							{row.updatedAt}
						</TableCell>

						<TableCell>
							<Stack direction="row">
								<IconButton size="small" onClick={() => {}}>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<IconButton size="small" onClick={() => {}}>
									<EditIcon color="info" />
								</IconButton>
								<IconButton
									size="small"
									onClick={() => handleDeleteProcess(row.id)}
								>
									<DeleteIcon color="error" />
								</IconButton>
							</Stack>
						</TableCell>
					</TableRow>
				)}
			/>
		</Box>
	);
}
