import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Button,
	LinearProgress,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { DragAndDropForm } from '../../components';
import { useEffect, useState } from 'react';
import { useNotifications } from '@toolpad/core';
import {
	useGetModuleDocumentById,
	useUpdateModuleDocument,
} from '../../services';
import {
	HideDuration,
	isValidLength,
	PathHolders,
	TextLength,
} from '../../utils';

export default function ModifyModuleDocumentPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notifications = useNotifications();
	const documentId = useParams()[PathHolders.MODULE_DOCUMENT_ID];

	const moduleDocument = useGetModuleDocumentById(documentId!, {
		skip: !documentId,
	});
	useEffect(() => {
		if (moduleDocument.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, moduleDocument.isError, t]);

	const [moduleDocumentUpdating, setModuleDocumentUpdating] =
		useState<ModuleDocumentUpdateRequest>({
			moduleDocumentId: documentId!,
			name: '',
			description: '',
			attachmentIds: [],
		});
	useEffect(() => {
		if (moduleDocument.data) {
			setModuleDocumentUpdating({
				moduleDocumentId: documentId!,
				name: moduleDocument.data.name || '',
				description: moduleDocument.data.description || '',
				attachmentIds: [],
			});
		}
	}, [moduleDocument.data, documentId]);

	const [updateModuleDocumentTrigger] = useUpdateModuleDocument();

	const handleSubmit = async () => {
		if (!documentId) return;

		if (!moduleDocumentUpdating.name.trim()) {
			notifications.show(t('moduleDocumentNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}
		try {
			await updateModuleDocumentTrigger({
				moduleDocumentId: documentId,
				name: moduleDocumentUpdating.name,
				description: moduleDocumentUpdating?.description,
				attachmentIds: [],
			});
			navigate(-1);
			notifications.show(t('updateModuleDocumentSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateModuleDocumentError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	// const handleFilesChange = (files: string[]) => {
	// 	setSoftwareDocumentUpdating((prev) => ({
	// 		...prev,
	// 		attachmentIds: files,
	// 	}));
	// };

	const handleCancel = () => {
		navigate(-1);
	};

	if (moduleDocument.isLoading) return <LinearProgress />;
	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('addDocument')}
			</Typography>
			<Stack spacing={2}>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="body1">
						<strong>{t('documentTypeName')}:</strong>
					</Typography>
					<Typography variant="body1">
						{moduleDocument.data?.typeName}
					</Typography>
				</Stack>
				<TextField
					size="small"
					label={t('documentName')}
					value={moduleDocumentUpdating?.name || ''}
					onChange={(e) => {
						const newValue = e.target.value;
						if (isValidLength(newValue, TextLength.Medium))
							setModuleDocumentUpdating((prev) => ({
								...prev,
								name: newValue,
							}));
					}}
					placeholder={`${t('enter')} ${t('documentName').toLowerCase()}...`}
				/>
			</Stack>

			<Stack mt={1}>
				<Typography variant="subtitle1" mb={1}>
					{t('description')}
				</Typography>
				<Box mb={1}>
					<TextField
						fullWidth
						size="medium"
						value={moduleDocumentUpdating?.description}
						onChange={(e) =>
							setModuleDocumentUpdating((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
						placeholder={`${t('enter')} ${t('documentDescription').toLowerCase()}...`}
						multiline
						rows={4}
					/>
				</Box>

				<DragAndDropForm onFilesChange={() => {}} />
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
