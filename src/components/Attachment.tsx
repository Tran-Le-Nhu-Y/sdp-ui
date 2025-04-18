import { AttachFile } from '@mui/icons-material';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { getFileSize, HideDuration } from '../utils';
import ClearIcon from '@mui/icons-material/Clear';
import { getDownloadPath, createDownloadUrl } from '../services';
import { useNotifications } from '@toolpad/core';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

const Attachment = ({
	metadata,
	onRemoveClick,
}: {
	metadata: FileMetadata;
	onRemoveClick?: (fileId: string) => void;
}) => {
	const notification = useNotifications();
	const { t } = useTranslation('standard');

	const download = useCallback(async () => {
		try {
			const path = await getDownloadPath(metadata.id);

			// create "a" HTML element with href to file & click
			const link = document.createElement('a');
			link.href = createDownloadUrl(path);
			link.setAttribute('download', metadata.name);
			link.setAttribute('target', '_blank');
			document.body.appendChild(link);
			link.click();

			// clean up "a" element
			document.body.removeChild(link);
		} catch (error) {
			console.error(error);
			notification.show(t('downloadFileError'), {
				autoHideDuration: HideDuration.fast,
				severity: 'error',
			});
		}
	}, [metadata.id, metadata.name, notification, t]);

	return (
		<Box onClick={download}>
			<Tooltip title={metadata.name} arrow>
				<Paper
					elevation={1}
					sx={{
						padding: 2,
						display: 'flex',
						alignItems: 'center',
						minWidth: 200,
						maxWidth: 300,
						position: 'relative',
					}}
				>
					<AttachFile color="primary" sx={{ mr: 1 }} />
					<Box display={'flex'} flexDirection={'column'}>
						<Typography variant="caption" fontWeight="bold">
							{metadata.name}
						</Typography>
						<Typography variant="caption" color="textSecondary">
							{getFileSize(metadata.size)}
						</Typography>
					</Box>

					{onRemoveClick && (
						<IconButton
							size="small"
							onClick={(e) => {
								e.stopPropagation();
								onRemoveClick(metadata.id);
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
					)}
				</Paper>
			</Tooltip>
		</Box>
	);
};

export default Attachment;
