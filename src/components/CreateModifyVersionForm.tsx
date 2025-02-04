import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';

import 'react-quill/dist/quill.snow.css';
import DragAndDropForm from './DragAndDropForm';
import TextEditor from './TextEditor';

interface FileAttachment {
	id: number;
	name: string;
	size: string;
	status: 'loading' | 'complete' | 'failed';
	progress: number;
	error?: string;
}

interface CreateModifyVersionFormProps {
	title: string;
	label: string;
	showModifyValues?: {
		productNameToShow: string;
		descriptionToShow: string;
	};
	onSubmit: (data: {
		productNameProp: string;
		descriptionProp: string;
		files: File[];
	}) => void;
	onCancel: () => void;
}

const CreateModifyVersionForm: React.FC<CreateModifyVersionFormProps> = ({
	title,
	label,
	showModifyValues,
	onSubmit,
	onCancel,
}) => {
	const { t } = useTranslation();

	const [files, setFiles] = useState<FileAttachment[]>([]);

	const [productName, setProductName] = useState(
		showModifyValues?.productNameToShow || '',
	);
	const [description, setDescription] = useState(
		showModifyValues?.descriptionToShow || '',
	);

	const handleFilesChange = (uploadedFiles: FileAttachment[]) => {
		setFiles(uploadedFiles);
	};

	const handleSubmit = () => {
		const uploadedFiles = files
			.filter((file) => file.status === 'complete')
			.map((file) => new File([], file.name)); // Tạo File object (giữ tên file)

		onSubmit({
			productNameProp: productName,
			descriptionProp: description,
			files: uploadedFiles,
		});

		// onSubmit({
		// 	productNameProp: productName,
		// 	descriptionProp: description,
		// 	files,
		// });
	};

	return (
		<Box>
			<Typography variant="h5" mb={3} textAlign="center">
				{title}
			</Typography>
			<Box mb={1} width={300}>
				<TextField
					fullWidth
					size="small"
					label={label}
					value={productName}
					onChange={(e) => setProductName(e.target.value)}
					placeholder={`${t('enter')} ${label.toLowerCase()}...`}
				/>
			</Box>
			<Stack direction={'row'} alignItems={'flex-start'}>
				<Stack maxWidth={700} marginRight={5}>
					<Typography variant="subtitle1" mb={1}>
						{t('changeLog')}
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
				</Stack>
				<Stack width={500}>
					<DragAndDropForm onFilesChange={handleFilesChange} />
				</Stack>
			</Stack>

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

export default CreateModifyVersionForm;
