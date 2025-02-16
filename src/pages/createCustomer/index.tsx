import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
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

export default function CreateCustomerPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
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
				{t('addCustomerInfor')}
			</Typography>
			<Stack mb={2} spacing={2}>
				<TextField
					size="small"
					label={t('customerName')}
					value={''}
					onChange={(e) => e.target.value}
					placeholder={`${t('enter')} ${t('customerName').toLowerCase()}...`}
				/>
				<TextField
					size="small"
					label={t('address')}
					value={''}
					onChange={(e) => e.target.value}
					placeholder={`${t('enter')} ${t('address').toLowerCase()}...`}
				/>
				<TextField
					size="small"
					label={t('email')}
					value={''}
					onChange={(e) => e.target.value}
					placeholder={`${t('enter')} ${t('email').toLowerCase()}...`}
				/>
				<TextField
					size="small"
					label={t('phoneNumber')}
					value={''}
					onChange={(e) => e.target.value}
					placeholder={`${t('enter')} ${t('phoneNumber').toLowerCase()}...`}
				/>
			</Stack>

			<Stack mt={1}>
				<Typography variant="subtitle1" mb={1}>
					{t('note')}
				</Typography>
				<Box mb={1}>
					<TextField
						fullWidth
						size="medium"
						value={''}
						onChange={(e) => e.target.value}
						placeholder={`${t('enter')} ${t('note').toLowerCase()}...`}
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
