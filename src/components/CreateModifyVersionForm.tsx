import React, { useRef, useState } from 'react';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { AttachFile, CloudUpload, ErrorOutline } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
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
		files: FileAttachment[];
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
	const [productName, setproductName] = useState(
		showModifyValues?.productNameToShow || '',
	);
	const [description, setDescription] = useState(
		showModifyValues?.descriptionToShow || '',
	);
	const [files, setFiles] = useState<FileAttachment[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle file upload
	const handleFileUpload = (fileList: File[]) => {
		const newFiles: FileAttachment[] = fileList.map((file) => ({
			id: Date.now() + Math.random(),
			name: file.name,
			size: `${(file.size / 1024).toFixed(1)}kb`,
			status: file.size > 3000000 ? 'failed' : 'loading',
			progress: file.size > 3000000 ? 0 : 0,
			error: file.size > 3000000 ? 'File too large' : undefined,
		}));
		setFiles((prev) => [...prev, ...newFiles]);

		// Simulate upload progress
		newFiles.forEach((file) => {
			if (file.status === 'loading') {
				const interval = setInterval(() => {
					setFiles((prev) =>
						prev.map((f) =>
							f.id === file.id
								? {
										...f,
										progress: f.progress + 20,
										status: f.progress + 20 >= 100 ? 'complete' : 'loading',
									}
								: f,
						),
					);
					if (file.progress >= 100) {
						clearInterval(interval);
					}
				}, 500);
			}
		});
	};

	// Handle drag and drop events
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer.files) {
			handleFileUpload(Array.from(e.dataTransfer.files));
		}
	};

	const handleClickUploadZone = () => {
		fileInputRef.current?.click();
	};

	// Handle file removal
	const handleFileRemove = (id: number) => {
		setFiles((prev) => prev.filter((file) => file.id !== id));
	};

	const handleSubmit = () => {
		onSubmit({
			productNameProp: productName,
			descriptionProp: description,
			files,
		});
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
					onChange={(e) => setproductName(e.target.value)}
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
					<Typography variant="subtitle1" mb={1}>
						{t('attachment')}
					</Typography>
					<Paper
						elevation={3}
						sx={{
							padding: 2,
							textAlign: 'center',
							border: '2px dashed #ccc',
							borderRadius: 2,
							cursor: 'pointer',
							width: '100%',
							maxWidth: '500px',
							minWidth: '250px',
						}}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onClick={handleClickUploadZone}
					>
						<Typography variant="subtitle1" mb={1}>
							{t('dragAndDrop')}
						</Typography>
						<CloudUpload sx={{ fontSize: 40, color: 'lightskyblue' }} />
						<input
							type="file"
							ref={fileInputRef}
							//accept=".png,.jpg,.jpeg,.pdf,.doc"
							onChange={(e) =>
								e.target.files && handleFileUpload(Array.from(e.target.files))
							}
							multiple
							style={{ display: 'none' }}
							id="file-upload"
						/>
					</Paper>
					<Box mt={2}>
						{files.map((file) => (
							<Paper
								key={file.id}
								elevation={1}
								sx={{
									padding: 2,
									display: 'flex',
									alignItems: 'center',
									mb: 1,
									position: 'relative',
									backgroundColor:
										file.status === 'failed' ? '#ffe6e6' : 'white',
									border:
										file.status === 'failed' ? '1px solid #ff4d4d' : 'none',
								}}
							>
								{file.status === 'failed' ? (
									<ErrorOutline color="error" sx={{ mr: 2 }} />
								) : (
									<AttachFile color="primary" sx={{ mr: 2 }} />
								)}
								<Box display={'flex'} flexDirection={'column'} flexGrow={1}>
									<Typography
										variant="caption"
										fontWeight="bold"
										color={file.status === 'failed' ? 'error' : 'textPrimary'}
									>
										{file.name}
									</Typography>
									<Typography variant="caption" color="textSecondary">
										{file.size} •{' '}
										{file.status === 'failed'
											? file.error
											: file.status === 'loading'
												? 'Loading'
												: 'Complete'}
									</Typography>
									{file.status === 'loading' && (
										<LinearProgress
											variant="determinate"
											value={file.progress}
											sx={{ mt: 1 }}
										/>
									)}

									{file.status === 'failed' && (
										<LinearProgress
											variant="determinate"
											value={100}
											sx={{
												mt: 1,
												backgroundColor: '#ffcccc',
												'& .MuiLinearProgress-bar': {
													backgroundColor: '#ff4d4d',
												},
											}}
										/>
									)}
								</Box>

								<IconButton
									size="small"
									onClick={() => handleFileRemove(file.id)}
									sx={{
										position: 'absolute',
										top: -5,
										right: -5,
										color: '#ccc',
									}}
								>
									<ClearIcon />
								</IconButton>
							</Paper>
						))}
					</Box>
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
