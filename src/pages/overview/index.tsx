import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import { IconButton, Stack, TableCell, TableRow } from '@mui/material';
import { FilterableTable } from '../../components';
import { useState } from 'react';
import { t } from 'i18next';

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
			<FilterableTable
				filterableCols={[
					{
						key: 'name',
						label: 'Phiên bản',
					},
				]}
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
	const [customerTablePage, setCustomerTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const customers = [
		{
			id: '1',
			name: 'Nguyễn Văn A',
			address: '123 Lý Tự Trọng, Cần Thơ',
			email: 'nguyenvana@gmail.com',
			phoneNumber: '0901234567',
		},
		{
			id: '2',
			name: 'Trần Thị B',
			address: '456 Nguyễn Trãi, TP.HCM',
			email: 'tranthib@gmail.com',
			phoneNumber: '0912345678',
		},
		{
			id: '3',
			name: 'Lê Quốc C',
			address: '789 Trần Hưng Đạo, Hà Nội',
			email: 'lequocc@gmail.com',
			phoneNumber: '0923456789',
		},
	];

	return (
		<>
			<FilterableTable
				filterableCols={[
					{
						key: 'name',
						label: 'Phiên bản',
					},
				]}
				headers={
					<>
						<TableCell key={`customerName`}>{t('customerName')}</TableCell>
						<TableCell key={`address`} align="center">
							{t('address')}
						</TableCell>
						<TableCell key={`email`} align="center">
							{t('email')}
						</TableCell>
						<TableCell key={`phoneNumber`} align="center">
							{t('phoneNumber')}
						</TableCell>
						<TableCell />
					</>
				}
				count={customers.length ?? 0}
				rows={customers}
				pageNumber={customerTablePage.pageNumber}
				pageSize={customerTablePage.pageSize}
				onPageChange={(newPage) => setCustomerTablePage(newPage)}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`customerName`}>{row.name}</TableCell>
						<TableCell key={`address`} align="center">
							{row.address}
						</TableCell>
						<TableCell key={`email`} align="center">
							{row.email}
						</TableCell>
						<TableCell key={`phoneNumber`} align="center">
							{row.phoneNumber}
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
			<FilterableTable
				filterableCols={[
					{
						key: 'name',
						label: 'Phiên bản',
					},
				]}
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
