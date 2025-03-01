import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttachFile, CloudUpload, ErrorOutline } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import {
	Box,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	Paper,
	Stack,
	Typography,
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import { getFileSize } from '../utils';

const FILE_MAX_BYTES = 128 * 1000 * 1000; // 128MB
const SUPPORTED_FILE_TYPES = [
	'text/*',
	'image/*',
	'application/xml',
	'application/pdf',
	'application/msword',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export interface FileAttachment {
	id: number;
	status: 'loading' | 'failed' | 'complete';
	progress: number;
	error?: string;
	file: File;
}

export interface DragAndDropFormProps {
	onFilesChange: (files: File[]) => void;
}

export const DragAndDropForm: React.FC<DragAndDropFormProps> = ({
	onFilesChange,
}) => {
	const { t } = useTranslation();

	const [files, setFiles] = useState<FileAttachment[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle file upload
	const selectFileHandler = (selectedFiles: File[]) => {
		const mapped: FileAttachment[] = selectedFiles.map((file) => {
			const size = file.size;
			return {
				id: Date.now() + Math.random(),
				status: size > 3000000 ? 'failed' : 'loading',
				progress: size > 3000000 ? 0 : 0,
				error: size > 3000000 ? 'File too large' : undefined,
				file: file,
			};
		});
		const newFiles = [...files, ...mapped];
		setFiles(newFiles);
		onFilesChange(newFiles.map((f) => f.file));
	};

	const dragOverFileHandler = (e: React.DragEvent) => {
		e.preventDefault();
	};
	const dropFileHandler = (e: React.DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer.files) {
			selectFileHandler(Array.from(e.dataTransfer.files));
		}
	};

	const removeFileHandler = (id: number) => {
		const newFiles = files.filter((file) => file.id !== id);
		setFiles(newFiles);
		onFilesChange(newFiles.map((f) => f.file));
	};

	return (
		<Stack>
			<Typography variant="subtitle1" mb={1}>
				{t('attachment')}
			</Typography>
			<Paper
				elevation={3}
				sx={{
					padding: 1,
					textAlign: 'center',
					justifyContent: 'center',
					border: '2px dashed #ccc',
					borderRadius: 2,
					cursor: 'pointer',
					width: '100%',
				}}
				onDragOver={dragOverFileHandler}
				onDrop={dropFileHandler}
				onClick={() => {
					fileInputRef.current?.click();
				}}
			>
				{files.length === 0 && (
					<Stack direction={'column'} spacing={1} alignItems={'center'}>
						<Typography variant="subtitle1">{t('dragAndDrop')}</Typography>
						<CloudUpload
							sx={{ fontSize: 40, color: 'lightskyblue', display: 'block' }}
						/>
						<Typography variant="caption">
							{`${t('fileSizeLimit')} ${getFileSize(FILE_MAX_BYTES)}`}
						</Typography>
					</Stack>
				)}

				<List
					sx={{
						width: '100%',
						maxHeight: '100%',
						overflow: 'auto',
						display: 'flex',
						gap: 0,
					}}
				>
					{files.map((file) => (
						<ListItem key={file.id}>
							<Paper
								elevation={1}
								sx={{
									padding: 2,
									display: 'flex',
									alignItems: 'center',
									minWidth: 200,
									position: 'relative',
									backgroundColor:
										file.status === 'failed' ? '#ffe6e6' : 'white',
									border:
										file.status === 'failed' ? '1px solid #ff4d4d' : 'none',
								}}
							>
								{file.status === 'failed' ? (
									<ErrorOutline color="error" sx={{ mr: 1 }} />
								) : (
									<AttachFile color="primary" sx={{ mr: 1 }} />
								)}
								<Box display={'flex'} flexDirection={'column'}>
									<Typography
										variant="caption"
										fontWeight="bold"
										color={file.status === 'failed' ? 'error' : 'textPrimary'}
									>
										{file.file.name}
									</Typography>
									<Typography variant="caption" color="textSecondary">
										{getFileSize(file.file.size)}
									</Typography>

									{/* {file.status === 'loading' && (
										<LinearProgress
											variant="determinate"
											value={file.progress}
											sx={{ mt: 1 }}
										/>
									)} */}

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
									onClick={(e) => {
										e.stopPropagation();
										removeFileHandler(file.id);
									}}
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
						</ListItem>
					))}
				</List>
				<input
					multiple
					style={{ display: 'none' }}
					id="file-upload"
					type="file"
					ref={fileInputRef}
					accept={SUPPORTED_FILE_TYPES.join(',')}
					onChange={(e) =>
						e.target.files && selectFileHandler(Array.from(e.target.files))
					}
				/>
			</Paper>
		</Stack>
	);
};
