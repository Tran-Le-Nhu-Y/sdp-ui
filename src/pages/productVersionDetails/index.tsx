import { useState } from 'react';
import {
	Card,
	Typography,
	IconButton,
	Stack,
	Box,
	Chip,
	TextField,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTranslation } from 'react-i18next';
import { FilterableTable } from '../../components';
import { Delete, Edit } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectAllFiles } from '../../redux/slices/FileSlice';

const ProductVersionDetail = () => {
	const { t } = useTranslation();
	const [showChangeLog, setShowChangeLog] = useState(false);
	const [version, setVersion] = useState('1.0');

	const files = useSelector(selectAllFiles);

	const columns = [
		{ key: 'version', label: t('version'), filterable: true },
		{ key: 'createdAt', label: t('dateCreated') },
		{ key: 'updatedAt', label: t('lastUpdated') },
		{ key: 'status', label: t('status'), filterable: true },
		{ key: 'actions', label: ' ' },
	];

	const data = [
		{
			version: '1.0',
			createdAt: '10pm 04/03/2019',
			updatedAt: '04/03/2019',
			status: 'Đang hoạt động',
		},
		{
			version: '2.0',
			createdAt: '04/03/2019',
			updatedAt: '04/03/2019',
			status: 'Đang hoạt động',
		},
	];

	return (
		<Stack>
			<Stack>
				<Typography variant="h5" textAlign="center">
					Tên sản phẩm ở đây
				</Typography>
				<Typography
					variant="caption"
					mb={3}
					textAlign="center"
					color="textSecondary"
				>
					ID: 3b5af8db-09ed-4e92-910b-f6889c55cdef
				</Typography>
			</Stack>
			<Stack>
				{/* Version, Status, Dates & Actions */}
				<Stack direction="row" alignItems="center" spacing={10} mb={3}>
					<Box display="flex" alignItems="center" gap={1}>
						<Typography variant="body2">Phiên bản:</Typography>
						<TextField
							size="small"
							value={version}
							onChange={(e) => setVersion(e.target.value)}
							sx={{ width: 60 }}
						/>
					</Box>
					<Box display="flex" alignItems="center" gap={1}>
						<Typography variant="body2">Trạng thái:</Typography>
						<Chip
							label="Đang hoạt động"
							color="primary"
							sx={{ fontWeight: 'bold' }}
						/>
					</Box>
					<Box display="flex" alignItems="center" gap={10}>
						<Typography variant="body2">
							Ngày tạo: <strong>04/03/2019</strong>
						</Typography>
						<Typography variant="body2">
							Cập nhật lần cuối: <strong>04/03/2019</strong>
						</Typography>

						<Box>
							<IconButton color="primary">
								<Edit />
							</IconButton>
							<IconButton color="error">
								<Delete />
							</IconButton>
						</Box>
					</Box>
				</Stack>
				<Stack>
					<Stack
						direction={'row'}
						alignItems={'center'}
						justifyContent={'space-between'}
					>
						<Typography
							variant="body2"
							color="textSecondary"
							sx={{ opacity: 0.6 }}
						>
							{t('changeLog')}
						</Typography>
						<IconButton onClick={() => setShowChangeLog(!showChangeLog)}>
							{showChangeLog ? (
								<KeyboardArrowUpIcon />
							) : (
								<KeyboardArrowDownIcon />
							)}
						</IconButton>
					</Stack>
					<Stack mb={5}>
						{showChangeLog && (
							<Stack>
								<TextField
									id="filled-multiline-static"
									multiline
									rows={5}
									variant="filled"
									fullWidth
									disabled
								/>{' '}
								<List sx={{ marginTop: 2 }}>
									<Typography variant="h6">
										Danh sách file đã tải lên:
									</Typography>
									{files.length > 0 ? (
										files.map((file, index) => (
											<ListItem key={index}>
												<ListItemText
													primary={file.name}
													secondary={`${(file.size / 1024).toFixed(2)} KB`}
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
						)}
					</Stack>
				</Stack>

				<Card>
					<FilterableTable
						columns={columns}
						data={data}
						addButtonText={t('addVersion')}
						onAddFilter={() => console.log('Add version')}
					/>
				</Card>
			</Stack>
		</Stack>
	);
};

export default ProductVersionDetail;
