import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import 'react-quill/dist/quill.snow.css';
import TextEditor from './TextEditor';

interface CreateOrModifyFormProps {
	title: string;
	label: string;
	showModifyValues?: {
		productNameToShow: string;
		descriptionToShow: string;
	};
	onSubmit: (data: {
		productNameProp: string;
		descriptionProp: string;
	}) => void;
	onCancel: () => void;
}

const CreateOrModifyForm: React.FC<CreateOrModifyFormProps> = ({
	title,
	label,
	showModifyValues,
	onSubmit,
	onCancel,
}) => {
	const [productName, setproductName] = useState(
		showModifyValues?.productNameToShow || '',
	);
	const [description, setDescription] = useState(
		showModifyValues?.descriptionToShow || '',
	);
	const { t } = useTranslation();
	const handleSubmit = () => {
		onSubmit({ productNameProp: productName, descriptionProp: description });
	};

	return (
		<Box p={1} maxWidth={1000} mx="auto">
			<Typography variant="h5" mb={3} textAlign="center">
				{title}
			</Typography>
			<Box mb={1}>
				<TextField
					fullWidth
					size="small"
					label={label}
					value={productName}
					onChange={(e) => setproductName(e.target.value)}
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
		</Box>
	);
};

export default CreateOrModifyForm;
