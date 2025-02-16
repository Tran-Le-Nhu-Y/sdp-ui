import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { DragAndDropForm } from '../../components';
import { useState } from 'react';
import React from 'react';

interface FileAttachment {
	id: number;
	name: string;
	size: string;
	status: 'loading' | 'complete' | 'failed';
	progress: number;
	error?: string;
}

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const names = [
	'Oliver Hansen',
	'Van Henry',
	'April Tucker',
	'Ralph Hubbard',
	'Omar Alexander',
	'Carlos Abbott',
	'Miriam Wagner',
	'Bradley Wilkerson',
	'Virginia Andrews',
	'Kelly Snyder',
];

export default function CreateDeploymentPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [customer, setCustomer] = useState('');
	const [product, setProduct] = useState('');
	const [productVersion, setProductVersion] = useState('');
	const [module, setModule] = React.useState<string[]>([]);
	const [deployer, setDeployer] = React.useState<string[]>([]);
	const [, setFiles] = useState<FileAttachment[]>([]);

	const handleSubmit = () => {
		navigate(-1); // back to previous page
	};
	const handleCancel = () => {
		navigate(-1); // back to previous page
	};

	const handleFilesChange = (uploadedFiles: FileAttachment[]) => {
		setFiles(uploadedFiles);
	};

	const handleModuleChange = (event: SelectChangeEvent<typeof module>) => {
		const {
			target: { value },
		} = event;
		setModule(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};
	const handleDeployerChange = (event: SelectChangeEvent<typeof deployer>) => {
		const {
			target: { value },
		} = event;
		setDeployer(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value,
		);
	};

	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addDeployProductInfor')}
			</Typography>
			<Stack mb={2} spacing={2}>
				{/* Product Selection */}
				<Stack direction="row" spacing={2} mb={2}>
					<FormControl fullWidth size="small">
						<InputLabel>{t('customer')}</InputLabel>
						<Select
							label={t('customerName')}
							value={customer}
							onChange={(e) => setCustomer(e.target.value)}
						>
							<MenuItem value="Product 1">Product 1</MenuItem>
							<MenuItem value="Product 2">Product 2</MenuItem>
						</Select>
					</FormControl>
					<TextField
						size="small"
						label={t('startDate')}
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						placeholder={`${t('enter')} ${t('startDate').toLowerCase()}...`}
					/>
				</Stack>
				<Stack direction="row" spacing={2}>
					<FormControl fullWidth size="small">
						<InputLabel>{t('product')}</InputLabel>
						<Select
							label={t('productName')}
							value={product}
							onChange={(e) => setProduct(e.target.value)}
						>
							<MenuItem value="Product 1">Product 1</MenuItem>
							<MenuItem value="Product 2">Product 2</MenuItem>
						</Select>
					</FormControl>
					<TextField
						size="small"
						label={t('endDate')}
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						placeholder={`${t('enter')} ${t('endDate').toLowerCase()}...`}
					/>
				</Stack>
				<FormControl fullWidth size="small">
					<InputLabel>{t('productVersion')}</InputLabel>
					<Select
						label={t('productVersion')}
						value={productVersion}
						onChange={(e) => setProductVersion(e.target.value)}
					>
						<MenuItem value="Product 1">Product 1</MenuItem>
						<MenuItem value="Product 2">Product 2</MenuItem>
					</Select>
				</FormControl>
				<FormControl fullWidth size="small">
					<InputLabel id="demo-multiple-checkbox-label">
						{t('moduleName')}
					</InputLabel>
					<Select
						label={t('moduleName')}
						labelId="demo-multiple-checkbox-label"
						id="demo-multiple-checkbox"
						multiple
						value={module}
						onChange={handleModuleChange}
						input={<OutlinedInput label={t('moduleName')} />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{names.map((name) => (
							<MenuItem key={name} value={name}>
								<Checkbox checked={module.includes(name)} />
								<ListItemText primary={name} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<FormControl fullWidth size="small">
					<InputLabel id="demo-multiple-checkbox-label">
						{t('deployer')}
					</InputLabel>
					<Select
						label={t('deployer')}
						labelId="demo-multiple-checkbox-label"
						id="demo-multiple-checkbox"
						multiple
						value={deployer}
						onChange={handleDeployerChange}
						input={<OutlinedInput label={t('deployer')} />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}
					>
						{names.map((name) => (
							<MenuItem key={name} value={name}>
								<Checkbox checked={deployer.includes(name)} />
								<ListItemText primary={name} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Stack>

			<Stack mt={1}>
				<Typography variant="subtitle1" mb={1}>
					{t('description')}
				</Typography>
				<Box mb={1}>
					<TextField
						fullWidth
						size="medium"
						value={''}
						onChange={(e) => e.target.value}
						placeholder={`${t('enter')} ${t('deployDocumentDescription').toLowerCase()}...`}
						multiline
						rows={4}
					/>
				</Box>

				<DragAndDropForm onFilesChange={handleFilesChange} />
			</Stack>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button variant="contained" color="primary" onClick={handleSubmit}>
					{t('submit')}
				</Button>
				<Button variant="outlined" color="secondary" onClick={handleCancel}>
					{t('cancel')}
				</Button>
			</Box>
		</Stack>
	);
}
