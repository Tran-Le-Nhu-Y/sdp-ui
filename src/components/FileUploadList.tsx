import { useState } from 'react';
import {
	Button,
	List,
	ListItem,
	ListItemText,
	IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FileUploadList = () => {
	const [files, setFiles] = useState<File[]>([]);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) return;
		const uploadedFiles = Array.from(event.target.files);
		setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
	};

	const handleDeleteFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<div>
			<input
				type="file"
				multiple
				onChange={handleFileUpload}
				style={{ display: 'none' }}
				id="file-upload"
			/>
			<label htmlFor="file-upload">
				<Button variant="contained" component="span">
					Upload File
				</Button>
			</label>

			<List>
				{files.map((file, index) => (
					<ListItem key={index}>
						<ListItemText
							primary={file.name}
							secondary={`${(file.size / 1024).toFixed(2)} KB`}
						/>
						<IconButton
							edge="end"
							aria-label="delete"
							onClick={() => handleDeleteFile(index)}
						>
							<DeleteIcon color="error" />
						</IconButton>
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default FileUploadList;
