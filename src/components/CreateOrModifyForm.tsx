import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { t } from 'i18next';

function TextEditor({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],
		['link', 'image', 'video', 'formula'],

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		[{ direction: 'rtl' }], // text direction

		[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ font: [] }],
		[{ align: [] }],

		['clean'], // remove formatting button
	];
	const module = {
		toolbar: toolbarOptions,
	};

	return (
		<ReactQuill
			modules={module}
			theme="snow"
			value={value}
			onChange={onChange}
			placeholder={t('enterDescription')}
		/>
	);
}

interface CreateOrModifyFormProps {
	title: string;
	label: string;
	onSubmit: (data: {
		productNameProp: string;
		descriptionProp: string;
	}) => void;
	onCancel: () => void;
}

const CreateOrModifyForm: React.FC<CreateOrModifyFormProps> = ({
	title,
	label,
	onSubmit,
	onCancel,
}) => {
	const [productName, setproductName] = useState('');
	const [description, setDescription] = useState('');
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
