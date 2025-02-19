import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { hideDuration, PathHolders, RoutePaths } from '../../utils';
import { useGetSoftwareDocumentById } from '../../services';
import { useNotifications } from '@toolpad/core';
import { Delete, Edit } from '@mui/icons-material';

export default function SoftwareDocumentDetailPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const files = useState();

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

	const handleCancel = () => {
		navigate(-1);
	};

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
									documentId || '',
								),
							)
						}
					>
						<Edit />
					</IconButton>
					<IconButton
						color="error"
						onClick={
							async () => {}
							// handleDelete(versionId || '')
						}
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
						{softwareDocument.data?.typeName}
					</Typography>
				</Stack>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="body1">
						<strong>{t('documentName')}:</strong>
					</Typography>
					<Typography variant="body1">
						{softwareDocument.data?.typeName}
					</Typography>
				</Stack>
				<Stack direction={'row'} spacing={2} alignItems={'center'}>
					<Typography variant="body1">
						<strong>{t('description')}:</strong>
					</Typography>
					<Typography variant="body1">
						{softwareDocument.data?.description}
					</Typography>
				</Stack>
			</Stack>

			<Stack mt={1}>
				<List sx={{ marginTop: 2 }}>
					<Typography variant="body1">Danh sách file đã tải lên:</Typography>
					{files.length > 0 ? (
						files.map((_file, index) => (
							<ListItem key={index}>
								<ListItemText
								// primary={file.name}
								// secondary={`${(file.size / 1024).toFixed(2)} KB`}
								/>
							</ListItem>
						))
					) : (
						<Typography variant="body2" color="textSecondary">
							{t('noFileUpload')}
						</Typography>
					)}
				</List>
			</Stack>

			<Box mt={3} display="flex" justifyContent="center" gap={2}>
				<Button variant="outlined" color="primary" onClick={handleCancel}>
					{t('return')}
				</Button>
			</Box>
		</Stack>
	);
}
