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
	useDeleteModuleDocument,
	useGetAllModuleAttachments,
	useGetModuleDocumentById,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { Delete, Edit } from '@mui/icons-material';
import { AttachmentList } from '../../components';

export default function ModuleDocumentDetailPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	// const files = useState();
	const dialogs = useDialogs();
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

	const handleCancel = () => {
		navigate(-1);
	};

	const [deleteDocumentTrigger] = useDeleteModuleDocument();
	const handleDelete = async (documentId: string) => {
		const confirmed = await dialogs.confirm(t('deleteModuleDocumentConfirm'), {
			title: t('deleteConfirm'),
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;
		try {
			await deleteDocumentTrigger(documentId);
			navigate(-1);
			notifications.show(t('deleteModuleDocumentSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('deleteModuleDocumentError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.log(error);
		}
	};

	const attachments = useGetAllModuleAttachments(documentId!, {
		skip: !documentId,
	});

	if (moduleDocument.isLoading) return <LinearProgress />;
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
								RoutePaths.MODIFY_MODULE_DOCUMENT.replace(
									`:${PathHolders.MODULE_DOCUMENT_ID}`,
									documentId || '',
								),
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
					<Typography variant="body1">
						<strong>{t('documentTypeName')}:</strong>
					</Typography>
					<Typography variant="body1">
						{moduleDocument.data?.typeName}
					</Typography>
				</Stack>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="body1">
						<strong>{t('documentName')}:</strong>
					</Typography>
					<Typography variant="body1">{moduleDocument.data?.name}</Typography>
				</Stack>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="body1">
						<strong>{t('description')}:</strong>
					</Typography>
					<Typography variant="body1">
						{moduleDocument.data?.description}
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
