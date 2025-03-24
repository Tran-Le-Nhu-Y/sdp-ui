import { List, ListItem } from '@mui/material';
import Attachment from './Attachment';

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
					<Attachment file={file} onRemoveClick={onRemoveClick} />
				</ListItem>
			))}
		</List>
	);
};
