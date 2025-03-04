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
import { AttachmentList, DragAndDropForm } from '../../components';
import { useEffect, useMemo, useState } from 'react';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import SaveIcon from '@mui/icons-material/Save';
import {
	useCreateFile,
	useGetAllSoftDocAttachments,
	useGetSoftwareDocumentById,
	useUpdateSoftDocAttachment,
	useUpdateSoftwareDocument,
} from '../../services';
import {
	HideDuration,
	isValidLength,
	PathHolders,
	TextLength,
} from '../../utils';

export default function ModifySoftwareDocumentPage() {
	const { t } = useTranslation();
	const dialogs = useDialogs();
	const navigate = useNavigate();
	const notifications = useNotifications();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const documentId = useParams()[PathHolders.SOFTWARE_DOCUMENT_ID];
	const [loading, setLoading] = useState(false);

	const document = useGetSoftwareDocumentById(documentId!, {
		skip: !documentId,
	});
	useEffect(() => {
		if (document.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, document.isError, t]);

	const [softwareDocumentUpdating, setSoftwareDocumentUpdating] =
		useState<SoftwareDocumentUpdateRequest>({
			softwareDocumentId: documentId!,
			name: '',
			description: '',
		});
	useEffect(() => {
		if (document.data)
			setSoftwareDocumentUpdating({
				softwareDocumentId: documentId!,
				name: document.data.name || '',
				description: document.data.description || '',
			});
	}, [document.data, documentId]);

	const attachments = useGetAllSoftDocAttachments(documentId!, {
		skip: !documentId,
	});

	const [addedFiles, setAddedFiles] = useState<File[]>([]);
	const [removedFileIds, setRemovedFileIds] = useState<string[]>([]);
	const displayedAttachments = useMemo(() => {
		return attachments.data?.filter(
			(data) => !removedFileIds.includes(data.id),
		);
	}, [attachments.data, removedFileIds]);
	const [updateSoftwareDocumentTrigger] = useUpdateSoftwareDocument();
	const [updateAttachmentTrigger] = useUpdateSoftDocAttachment();
	const [uploadFileTrigger] = useCreateFile();

	const handleFileSubmit = async () => {
		if (!documentId) return false;

		if (addedFiles.length > 0) {
			try {
				const fileIds = await Promise.all(
					addedFiles.map((file) => {
						return uploadFileTrigger({ userId, file }).unwrap();
					}),
				);
				await Promise.all(
					fileIds.map((fileId) =>
						updateAttachmentTrigger({
							documentId,
							attachmentId: fileId,
							operator: 'ADD',
						}).unwrap(),
					),
				);
			} catch (error) {
				notifications.show(t('uploadedFileError'), {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.log(error);
				return false;
			}
		}

		if (removedFileIds.length > 0) {
			try {
				await Promise.all(
					removedFileIds.map((fileId) =>
						updateAttachmentTrigger({
							documentId,
							attachmentId: fileId,
							operator: 'REMOVE',
						}).unwrap(),
					),
				);
			} catch (error) {
				notifications.show(t('deleteFileError'), {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.log(error);
				return false;
			}
		}

		return true;
	};

	const handleSubmit = async () => {
		if (!documentId) return;

		setLoading(true);
		if (!softwareDocumentUpdating.name.trim()) {
			notifications.show(t('softwareDocumentNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			setLoading(false);
			return;
		}

		const handleFileResult = await handleFileSubmit();
		if (!handleFileResult) {
			setAddedFiles([]);
			setRemovedFileIds([]);
			setLoading(false);
			return;
		}

		try {
			await updateSoftwareDocumentTrigger({
				softwareDocumentId: documentId,
				name: softwareDocumentUpdating.name,
				description: softwareDocumentUpdating?.description,
			});
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
		setLoading(false);
	};

	const handleCancel = () => {
		navigate(-1);
	};

	const deleteAttachment = async (attachmentId: string) => {
		if (!documentId) return;

		const confirmed = await dialogs.confirm(t('deleteFileConfirm'), {
			title: t('deleteFile'),
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;
		setRemovedFileIds((prev) => [...prev, attachmentId]);
	};

	if (document.isLoading) return <LinearProgress />;
	return (
		<Stack spacing={2}>
			<Typography variant="h5" mb={3} textAlign="center">
				{t('modifySoftwareDocument')}
			</Typography>

			<Stack direction={'row'} spacing={1} alignItems={'center'}>
				<Typography variant="h6">{t('documentType')}:</Typography>
				<Typography variant="body1">{document.data?.typeName}</Typography>
			</Stack>

			<TextField
				size="small"
				label={t('documentName')}
				value={softwareDocumentUpdating?.name}
				helperText={`${t('max')} ${TextLength.Medium} ${t('character')}`}
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

			<TextField
				fullWidth
				size="medium"
				label={t('documentDescription') ?? ''}
				value={softwareDocumentUpdating?.description}
				helperText={`${t('max')} ${TextLength.VeryLong} ${t('character')}`}
				onChange={(e) => {
					const newValue = e.target.value;
					if (isValidLength(newValue, TextLength.Long))
						setSoftwareDocumentUpdating((prev) => ({
							...prev,
							description: newValue,
						}));
				}}
				placeholder={`${t('enter')} ${t('documentDescription').toLowerCase()}...`}
				multiline
				rows={4}
			/>

			<Stack spacing={1}>
				<Typography variant="h6">{t('uploadedFiles')}:</Typography>
				{(attachments.data?.length ?? 0) > 0 ? (
					<AttachmentList
						attachments={displayedAttachments ?? []}
						onRemoveClick={deleteAttachment}
					/>
				) : (
					<Typography variant="h6">{t('noFileUpload')}</Typography>
				)}
			</Stack>

			<Stack spacing={1}>
				<Typography variant="h6">{t('attachment')}:</Typography>
				<DragAndDropForm onFilesChange={(files) => setAddedFiles(files)} />
			</Stack>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button
					disabled={document.isLoading || document.isFetching}
					loading={loading}
					loadingPosition="start"
					startIcon={<SaveIcon />}
					variant="contained"
					color="primary"
					onClick={handleSubmit}
				>
					{t('submit')}
				</Button>
				<Button variant="outlined" color="secondary" onClick={handleCancel}>
					{t('cancel')}
				</Button>
			</Box>
		</Stack>
	);
}
