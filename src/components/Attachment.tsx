import { AttachFile } from '@mui/icons-material';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { getFileSize } from '../utils';
import ClearIcon from '@mui/icons-material/Clear';

const Attachment = ({
	file,
	onRemoveClick,
}: {
	file: { id: string; name: string; size: number };
	onRemoveClick?: (fileId: string) => void;
}) => {
	return (
		<Tooltip title={file.name} arrow>
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
						{file.name}
					</Typography>
					<Typography variant="caption" color="textSecondary">
						{getFileSize(file.size)}
					</Typography>
				</Box>

				{onRemoveClick && (
					<IconButton
						size="small"
						onClick={(e) => {
							e.stopPropagation();
							onRemoveClick(file.id);
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
	);
};

export default Attachment;
