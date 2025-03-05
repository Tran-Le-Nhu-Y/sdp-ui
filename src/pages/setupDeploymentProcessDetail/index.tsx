import {
	Typography,
	TableCell,
	TableRow,
	Container,
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
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PaginationTable } from '../../components';
import { useParams } from 'react-router-dom';
import {
	getDeploymentProcessStatusTransKey,
	HideDuration,
	PathHolders,
} from '../../utils';
import { useGetDeploymentProcess } from '../../services';
import { useNotifications } from '@toolpad/core';
import { t } from 'i18next';

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
	personnel: Array.from({ length: 5 }, (_, i) => ({
		id: i + 1,
		name: `Nhân sự ${i + 1}`,
		phone: '0123456789',
		email: 'abc@gmail.com',
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

function VerticalLinearStepper() {
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

const SetupDeploymentProcessPage = () => {
	const { t } = useTranslation();
	const [value, setValue] = React.useState(0);
	const notifications = useNotifications();

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];

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

	const [, setModuleQuery] = useState<GetAllModuleQuery>({
		softwareVersionId: '',
		moduleName: '',
		pageNumber: 0,
		pageSize: 6,
	});

	return (
		<Container>
			<Typography variant="h5" align="center" gutterBottom>
				<strong>{t('deploymentProcessInfor')}</strong>
			</Typography>
			<Stack direction={'row'} justifyContent={'space-between'}>
				<Stack>
					<Typography>
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>{t('status')}:</strong>{' '}
						{deploymentProcess.data?.status &&
							t(
								getDeploymentProcessStatusTransKey(
									deploymentProcess.data?.status
								)
							)}
					</Typography>
				</Stack>
				<Stack>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
				</Stack>
				<Stack>
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

			<Box sx={{ width: '100%' }}>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="basic tabs example "
					>
						<Tab label={t('currentStep')} {...a11yProps(0)} />
						<Tab label={t('moduleList')} {...a11yProps(1)} />
						<Tab label={t('personnelList')} {...a11yProps(2)} />
					</Tabs>
				</Box>
				<CustomTabPanel value={value} index={0}>
					<VerticalLinearStepper />
				</CustomTabPanel>
				<CustomTabPanel value={value} index={1}>
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
				</CustomTabPanel>
				<CustomTabPanel value={value} index={2}>
					<PaginationTable
						headers={
							<>
								<TableCell key={`deployer`} align="center">
									{t('deployer')}
								</TableCell>

								<TableCell key={`email`} align="center">
									{t('email')}
								</TableCell>
							</>
						}
						count={deploymentData.personnel.length ?? 0}
						rows={deploymentData.personnel ?? []}
						onPageChange={(newPage) =>
							setModuleQuery((prev) => {
								return { ...prev, ...newPage };
							})
						}
						getCell={(row) => (
							<TableRow key={row.id}>
								<TableCell key={`deployer`} align="center">
									{row.name}
								</TableCell>

								<TableCell key={`email`} align="center">
									{row.email}
								</TableCell>
							</TableRow>
						)}
					/>
				</CustomTabPanel>
			</Box>
		</Container>
	);
};

export default SetupDeploymentProcessPage;
