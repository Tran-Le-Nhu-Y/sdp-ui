import { useTranslation } from 'react-i18next';
import { FilterDialog, PaginationTable } from '../../components';
import {
	Box,
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import {
	useDeleteDeploymentPhaseType,
	useGetAllDeploymentPhaseTypesByUserId,
} from '../../services';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import { HideDuration } from '../../utils';
import CreateDeploymentPhaseTypeFormDialog from './CreateDeploymentPhaseTypeFormDialog';
import UpdateDeploymentPhaseTypeFormDialog from './UpdateDeploymentPhaseTypeFormDialog';

export default function DeploymentPhaseTypePage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const [deploymentPhaseTypeQuery, setDeploymentPhaseTypeQuery] =
		useState<GetAllDeploymentPhaseTypeQuery>({
			userId: userId,
			name: '',
			pageNumber: 0,
			pageSize: 6,
		});
	const types = useGetAllDeploymentPhaseTypesByUserId(deploymentPhaseTypeQuery);
	useEffect(() => {
		if (types.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, types.isError, t]);

	const [deleteDeploymentPhaseTypeTrigger, deleteDeploymentPhaseType] =
		useDeleteDeploymentPhaseType();
	useEffect(() => {
		if (deleteDeploymentPhaseType.isError) {
			notifications.show(t('deleteProcessTypeError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		} else if (deleteDeploymentPhaseType.isSuccess) {
			notifications.show(t('deleteProcessTypeSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		}
	}, [
		deleteDeploymentPhaseType.isError,
		deleteDeploymentPhaseType.isSuccess,
		notifications,
		t,
	]);
	const handleDelete = async (typeId: string) => {
		const confirmed = await dialogs.confirm(t('deleteProcessTypeConfirm'), {
			title: t('deleteConfirm'),
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;
		await deleteDeploymentPhaseTypeTrigger(typeId);
	};

	const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const handleEditClick = (typeId: string) => {
		setSelectedTypeId(typeId);
		setIsEditDialogOpen(true);
	};

	if (deleteDeploymentPhaseType.isLoading) return <LinearProgress />;

	return (
		<Box>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<FilterDialog
					filters={[
						{
							key: 'name',
							label: t('deploymentPhaseType'),
						},
					]}
					open={filterVersionDialogOpen}
					onClose={() => setFilterVersionDialogOpen(false)}
					onOpen={() => setFilterVersionDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						setDeploymentPhaseTypeQuery((prev) => ({ ...prev, ...query }));
					}}
					onReset={() => {
						setDeploymentPhaseTypeQuery((prev) => ({
							...prev,
							name: '',
						}));
					}}
				/>

				<CreateDeploymentPhaseTypeFormDialog userId={userId} />
			</Stack>
			{types.isLoading ? (
				<LinearProgress />
			) : (
				<PaginationTable
					headers={
						<>
							<TableCell key={`processTypeName`} align="center">
								{t('processTypeName')}
							</TableCell>
							<TableCell key={`description`} align="center">
								{t('description')}
							</TableCell>
							<TableCell />
						</>
					}
					count={types.data?.numberOfElements ?? 0}
					rows={types.data?.content ?? []}
					onPageChange={(newPage) =>
						setDeploymentPhaseTypeQuery((prev) => {
							return { ...prev, ...newPage };
						})
					}
					getCell={(row) => (
						<TableRow key={row.id}>
							<TableCell key={`processTypeName`} align="center">
								{row.name}
							</TableCell>

							<TableCell key={`description`} align="center">
								{row.description}
							</TableCell>

							<TableCell>
								<Stack direction="row" justifyContent={'flex-end'}>
									<IconButton
										size="small"
										onClick={() => handleEditClick(row.id)}
									>
										<EditIcon color="info" />
									</IconButton>
									<IconButton size="small" onClick={() => handleDelete(row.id)}>
										<DeleteIcon color="error" />
									</IconButton>
								</Stack>
							</TableCell>
						</TableRow>
					)}
				/>
			)}
			{isEditDialogOpen && selectedTypeId && (
				<UpdateDeploymentPhaseTypeFormDialog
					typeId={selectedTypeId}
					open={isEditDialogOpen}
					onClose={() => setIsEditDialogOpen(false)}
				/>
			)}
		</Box>
	);
}
