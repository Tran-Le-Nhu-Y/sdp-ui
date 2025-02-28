import { useTranslation } from 'react-i18next';
import { FilterDialog, PaginationTable } from '../../components';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	TableRow,
	TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import {
	useCreateDeploymentPhaseType,
	useDeleteDeploymentPhaseType,
	useGetAllDeploymentPhaseTypesByUserId,
	useGetDeploymentPhaseTypeById,
	useUpdateDeploymentPhaseType,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import React from 'react';
import { t } from 'i18next';

function CreateDeploymentPhaseTypeFormDialog() {
	const [open, setOpen] = React.useState(false);
	const [formData, setFormData] = useState({ name: '', description: '' });

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const [createDeploymentPhaseTypeTrigger, { isLoading: isCreateLoading }] =
		useCreateDeploymentPhaseType();
	const notifications = useNotifications();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const newType: DeploymentPhaseTypeCreateRequest = {
			name: formData.name.trim(),
			description: formData.description.trim(),
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		};

		if (!newType.name) {
			notifications.show(t('processTypeNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await createDeploymentPhaseTypeTrigger(newType);
			notifications.show(t('createProcessTypeSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createProcessTypeError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}

		handleClose();
	};

	return (
		<React.Fragment>
			<Button variant="contained" onClick={handleClickOpen}>
				{t('addProcessType')}
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{t('addProcessTypeInfor')}</DialogTitle>
					<DialogContent>
						{isCreateLoading && <LinearProgress />}
						<TextField
							autoFocus
							required
							margin="dense"
							id="name"
							name="name"
							label={t('processTypeName')}
							type="name"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							id="description"
							name="description"
							label={t('description')}
							type="text"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>{t('cancel')}</Button>
						<Button type="submit">{t('submit')}</Button>
					</DialogActions>
				</form>
			</Dialog>
		</React.Fragment>
	);
}

interface UpdateDeploymentPhaseTypeProps {
	typeId: string;
	open: boolean;
	onClose: () => void;
}

function UpdateDeploymentPhaseTypeFormDialog({
	typeId,
	open,
	onClose,
}: UpdateDeploymentPhaseTypeProps) {
	const [formData, setFormData] = useState({ name: '', description: '' });
	const notifications = useNotifications();
	const type = useGetDeploymentPhaseTypeById(typeId!, { skip: !typeId });
	useEffect(() => {
		if (type.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (type.isSuccess)
			setFormData({
				name: type.data.name,
				description: type.data.description ?? '',
			});
	}, [notifications, type.isError, type.isSuccess, type.data]);
	const [updateDeploymentPhaseTypeTrigger, { isLoading: isUpdateLoading }] =
		useUpdateDeploymentPhaseType();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const updatingType: DeploymentPhaseTypeUpdateRequest = {
			name: formData.name.trim(),
			description: formData.description.trim(),
			typeId: typeId!,
		};

		if (!updatingType.name) {
			notifications.show(t('processTypeNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await updateDeploymentPhaseTypeTrigger(updatingType);
			notifications.show(t('updateProcessTypeSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateProcessTypeError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}

		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{t('editCustomer')}</DialogTitle>
				<DialogContent>
					{(type.isLoading || isUpdateLoading) && <LinearProgress />}
					<TextField
						autoFocus
						required
						margin="dense"
						id="name"
						name="name"
						label={t('processTypeName')}
						type="text"
						fullWidth
						variant="standard"
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						required
						margin="dense"
						id="description"
						name="description"
						label={t('description')}
						type="text"
						fullWidth
						variant="standard"
						value={formData.description}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>{t('cancel')}</Button>
					<Button type="submit">{t('submit')}</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default function DeploymentPhaseTypePage() {
	const { t } = useTranslation();
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const [deploymentPhaseTypeQuery, setDeploymentPhaseTypeQuery] =
		useState<GetAllDeploymentPhaseTypeQuery>({
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
			name: '',
			pageNumber: 0,
			pageSize: 6,
		});
	const types = useGetAllDeploymentPhaseTypesByUserId(
		deploymentPhaseTypeQuery!,
		{
			skip: !deploymentPhaseTypeQuery,
		},
	);
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
							key: 'customerName',
							label: t('customerName'),
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
							customerName: '',
						}));
					}}
				/>

				<CreateDeploymentPhaseTypeFormDialog />
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
