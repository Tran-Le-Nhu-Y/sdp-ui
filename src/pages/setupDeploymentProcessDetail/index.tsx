import {
	Typography,
	TableCell,
	TableRow,
	Paper,
	Stack,
	Box,
	Tab,
	Tabs,
	Button,
	Step,
	StepContent,
	Stepper,
	StepButton,
	Select,
	MenuItem,
	FormControl,
	CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationTable, TabPanel } from '../../components';
import { useParams } from 'react-router-dom';
import { HideDuration, PathHolders } from '../../utils';
import {
	useGetAllUsers,
	useGetDeploymentProcess,
	useUpdateDeploymentProcess,
} from '../../services';
import { useNotifications } from '@toolpad/core';
import { t } from 'i18next';
import {
	DataGrid,
	GridFilterModel,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';

const deploymentData = {
	customer: 'Oliver Hansen',
	software: 'Oliver Hansen',
	version: '1.0',
	status: 'Đang triển khai',
	startDate: '00/00/0000',
	endDate: '00/00/0000',
	modules: Array.from({ length: 5 }, (_, i) => ({
		id: i + 1,
		name: `Module ${i + 1}`,
		version: '1.0',
	})),
	phases: [
		{
			id: 1,
			name: 'Nguyễn Văn A',
			email: 'a@gmail.com',
			step: 'Lập kế hoạch',
			updatedAt: '04/03/2019',
		},
		{
			id: 2,
			name: 'Nguyễn Văn B',
			email: 'Đang triển khai',
			step: 'Lập kế hoạch',
			updatedAt: '04/03/2019',
		},
	],
};

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const steps = [
	{
		label: 'Select campaign settings',
		description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
	},
	{
		label: 'Create an ad group',
		description:
			'An ad group contains one or more ads which target a shared set of keywords.',
	},
	{
		label: 'Create an ad',
		description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
	},
];

function PhaseTab() {
	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<Box sx={{ maxWidth: 400 }}>
			<Stepper nonLinear activeStep={activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<StepButton
							optional={
								index === steps.length - 1 ? (
									<Typography variant="caption">Last step</Typography>
								) : null
							}
							color="inherit"
							onClick={() => {
								setActiveStep(index);
							}}
						>
							{step.label}
						</StepButton>
						<StepContent>
							<Typography>{step.description}</Typography>

							<Box sx={{ mb: 2 }}>
								<Button
									variant="contained"
									onClick={handleNext}
									sx={{ mt: 1, mr: 1 }}
								>
									{index === steps.length - 1 ? t('finish') : t('complete')}
								</Button>
								<Button
									disabled={index === 0}
									onClick={handleBack}
									sx={{ mt: 1, mr: 1 }}
								>
									{t('return')}
								</Button>
							</Box>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<Paper square elevation={0} sx={{ p: 3 }}>
					<Typography>All steps completed - you&apos;re finished</Typography>
					<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Reset
					</Button>
				</Paper>
			)}
		</Box>
	);
}

function ModuleTab() {
	const [, setModuleQuery] = useState<GetAllModuleQuery>({
		softwareVersionId: '',
		moduleName: '',
		pageNumber: 0,
		pageSize: 6,
	});

	return (
		<PaginationTable
			headers={
				<>
					<TableCell key={`moduleName`} align="center">
						{t('moduleName')}
					</TableCell>
					<TableCell key={`version`} align="center">
						{t('version')}
					</TableCell>
				</>
			}
			count={deploymentData.modules.length ?? 0}
			rows={deploymentData.modules ?? []}
			onPageChange={(newPage) =>
				setModuleQuery((prev) => {
					return { ...prev, ...newPage };
				})
			}
			getCell={(row) => (
				<TableRow key={row.id}>
					<TableCell key={`moduleName`} align="center">
						{row.name}
					</TableCell>

					<TableCell key={`version`} align="center">
						{row.version}
					</TableCell>
				</TableRow>
			)}
		/>
	);
}

function PersonnelTab() {
	const [userQuery, setUserQuery] = useState<UserQuery>({
		exact: false,
		pageNumber: 0,
		pageSize: 5,
	});
	const users = useGetAllUsers(userQuery);
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [filterModel, setFilterModel] = useState<GridFilterModel>();

	return (
		<Stack
			direction={{
				xs: 'column',
				sm: 'row',
			}}
			justifyContent={'space-around'}
			spacing={2}
		>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<DataGrid
					slots={{
						toolbar: () => (
							<GridToolbarContainer>
								<GridToolbarFilterButton />
								<GridToolbarDensitySelector />
								<GridToolbarColumnsButton />
								<GridToolbarQuickFilter />
							</GridToolbarContainer>
						),
					}}
					rows={users.data?.content}
					columns={[
						{
							field: 'fullName',
							headerName: t('fullName'),
							editable: false,
							width: 200,
							valueGetter: (_value, row) => {
								return `${row.lastName || ''} ${row.firstName || ''}`;
							},
						},
						{
							field: 'email',
							editable: false,
							minWidth: 200,
							headerName: t('emailAddress'),
						},
					]}
					loading={users.isLoading || users.isFetching}
					pageSizeOptions={[5, 10, 15]}
					rowCount={users.data?.totalElements}
					initialState={{
						pagination: {
							paginationModel: {
								page: 0,
								pageSize: 5,
							},
						},
					}}
					keepNonExistentRowsSelected
					checkboxSelection
					rowSelectionModel={selectedUserIds}
					onRowSelectionModelChange={(model) => {
						setSelectedUserIds(model.map((id) => id.toString()));
					}}
					paginationMode="server"
					paginationModel={{
						pageSize: userQuery.pageSize ?? 5,
						page: userQuery.pageNumber ?? 0,
					}}
					onPaginationModelChange={(model) =>
						setUserQuery((pre) => ({
							...pre,
							pageNumber: model.page,
							pageSize: model.pageSize,
						}))
					}
					filterMode="server"
					filterModel={filterModel}
					onFilterModelChange={(model) => {
						setFilterModel(model);
					}}
				/>
			</div>
			<Stack direction={'column'} spacing={1}>
				<Typography variant="h6">{t('assignedPersonnel')}</Typography>
				<PaginationTable
					headers={
						<>
							<TableCell key="fullName" align="center">
								{t('deployer')}
							</TableCell>
							<TableCell key="email" align="center">
								{t('email')}
							</TableCell>
						</>
					}
					count={0}
					rows={[
						{
							id: 'test',
							firstName: 'Test',
							lastName: 'Test',
							email: 'mail@gmail.com',
						},
					]}
					onPageChange={(newPage) => {
						// setModuleQuery((prev) => {
						// 	return { ...prev, ...newPage };
						// })
					}}
					getCell={(row) => (
						<TableRow key={row.id}>
							<TableCell key={`fullName`} align="center">
								{`${row.lastName} ${row.firstName}`}
							</TableCell>
							<TableCell key={`email`} align="center">
								{row.email}
							</TableCell>
						</TableRow>
					)}
				/>
			</Stack>
		</Stack>
	);
}

const SetupDeploymentProcessPage = () => {
	const { t } = useTranslation();
	const [value, setValue] = React.useState(0);
	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];
	const notifications = useNotifications();

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const deploymentProcess = useGetDeploymentProcess(processId!, {
		skip: !processId,
	});
	useEffect(() => {
		if (deploymentProcess.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, deploymentProcess.isError, t]);

	const [updateProcessTrigger, { isLoading: isProcessUpdating }] =
		useUpdateDeploymentProcess();
	const handleUpdateProcess = async (data: DeploymentProcessUpdateRequest) => {
		try {
			await updateProcessTrigger(data).unwrap();

			notifications.show(t('updateDeploymentProcessSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateDeploymentProcessError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Box>
			<Typography variant="h4" align="center" gutterBottom>
				{t('deploymentProcessInfor')}
			</Typography>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{
					xs: 2,
					sm: 2,
					md: 0,
				}}
				justifyContent={{
					xs: 'normal',
					sm: 'space-between',
				}}
			>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>{t('status')}:</strong>
					</Typography>
					<FormControl>
						<Select
							id="select-deployment-process-status"
							value={deploymentProcess.data?.status}
							defaultValue={'INIT'}
							size="small"
							onChange={(e) => {
								handleUpdateProcess({
									processId: Number(processId),
									status: e.target.value as DeploymentProcessStatus,
								});
							}}
						>
							<MenuItem value={'INIT'}>{t('init')}</MenuItem>
							<MenuItem value={'PENDING'}>{t('pending')}</MenuItem>
							<MenuItem value={'IN_PROGRESS'}>{t('inProgress')}</MenuItem>
							<MenuItem value={'DONE'}>{t('done')}</MenuItem>
						</Select>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
					{isProcessUpdating && (
						<Stack direction={'row'} spacing={1}>
							<CircularProgress size={30} />
							<Typography variant="subtitle1">{t('loading')}</Typography>
						</Stack>
					)}
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('dateCreated')}:</strong>{' '}
						{deploymentProcess.data?.createdAt}
					</Typography>
					<Typography>
						<strong>{t('lastUpdated')}:</strong>{' '}
						{deploymentProcess.data?.updatedAt}
					</Typography>
				</Stack>
			</Stack>

			<Box>
				<Tabs
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
					}}
					value={value}
					onChange={handleChange}
					variant={'fullWidth'}
				>
					<Tab label={t('phases')} {...a11yProps(0)} />
					<Tab label={t('moduleList')} {...a11yProps(1)} />
					<Tab label={t('personnelPerforms')} {...a11yProps(2)} />
				</Tabs>
				<TabPanel value={value} index={0}>
					<PhaseTab />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<ModuleTab />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<PersonnelTab />
				</TabPanel>
			</Box>
		</Box>
	);
};

export default SetupDeploymentProcessPage;
