import React, { useState } from 'react';
import {
	Box,
	Button,
	LinearProgress,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import 'react-quill/dist/quill.snow.css';
import TextEditor from './TextEditor';
import { isValidLength, TextLength } from '../utils';

interface CreateOrModifyFormProps {
	loading?: boolean;
	title: string;
	label: string;
	showModifyValues?: {
		name: string | null | undefined;
		description: string | null | undefined;
	};
	onSubmit: (data: { name: string; description: string | null }) => void;
	onCancel: () => void;
}

const CreateOrModifyForm: React.FC<CreateOrModifyFormProps> = ({
	loading,
	title,
	label,
	showModifyValues,
	onSubmit,
	onCancel,
}) => {
	const [name, setName] = useState(showModifyValues?.name ?? '');
	const [description, setDescription] = useState(
		showModifyValues?.description ?? '',
	);
	const { t } = useTranslation();
	const handleSubmit = () => {
		onSubmit({ name: name, description: description });
	};

	return (
		<Stack p={1} maxWidth={1000} mx="auto" spacing={1}>
			<Typography variant="h5" mb={3} textAlign="center">
				{title}
			</Typography>
			{loading && <LinearProgress />}
			<Box mb={1}>
				<TextField
					fullWidth
					size="small"
					helperText={t('hyperTextMedium')}
					label={label}
					value={name}
					onChange={(e) => {
						const newValue = e.target.value;
						if (isValidLength(newValue, TextLength.Medium)) setName(newValue);
					}}
					placeholder={`${t('enter')} ${label.toLowerCase()}...`}
				/>
			</Box>
			<Typography variant="subtitle1" mb={1}>
				{t('description')}
			</Typography>
			<Box
				sx={{
					backgroundColor: '#fff',
					borderRadius: 2,
					boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
				}}
			>
				<TextEditor value={description} onChange={setDescription} />
			</Box>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button variant="contained" color="primary" onClick={handleSubmit}>
					{t('submit')}
				</Button>
				<Button variant="outlined" color="secondary" onClick={onCancel}>
					{t('cancel')}
				</Button>
			</Box>
		</Stack>
	);
};

export default CreateOrModifyForm;
