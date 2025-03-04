import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	LinearProgress,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { DragAndDropForm, FileAttachment } from '../../components';
import { useEffect, useState } from 'react';
import { useNotifications, useSession } from '@toolpad/core';
import {
	useCreateModuleDocument,
	useGetAllDocumentTypesByUserId,
} from '../../services';
import { HideDuration, PathHolders } from '../../utils';

export default function CreateModuleDocumentPage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const navigate = useNavigate();
	const notifications = useNotifications();
	const [, setFiles] = useState<FileAttachment[]>([]);
	const moduleVersionId = useParams()[PathHolders.MODULE_VERSION_ID];
	const [createModuleDocumentTrigger] = useCreateModuleDocument();
	const [documentTypeQuery] = useState<GetAllDocumentTypeQuery>({
		userId: userId,
		documentTypeName: '',
		pageNumber: 0,
		pageSize: 6,
	});
	const documentTypes = useGetAllDocumentTypesByUserId(documentTypeQuery!, {
		skip: !documentTypeQuery,
	});
	useEffect(() => {
		if (documentTypes.error)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, documentTypes.error, t]);

	const [moduleDocumentCreating, setModuleDocumentCreating] =
		useState<SoftwareDocumentCreateRequest>({
			softwareVersionId: '',
			documentTypeId: '',
			name: '',
		});

	const handleSubmit = async () => {
		if (!moduleVersionId) return;
		const newModuleDoc: ModuleDocumentCreateRequest = {
			moduleVersionId: moduleVersionId,
			documentTypeId: moduleDocumentCreating.documentTypeId,
			name: moduleDocumentCreating.name,
			description: moduleDocumentCreating.description,
			attachmentIds: [],
		};
		if (!moduleDocumentCreating.name.trim()) {
			notifications.show(t('softwareDocumentNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await createModuleDocumentTrigger(newModuleDoc);
			navigate(-1);
			notifications.show(t('createSoftwareDocumentSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createSoftwareDocumentError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	const handleCancel = () => {
		navigate(-1);
	};

	const handleFilesChange = (uploadedFiles: File[]) => {
		// setFiles(uploadedFiles);
	};

	if (documentTypes.isLoading) return <LinearProgress />;
	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addDocument')}
			</Typography>
			<Stack mb={2}>
				<FormControl fullWidth size="small">
					<InputLabel>{t('documentType')}</InputLabel>
					<Select
						label={t('documentType')}
						value={moduleDocumentCreating.documentTypeId || ''}
						onChange={(e) =>
							setModuleDocumentCreating((prev) => ({
								...prev,
								documentTypeId: e.target.value,
							}))
						}
					>
						{documentTypes.data?.content?.map((docType) => (
							<MenuItem key={docType.id} value={docType.id}>
								{docType.name}
							</MenuItem>
						)) || <MenuItem disabled>{t('noData')}</MenuItem>}
					</Select>
				</FormControl>
			</Stack>

			<TextField
				size="small"
				label={t('documentName')}
				value={moduleDocumentCreating?.name}
				onChange={(e) =>
					setModuleDocumentCreating((prev) => ({
						...prev,
						name: e.target.value, // Lưu documentTypeId vào state
					}))
				}
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
						value={moduleDocumentCreating?.description}
						onChange={(e) =>
							setModuleDocumentCreating((prev) => ({
								...prev,
								description: e.target.value, // Lưu documentTypeId vào state
							}))
						}
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
