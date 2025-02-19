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
	useGetSoftwareDocumentById,
	useUpdateSoftwareDocument,
} from '../../services';
import {
	hideDuration,
	isValidLength,
	PathHolders,
	TextLength,
} from '../../utils';

export default function ModifySoftwareDocumentPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const notifications = useNotifications();
	const documentId = useParams()[PathHolders.SOFTWARE_DOCUMENT_ID];

	const softwareDocument = useGetSoftwareDocumentById(documentId!, {
		skip: !documentId,
	});
	useEffect(() => {
		if (softwareDocument.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
	}, [notifications, softwareDocument.isError, t]);

	const [softwareDocumentUpdating, setSoftwareDocumentUpdating] =
		useState<SoftwareDocumentUpdatingRequest>({
			softwareDocumentId: documentId!,
			name: '',
			description: '',
			attachmentIds: [],
		});
	useEffect(() => {
		if (softwareDocument.data) {
			setSoftwareDocumentUpdating({
				softwareDocumentId: documentId!,
				name: softwareDocument.data.name || '',
				description: softwareDocument.data.description || '',
				attachmentIds: [],
			});
		}
	}, [softwareDocument.data, documentId]);

	const [updateSoftwareDocumentTrigger] = useUpdateSoftwareDocument();

	const handleSubmit = async () => {
		if (!documentId) return;

		if (!softwareDocumentUpdating.name.trim()) {
			notifications.show(t('softwareDocumentNameRequired'), {
				severity: 'warning',
				autoHideDuration: hideDuration.fast,
			});
			return;
		}
		try {
			await updateSoftwareDocumentTrigger({
				softwareDocumentId: documentId,
				name: softwareDocumentUpdating.name,
				description: softwareDocumentUpdating?.description,
				attachmentIds: [],
			});
			navigate(-1);
			notifications.show(t('createSoftwareDocumentSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createSoftwareDocumentError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
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

	if (softwareDocument.isLoading) return <LinearProgress />;
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
						{softwareDocument.data?.typeName}
					</Typography>
				</Stack>
				<TextField
					size="small"
					label={t('documentName')}
					value={softwareDocumentUpdating?.name || ''}
					onChange={(e) => {
						const newValue = e.target.value;
						if (isValidLength(newValue, TextLength.Medium))
							setSoftwareDocumentUpdating((prev) => ({
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
						value={softwareDocumentUpdating?.description}
						onChange={(e) =>
							setSoftwareDocumentUpdating((prev) => ({
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
