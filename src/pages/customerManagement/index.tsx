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
	useCreateCustomer,
	useDeleteCustomer,
	useGetAllCustomers,
	useGetCustomerById,
	useUpdateCustomer,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import React from 'react';
import { t } from 'i18next';

function CreateCustomerFormDialog() {
	const [open, setOpen] = React.useState(false);
	const [formData, setFormData] = useState({ name: '', email: '' });

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

	const [createCustomerTrigger, { isLoading: isCreateLoading }] =
		useCreateCustomer();
	const notifications = useNotifications();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const newCustomer: CustomerCreateRequest = {
			name: formData.name.trim(),
			email: formData.email.trim(),
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		};

		if (!newCustomer.name) {
			notifications.show(t('customerNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await createCustomerTrigger(newCustomer);
			notifications.show(t('createCustomerSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createCustomerError'), {
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
				{t('addCustomer')}
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{t('addCustomerInfor')}</DialogTitle>
					<DialogContent>
						{isCreateLoading && <LinearProgress />}
						<TextField
							autoFocus
							required
							margin="dense"
							id="name"
							name="name"
							label={t('customerName')}
							type="name"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							id="email"
							name="email"
							label={t('email')}
							type="email"
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

interface UpdateCustomerProps {
	customerId: string;
	open: boolean;
	onClose: () => void;
}

function UpdateCustomerFormDialog({
	customerId,
	open,
	onClose,
}: UpdateCustomerProps) {
	const [formData, setFormData] = useState({ name: '', email: '' });
	const notifications = useNotifications();
	const customer = useGetCustomerById(customerId!, { skip: !customerId });
	useEffect(() => {
		if (customer.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (customer.isSuccess)
			setFormData({ name: customer.data.name, email: customer.data.email });
	}, [notifications, customer.isError, customer.isSuccess, customer.data]);
	const [updateCustomerTrigger, { isLoading: isUpdateLoading }] =
		useUpdateCustomer();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const updatingCustomer: CustomerUpdateRequest = {
			name: formData.name.trim(),
			email: formData.email.trim(),
			customerId: customerId!,
		};

		if (!updatingCustomer.name) {
			notifications.show(t('customerNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await updateCustomerTrigger(updatingCustomer);
			notifications.show(t('updateCustomerSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateCustomerError'), {
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
					{(customer.isLoading || isUpdateLoading) && <LinearProgress />}
					<TextField
						autoFocus
						required
						margin="dense"
						id="name"
						name="name"
						label={t('customerName')}
						type="text"
						fullWidth
						variant="standard"
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						required
						margin="dense"
						id="email"
						name="email"
						label={t('email')}
						type="email"
						fullWidth
						variant="standard"
						value={formData.email}
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

export default function CustomerManagementPage() {
	const { t } = useTranslation();
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const [customerQuery, setCustomerQuery] = useState<GetAllCustomerQuery>({
		email: '',
		name: '',
		pageNumber: 0,
		pageSize: 6,
	});
	const customers = useGetAllCustomers(customerQuery!, {
		skip: !customerQuery,
	});
	useEffect(() => {
		if (customers.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, customers.isError, t]);

	const [deleteCustomerTrigger, deleteCustomer] = useDeleteCustomer();
	useEffect(() => {
		if (deleteCustomer.isError)
			notifications.show(t('deleteCustomerError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteCustomer.isSuccess)
			notifications.show(t('deleteCustomerSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
	}, [deleteCustomer.isError, deleteCustomer.isSuccess, notifications, t]);
	const handleDelete = async (customerId: string) => {
		const confirmed = await dialogs.confirm(t('deleteCustomerConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteCustomerTrigger(customerId);
	};

	const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
		null,
	);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const handleEditClick = (customerId: string) => {
		setSelectedCustomerId(customerId);
		setIsEditDialogOpen(true);
	};

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
							label: t('customerName'),
						},
						{
							key: 'email',
							label: t('email'),
						},
					]}
					open={filterVersionDialogOpen}
					onClose={() => setFilterVersionDialogOpen(false)}
					onOpen={() => setFilterVersionDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						setCustomerQuery((prev) => ({
							...query,
							pageNumber: 0,
							pageSize: prev.pageSize,
						}));
					}}
					onReset={() => {
						setCustomerQuery((prev) => ({ ...prev, name: '', email: '' }));
					}}
				/>

				<CreateCustomerFormDialog />
			</Stack>
			{(customers.isLoading || customers.isFetching) && <LinearProgress />}
			<PaginationTable
				headers={
					<>
						<TableCell key={`customerName`} align="center">
							{t('customerName')}
						</TableCell>

						<TableCell key={`email`} align="center">
							{t('email')}
						</TableCell>

						<TableCell />
					</>
				}
				count={customers.data?.numberOfElements ?? 0}
				rows={customers.data?.content ?? []}
				onPageChange={(newPage) =>
					setCustomerQuery((prev) => {
						return { ...prev, ...newPage };
					})
				}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`customerName`} align="center">
							{row.name}
						</TableCell>

						<TableCell key={`email`} align="center">
							{row.email}
						</TableCell>

						<TableCell>
							<Stack direction="row">
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
			{isEditDialogOpen && selectedCustomerId && (
				<UpdateCustomerFormDialog
					customerId={selectedCustomerId}
					open={isEditDialogOpen}
					onClose={() => setIsEditDialogOpen(false)}
				/>
			)}
		</Box>
	);
}
