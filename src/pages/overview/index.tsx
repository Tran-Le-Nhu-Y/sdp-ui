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
import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterDialog,
	PaginationTable,
	TextEditor,
} from '../../components';
import { useState } from 'react';
import { t } from 'i18next';
import { useNotifications, useSession } from '@toolpad/core';
import { HideDuration } from '../../utils';
import { useGetAllCustomers, useGetAllSoftwareByUserId } from '../../services';

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
	const session = useSession();

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
				<ProductTable userId={session?.user?.id ?? ''} />
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

const ProductTable = ({ userId }: { userId: string }) => {
	const notifications = useNotifications();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [softwareQuery, setSoftwareQuery] = useState<GetAllSoftwareQuery>({
		userId: userId,
		softwareName: '',
		pageNumber: 0,
		pageSize: 6,
	});
	const softwares = useGetAllSoftwareByUserId(softwareQuery!, {
		skip: !softwareQuery,
	});
	React.useEffect(() => {
		if (softwares.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, softwares.isError]);

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
							key: 'softwareName',
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
						setSoftwareQuery((prev) => ({ ...prev, ...query }));
					}}
					onReset={() => {
						setSoftwareQuery((prev) => ({ ...prev, softwareName: '' }));
					}}
				/>
			</Stack>

			{softwares.isLoading && <LinearProgress />}
			<CollapsibleTable
				headers={
					<>
						<TableCell key="name">{t('softwareName')}</TableCell>
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
				rows={softwares.data?.content ?? []}
				count={softwares.data?.totalElements ?? 0}
				pageNumber={softwareQuery?.pageNumber}
				pageSize={softwareQuery?.pageSize}
				onPageChange={(newPage) =>
					setSoftwareQuery((prev) => {
						return { ...prev, ...newPage };
					})
				}
				getCell={(row) => (
					<CollapsibleTableRow
						key={row.id}
						cells={
							<>
								<TableCell align="justify" component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="center">{row.createdAt}</TableCell>
								<TableCell align="center">{row.updatedAt}</TableCell>
							</>
						}
						inner={
							<Stack spacing={3}>
								<Box
									component="form"
									sx={{
										'& .MuiTextField-root': {
											width: '100%',
										},
									}}
									noValidate
									autoComplete="off"
								>
									<Stack
										mt={1}
										mb={2}
										sx={{
											width: '100%',
										}}
									>
										<TextEditor value={row.description ?? ''} readOnly />
									</Stack>
								</Box>
							</Stack>
						}
					/>
				)}
			/>
		</Box>
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
	}, [notifications, customers.isError, t]);

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
