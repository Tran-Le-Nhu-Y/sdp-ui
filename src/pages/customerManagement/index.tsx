import { useTranslation } from 'react-i18next';
import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterDialog,
} from '../../components';
import {
	Box,
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useDeleteCustomer, useGetAllCustomers } from '../../services';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import { HideDuration } from '../../utils';
import CreateCustomerFormDialog from './CreateCustomerFormDialog';
import SoftwareInner from './SoftwareInner';
import UpdateCustomerFormDialog from './UpdateCustomerFormDialog';

export default function CustomerManagementPage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
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
			title: t('deleteConfirm'),
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
	const [softwareVersionOfProcessQuery, setSoftwareVersionOfProcessQuery] =
		useState<GetSoftwareVersionOfDeploymentProcessByCustomerQuery | null>(null);

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

				<CreateCustomerFormDialog userId={userId} />
			</Stack>
			{(customers.isLoading || customers.isFetching) && <LinearProgress />}
			<CollapsibleTable
				headers={
					<>
						<TableCell key={`customerName`} align="center">
							{t('customerName')}
						</TableCell>

						<TableCell key={`email`} align="center">
							{t('email')}
						</TableCell>
						<TableCell />
						<TableCell />
					</>
				}
				count={customers.data?.numberOfElements ?? 0}
				rows={customers.data?.content ?? []}
				pageNumber={customerQuery?.pageNumber}
				pageSize={customerQuery?.pageSize}
				onPageChange={(newPage) =>
					setCustomerQuery((prev) => {
						return { ...prev, ...newPage };
					})
				}
				getCell={(row) => (
					<CollapsibleTableRow
						key={row.id}
						cells={
							<>
								<TableCell
									key={`customerName`}
									align="justify"
									component="th"
									scope="row"
								>
									{row.name}
								</TableCell>
								<TableCell key={`email`} align="center">
									{row.email}
								</TableCell>

								<TableCell align="center">
									<Stack direction="row">
										<IconButton
											size="small"
											onClick={() => handleEditClick(row.id)}
										>
											<EditIcon color="info" />
										</IconButton>

										<IconButton
											size="small"
											onClick={() => handleDelete(row.id)}
										>
											<DeleteIcon color="error" />
										</IconButton>
									</Stack>
								</TableCell>
							</>
						}
						inner={
							<SoftwareInner
								softwareVersionOfProcessQuery={softwareVersionOfProcessQuery}
								setSoftwareVersionOfProcessQuery={
									setSoftwareVersionOfProcessQuery
								}
							/>
						}
						onExpand={() => {
							setSoftwareVersionOfProcessQuery({
								customerId: row.id,
								softwareName: '',
								softwareVersionName: '',
								pageNumber: 0,
								pageSize: 5,
							});
						}}
					/>
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
