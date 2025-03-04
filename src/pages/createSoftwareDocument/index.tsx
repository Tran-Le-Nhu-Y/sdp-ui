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
import { DragAndDropForm } from '../../components';
import { useEffect, useState } from 'react';
import { useNotifications, useSession } from '@toolpad/core';
import {
	useCreateFile,
	useCreateSoftwareDocument,
	useGetAllDocumentTypesByUserId,
} from '../../services';
import {
	HideDuration,
	isValidLength,
	PathHolders,
	TextLength,
} from '../../utils';

export default function CreateSoftwareDocumentPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notifications = useNotifications();
	const softwareVersionId = useParams()[PathHolders.SOFTWARE_VERSION_ID];
	const session = useSession();
	const userId = session?.user?.id ?? '';

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

	const [createTrigger, { isLoading: isCreating }] =
		useCreateSoftwareDocument();
	const [documentCreating, setDocumentCreating] = useState<
		Partial<SoftwareDocumentCreateRequest>
	>({});

	const [files, setFiles] = useState<File[]>([]);
	const [uploadFileTrigger] = useCreateFile();
	const handleFilesChange = (uploadedFiles: File[]) => {
		setFiles(uploadedFiles);
	};
	const handleCancel = () => {
		navigate(-1);
	};

	const handleSubmit = async () => {
		const validate = () => {
			if (!documentCreating.documentTypeId) {
				notifications.show(t('documentTypeRequired'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}

			if (!documentCreating.name?.trim()) {
				notifications.show(t('softwareDocumentNameRequired'), {
					severity: 'warning',
					autoHideDuration: HideDuration.fast,
				});
				return false;
			}

			return true;
		};
		if (!validate()) return;

		try {
			const fileIds = await Promise.all(
				files.map((file) => {
					return uploadFileTrigger({ userId, file }).unwrap();
				}),
			);
			await createTrigger({
				softwareVersionId: softwareVersionId!,
				documentTypeId: documentCreating.documentTypeId!,
				name: documentCreating.name!,
				description: documentCreating.description,
				attachmentIds: fileIds,
			}).unwrap();

			notifications.show(t('createSoftwareDocumentSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
			navigate(-1);
		} catch (error) {
			notifications.show(t('createSoftwareDocumentError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	if (documentTypes.isLoading) return <LinearProgress />;
	return (
		<Stack spacing={1}>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addSoftwareDocument')}
			</Typography>
			{isCreating && <LinearProgress />}
			<Stack mb={2}>
				<FormControl fullWidth size="small">
					<InputLabel>{t('documentType')}</InputLabel>
					<Select
						label={t('documentType')}
						value={documentCreating.documentTypeId || ''}
						onChange={(e) =>
							setDocumentCreating((prev) => ({
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
				value={documentCreating?.name}
				helperText={t('hyperTextMedium')}
				onChange={(e) => {
					const newValue = e.target.value;
					if (isValidLength(newValue, TextLength.Medium))
						setDocumentCreating((prev) => ({
							...prev,
							name: newValue,
						}));
				}}
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
						helperText={t('hyperTextVeryLong')}
						value={documentCreating?.description}
						onChange={(e) => {
							const newValue = e.target.value;
							if (isValidLength(newValue, TextLength.VeryLong))
								setDocumentCreating((prev) => ({
									...prev,
									description: newValue,
								}));
						}}
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
