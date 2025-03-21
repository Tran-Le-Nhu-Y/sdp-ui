import {
	Box,
	IconButton,
	List,
	ListItem,
	Paper,
	Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { AttachFile } from '@mui/icons-material';
import { getFileSize } from '../utils';

export interface AttachmentListProps {
	attachments: Array<{ id: string; name: string; size: number }>;
	onRemoveClick?: (id: string) => void;
}

export const AttachmentList = ({
	attachments,
	onRemoveClick,
}: AttachmentListProps) => {
	return (
		<List
			sx={{
				marginTop: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 1,
				border: '1px solid #ccc',
				borderRadius: 1,
				maxHeight: 350,
				overflowY: 'auto',
			}}
		>
			{attachments.map((file) => (
				<ListItem key={file.id} sx={{ width: '100%' }}>
					<Paper
						elevation={1}
						sx={{
							padding: 2,
							display: 'flex',
							alignItems: 'center',
							minWidth: 200,
							width: '100%',
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
				</ListItem>
			))}
		</List>
	);
};
