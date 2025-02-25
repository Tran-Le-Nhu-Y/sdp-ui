import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import {
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	TableRow,
} from '@mui/material';
import { FilterDialog, PaginationTable } from '../../components';
import { useState } from 'react';
import { t } from 'i18next';
import { useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import { useGetAllCustomers } from '../../services';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function OverviewPage() {
	const { t } = useTranslation();
	const [value, setValue] = React.useState(0);

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label={t('productList')} {...a11yProps(0)} />
					<Tab label={t('customerList')} {...a11yProps(1)} />
					<Tab label={t('deploymentList')} {...a11yProps(2)} />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<ProductTable />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<CustomerTable />
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<DeploymentTable />
			</CustomTabPanel>
		</Box>
	);
}

const ProductTable = () => {
	const [productTablePage, setProductTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const products = [
		{
			id: '1',
			name: 'Phần mềm A',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
			status: 'Đang triển khai',
		},
		{
			id: '2',
			name: 'Phần mềm B',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
			status: 'Đang triển khai',
		},
		{
			id: '3',
			name: 'Phần mềm C',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
			status: 'Đang triển khai',
		},
	];

	return (
		<>
			<PaginationTable
				// filterableCols={[
				// 	{
				// 		key: 'name',
				// 		label: 'Phiên bản',
				// 	},
				// ]}
				headers={
					<>
						<TableCell key={`productName`}>{t('productName')}</TableCell>
						<TableCell key={`dateCreated`} align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key={`lastUpdated`} align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell key={`status`} align="center">
							{t('status')}
						</TableCell>
						<TableCell />
					</>
				}
				count={products.length ?? 0}
				rows={products}
				pageNumber={productTablePage.pageNumber}
				pageSize={productTablePage.pageSize}
				onPageChange={(newPage) => setProductTablePage(newPage)}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`productName`}>{row.name}</TableCell>
						<TableCell key={`dateCreated`} align="center">
							{row.createAt}
						</TableCell>
						<TableCell key={`lastUpdated`} align="center">
							{row.updateAt}
						</TableCell>
						<TableCell key={`status`} align="center">
							{row.status}
						</TableCell>

						<TableCell>
							<Stack direction="row">
								<IconButton size="small" onClick={() => {}}>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
							</Stack>
						</TableCell>
					</TableRow>
				)}
			/>
		</>
	);
};

const CustomerTable = () => {
	const { t } = useTranslation();
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
	React.useEffect(() => {
		if (customers.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, customers.isError, t]);

	return (
		<>
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
				</Stack>
				{customers.isLoading ? (
					<LinearProgress />
				) : (
					<PaginationTable
						headers={
							<>
								<TableCell key={`customerName`} align="center">
									{t('customerName')}
								</TableCell>
								{/* <TableCell key={`address`} align="center">
						{t('address')}
					</TableCell> */}
								<TableCell key={`email`} align="center">
									{t('email')}
								</TableCell>
								{/* <TableCell key={`phoneNumber`} align="center">
						{t('phoneNumber')}
					</TableCell> */}
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
								{/* <TableCell key={`address`} align="center">
						{row.address}
					</TableCell> */}
								<TableCell key={`email`} align="center">
									{row.email}
								</TableCell>
								{/* <TableCell key={`phoneNumber`} align="center">
						{row.phoneNumber}
					</TableCell> */}
							</TableRow>
						)}
					/>
				)}
			</Box>
		</>
	);
};

const DeploymentTable = () => {
	const [deploymentTablePage, setDeploymentTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const deployments = [
		{
			id: '1',
			name: 'Phần mềm A',
			status: 'Mới',
			startDate: '01/01/2025',
			endDate: '01/01/2025',
		},
		{
			id: '2',
			name: 'Phần mềm B',
			status: 'Đang triển khai',
			startDate: '01/01/2025',
			endDate: '01/01/2025',
		},
		{
			id: '3',
			name: 'Phần mềm C',
			status: 'Hoàn thành',
			startDate: '01/01/2025',
			endDate: '01/01/2025',
		},
	];

	return (
		<>
			<PaginationTable
				// filterableCols={[
				// 	{
				// 		key: 'name',
				// 		label: 'Phiên bản',
				// 	},
				// ]}
				headers={
					<>
						<TableCell key={`deployFor`}>{t('deployFor')}</TableCell>
						<TableCell key={`status`} align="center">
							{t('status')}
						</TableCell>
						<TableCell key={`startDate`} align="center">
							{t('startDate')}
						</TableCell>
						<TableCell key={`endDate`} align="center">
							{t('endDate')}
						</TableCell>
						<TableCell />
					</>
				}
				count={deployments.length ?? 0}
				rows={deployments}
				pageNumber={deploymentTablePage.pageNumber}
				pageSize={deploymentTablePage.pageSize}
				onPageChange={(newPage) => setDeploymentTablePage(newPage)}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`deployFor`}>{row.name}</TableCell>
						<TableCell key={`status`} align="center">
							{row.status}
						</TableCell>
						<TableCell key={`startDate`} align="center">
							{row.startDate}
						</TableCell>
						<TableCell key={`endDate`} align="center">
							{row.endDate}
						</TableCell>

						<TableCell>
							<Stack direction="row">
								<IconButton size="small" onClick={() => {}}>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
							</Stack>
						</TableCell>
					</TableRow>
				)}
			/>
		</>
	);
};
