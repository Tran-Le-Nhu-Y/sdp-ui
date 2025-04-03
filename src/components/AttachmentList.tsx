import { List, ListItem } from '@mui/material';
import Attachment from './Attachment';

export interface AttachmentListProps {
	attachments: Array<FileMetadata>;
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
				flexDirection: 'row',
				gap: 1,
				border: '1px solid #ccc',
				borderRadius: 1,
				maxHeight: 350,
				width: '100%',
				overflowX: 'auto',
			}}
		>
			{attachments.map((file) => (
				<ListItem key={file.id} sx={{ width: '100%' }}>
					<Attachment metadata={file} onRemoveClick={onRemoveClick} />
				</ListItem>
			))}
		</List>
	);
};
