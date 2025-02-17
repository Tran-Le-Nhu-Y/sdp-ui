import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { DragAndDropForm } from '../../components';
import { useState } from 'react';

interface FileAttachment {
	id: number;
	name: string;
	size: string;
	status: 'loading' | 'complete' | 'failed';
	progress: number;
	error?: string;
}

export default function CreatDeployDocumentPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [product, setProduct] = useState('');
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

	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addDocument')}
			</Typography>
			<Stack mb={2}>
				<FormControl fullWidth size="small">
					<InputLabel>{t('documentType')}</InputLabel>
					<Select
						label={t('productName')}
						value={product}
						onChange={(e) => setProduct(e.target.value)}
					>
						<MenuItem value="Product 1">Product 1</MenuItem>
						<MenuItem value="Product 2">Product 2</MenuItem>
					</Select>
				</FormControl>
			</Stack>

			<TextField
				size="small"
				label={t('documentName')}
				value={''}
				onChange={(e) => e.target.value}
				placeholder={`${t('enter')} ${t('documentName').toLowerCase()}...`}
			/>

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
						placeholder={`${t('enter')} ${t('documentDescription').toLowerCase()}...`}
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
