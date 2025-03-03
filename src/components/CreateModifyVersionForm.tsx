import React, { useState } from 'react';
import {
	Box,
	Button,
	IconButton,
	Stack,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

import 'react-quill/dist/quill.snow.css';
// import DragAndDropForm from './DragAndDropForm';
import TextEditor from './TextEditor';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { PaginationTable } from './PaginationTable';
// import { useNavigate } from 'react-router-dom';

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
		//files: File[];
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

	// const [files, setFiles] = useState<FileAttachment[]>([]);
	//const navigate = useNavigate();

	const [productName, setProductName] = useState(
		showModifyValues?.productNameToShow || ''
	);
	const [description, setDescription] = useState(
		showModifyValues?.descriptionToShow || ''
	);

	// const handleFilesChange = (uploadedFiles: FileAttachment[]) => {
	// 	setFiles(uploadedFiles);
	// };

	const handleSubmit = () => {
		// const uploadedFiles = files
		// 	.filter((file) => file.status === 'complete')
		// 	.map((file) => new File([], file.name)); // Tạo File object (giữ tên file)

		onSubmit({
			productNameProp: productName,
			descriptionProp: description,
			//files: uploadedFiles,
		});
	};

	const [documentTablePage, setDocumentTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const documents = [
		{
			id: '1',
			documentLabel: 'DTYC',
			documentName: 'Tài liệu đặc tả yêu cầu',
			createAt: '01/01/2025',
			updateAt: '02/02/2025',
		},
		{
			id: '2',
			documentLabel: 'DTYC',
			documentName: 'Tài liệu đặc tả yêu cầu',
			createAt: '01/01/2025',
			updateAt: '02/02/2025',
		},
		{
			id: '3',
			documentLabel: 'DTYC',
			documentName: 'Tài liệu đặc tả yêu cầu',
			createAt: '01/01/2025',
			updateAt: '02/02/2025',
		},
	];

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
					<Box>
						<Stack
							direction="row"
							justifyContent="space-between"
							alignItems="center"
							sx={{ marginBottom: 1 }}
						>
							<Button
								variant="contained"
								onClick={
									() => {}
									//() => navigate()
									//`${RoutePaths.CREATE_SOFTWARE_VERSION.replace(`:${PathHolders.SOFTWARE_ID}`, softwareId)}`
								}
							>
								{t('addSoftwareVersion')}
							</Button>
						</Stack>
						<PaginationTable
							headers={
								<>
									<TableCell key={`label-name`}>{t('documentLabel')}</TableCell>
									<TableCell key={`document-name`} align="center">
										{t('documentName')}
									</TableCell>
									<TableCell key={`document-createdAt`} align="center">
										{t('dateCreated')}
									</TableCell>
									<TableCell key={`document-updatedAt`} align="center">
										{t('lastUpdated')}
									</TableCell>
									<TableCell />
									<TableCell />
								</>
							}
							count={documents.length ?? 0}
							rows={documents}
							pageNumber={documentTablePage.pageNumber}
							pageSize={documentTablePage.pageSize}
							onPageChange={
								(newPage) => setDocumentTablePage(newPage)
								// onQueryChange({
								// 	softwareId,
								// 	versionName: versionQuery?.versionName ?? '',
								// 	// status: versionQuery?.status ?? false,
								// 	...newPage,
								// })
							}
							getCell={(row) => (
								<TableRow key={`software_verion-${row.id}`}>
									<TableCell>{row.documentLabel}</TableCell>
									<TableCell align="center">{row.documentName}</TableCell>
									<TableCell align="center">{row.createAt}</TableCell>
									<TableCell align="center">{row.updateAt}</TableCell>
									<TableCell>
										<Stack direction="row">
											<IconButton size="small" onClick={() => {}}>
												<RemoveRedEyeIcon color="info" />
											</IconButton>
											<IconButton size="small" onClick={() => {}}>
												<DeleteIcon color="error" />
											</IconButton>
										</Stack>
									</TableCell>
								</TableRow>
							)}
						/>
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
