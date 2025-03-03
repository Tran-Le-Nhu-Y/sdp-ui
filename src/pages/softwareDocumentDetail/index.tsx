import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Stack,
	Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';
import {
	useDeleteSoftwareDocument,
	useGetAllSoftDocAttachments,
	useGetSoftwareDocumentById,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { Delete, Edit } from '@mui/icons-material';
import { AttachmentList } from '../../components';

export default function SoftwareDocumentDetailPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dialogs = useDialogs();
	const notifications = useNotifications();
	const documentId = useParams()[PathHolders.SOFTWARE_DOCUMENT_ID];

	const softwareDocument = useGetSoftwareDocumentById(documentId!, {
		skip: !documentId,
	});
	useEffect(() => {
		if (softwareDocument.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, softwareDocument.isError, t]);

	const handleCancel = () => {
		navigate(-1);
	};
	const [deleteDocumentTrigger] = useDeleteSoftwareDocument();
	const handleDelete = async (documentId: string) => {
		const confirmed = await dialogs.confirm(
			t('deleteSoftwareDocumentConfirm'),
			{
				okText: t('yes'),
				cancelText: t('cancel'),
			}
		);
		if (!confirmed) return;
		try {
			await deleteDocumentTrigger(documentId).unwrap();
			navigate(-1);
			notifications.show(t('deleteSoftwareDocumentSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('deleteSoftwareDocumentError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.log(error);
		}
	};

	const attachments = useGetAllSoftDocAttachments(documentId!, {
		skip: !documentId,
	});

	if (softwareDocument.isLoading) return <LinearProgress />;
	return (
		<Stack>
			<Typography variant="h5" mb={3} textAlign="center" color="primary">
				{t('documentInfor')}
			</Typography>

			<Box display="flex" alignItems="center" justifyContent={'flex-end'}>
				<Box>
					<IconButton
						color="primary"
						onClick={() =>
							navigate(
								RoutePaths.MODIFY_SOFTWARE_DOCUMENT.replace(
									`:${PathHolders.SOFTWARE_DOCUMENT_ID}`,
									documentId || ''
								)
							)
						}
					>
						<Edit />
					</IconButton>
					<IconButton
						color="error"
						onClick={async () => handleDelete(documentId || '')}
					>
						<Delete />
					</IconButton>
				</Box>
			</Box>

			<Stack spacing={3}>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="h6">{t('documentTypeName')}:</Typography>
					<Typography variant="body1">
						{softwareDocument.data?.typeName}
					</Typography>
				</Stack>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="h6">{t('documentName')}:</Typography>
					<Typography variant="body1">{softwareDocument.data?.name}</Typography>
				</Stack>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="h6">{t('description')}:</Typography>
					<Typography variant="body1">
						{softwareDocument.data?.description}
					</Typography>
				</Stack>
			</Stack>

			<Stack mt={1} spacing={1}>
				<Typography variant="h6">{t('uploadedFiles')}:</Typography>
				{(attachments.data?.length ?? 0) > 0 ? (
					<AttachmentList attachments={attachments.data ?? []} />
				) : (
					<Typography variant="h6">{t('noFileUpload')}</Typography>
				)}
			</Stack>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button variant="outlined" color="primary" onClick={handleCancel}>
					{t('return')}
				</Button>
			</Box>
		</Stack>
	);
}
