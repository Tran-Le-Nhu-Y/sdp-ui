import { Stack } from '@mui/material';
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
		<Stack
			sx={{
				border: '1px solid #ccc',
				borderRadius: 1,
				overflowX: 'auto',
			}}
			width={'100%'}
			direction={'row'}
			spacing={1}
			padding={1}
		>
			{attachments.map((file) => (
				<Attachment
					key={file.id}
					metadata={file}
					onRemoveClick={onRemoveClick}
				/>
			))}
		</Stack>
	);
};
