import { useTranslation } from 'react-i18next';
import { FilterDialog, PaginationTable } from '../../components';

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
import { useEffect, useState } from 'react';
import { useGetAllCustomers } from '../../services';
import { useNotifications } from '@toolpad/core';
import { HideDuration, RoutePaths } from '../../utils';
import { useNavigate } from 'react-router-dom';

export default function CustomerManagementPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notifications = useNotifications();
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

	const handleDelete = (id: string) => {
		alert(`Xóa khách hàng có ID: ${id}`);
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
						setCustomerQuery((prev) => ({ ...prev, ...query }));
					}}
					onReset={() => {
						setCustomerQuery((prev) => ({ ...prev, customerName: '' }));
					}}
				/>
				<Button
					variant="contained"
					onClick={() => navigate(`${RoutePaths.CREATE_CUSTOMER}`)}
				>
					{t('addCustomer')}
				</Button>
			</Stack>
			{customers.isLoading ? (
				<LinearProgress />
			) : (
				<PaginationTable
					headers={
						<>
							<TableCell key={`customerName`}>{t('customerName')}</TableCell>
							{/* <TableCell key={`address`} align="center">
							{t('address')}
						</TableCell> */}
							<TableCell key={`email`} align="center">
								{t('email')}
							</TableCell>
							{/* <TableCell key={`phoneNumber`} align="center">
							{t('phoneNumber')}
						</TableCell> */}
							<TableCell />
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
							<TableCell key={`customerName`}>{row.name}</TableCell>
							{/* <TableCell key={`address`} align="center">
							{row.address}
						</TableCell> */}
							<TableCell key={`email`} align="center">
								{row.email}
							</TableCell>
							{/* <TableCell key={`phoneNumber`} align="center">
							{row.phoneNumber}
						</TableCell> */}

							<TableCell>
								<Stack direction="row">
									<IconButton size="small" onClick={() => {}}>
										<RemoveRedEyeIcon color="info" />
									</IconButton>
									<IconButton size="small" onClick={() => {}}>
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
		</Box>
	);
}
