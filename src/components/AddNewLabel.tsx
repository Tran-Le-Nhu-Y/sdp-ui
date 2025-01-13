import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { Label } from '@mui/icons-material';

const getRandomColor = () => {
	// Generate a random hex color
	return `#${Math.floor(Math.random() * 20052003)
		.toString(16)
		.padStart(6, '0')}`;
};

interface Label {
	name: string;
	description: string;
	color: string;
}

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (
		event: React.MouseEvent<HTMLButtonElement>,
		newPage: number,
	) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box sx={{ flexShrink: 0, ml: 2.5 }}>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label="first page"
			>
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton
				onClick={handleBackButtonClick}
				disabled={page === 0}
				aria-label="previous page"
			>
				{theme.direction === 'rtl' ? (
					<KeyboardArrowRight />
				) : (
					<KeyboardArrowLeft />
				)}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="next page"
			>
				{theme.direction === 'rtl' ? (
					<KeyboardArrowLeft />
				) : (
					<KeyboardArrowRight />
				)}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label="last page"
			>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
}

const LabelManager: React.FC = () => {
	const { t } = useTranslation();
	const [showNewLabel, setShowNewLabel] = useState(false);
	const [labelName, setLabelName] = useState('');
	const [labelDescription, setLabelDescription] = useState('');
	const [labelColor, setLabelColor] = useState('#0e8a16');
	const [labels, setLables] = useState<Label[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const handleNewLabelClick = () => {
		setShowNewLabel(true);
	};

	const handleRandomColor = () => {
		const randomColor = getRandomColor();
		setLabelColor(randomColor);
	};

	const handleCancel = () => {
		setShowNewLabel(false);
		setLabelName('');
		setLabelDescription('');
		setLabelColor('#0e8a16');
	};

	const handleCreateLabel = () => {
		const newLabel: Label = {
			name: labelName,
			description: labelDescription,
			color: labelColor,
		};
		setLables([...labels, newLabel]);
		setShowNewLabel(false);
		setLabelName('');
		setLabelDescription('');
		setLabelColor('');
	};

	const handleDeleteLabel = (index: number) => {
		setLables(labels.filter((_, i) => i !== index));
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - labels.length) : 0;

	const handleChangePage = (
		_event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const paginatedLabels =
		rowsPerPage > 0
			? labels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
			: labels;

	return (
		<Box sx={{ padding: 2 }}>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<Stack direction="row" spacing={1} alignItems="center">
					<TextField
						placeholder={t('search') as string}
						size="small"
						variant="outlined"
						sx={{ width: 300 }}
					/>
				</Stack>
				<Button
					variant="contained"
					color="success"
					onClick={handleNewLabelClick}
				>
					{t('addDocumentLabel')}
				</Button>
			</Stack>
			{showNewLabel && (
				<Box
					sx={{
						padding: 2,
						border: '1px solid #e0e0e0',
						borderRadius: '8px',
						backgroundColor: '#f9f9f9',
					}}
				>
					<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
						<Typography variant="subtitle1">{t('labelPreview')}:</Typography>
						<Chip
							label={labelName || 'Label name'}
							size="small"
							sx={{
								backgroundColor: labelColor,
								color: '#fff',
								fontWeight: 'bold',
							}}
						/>
					</Stack>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							label={t('labelName') as string}
							value={labelName}
							onChange={(e) => setLabelName(e.target.value)}
							variant="outlined"
							size="small"
							fullWidth
						/>
						<TextField
							label={t('description') as string}
							value={labelDescription}
							onChange={(e) => setLabelDescription(e.target.value)}
							variant="outlined"
							size="small"
							fullWidth
						/>
						<Stack direction="row" spacing={1} alignItems="center">
							<IconButton color="secondary" onClick={handleRandomColor}>
								<CachedIcon />
							</IconButton>
							<TextField
								label={t('color') as string}
								value={labelColor}
								onChange={(e) => setLabelColor(e.target.value)}
								variant="outlined"
								size="small"
								sx={{ width: 120 }}
							/>
						</Stack>
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
						<Button variant="outlined" onClick={handleCancel}>
							{t('cancel')}
						</Button>
						<Button
							variant="contained"
							color="success"
							onClick={handleCreateLabel}
						>
							{t('submit')}
						</Button>
					</Stack>
				</Box>
			)}
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 'bold' }}>{t('label')}</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}>
								{t('description')}
							</TableCell>
							<TableCell sx={{ fontWeight: 'bold' }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedLabels.map((label, index) => (
							<TableRow key={index}>
								<TableCell>
									<Chip
										label={label.name}
										sx={{
											backgroundColor: label.color,
											color: '#fff',
											fontWeight: 'bold',
										}}
									/>
								</TableCell>
								<TableCell>{label.description}</TableCell>
								<TableCell>
									<Button
										variant="outlined"
										color="primary"
										sx={{ marginRight: 1 }}
									>
										{t('edit')}
									</Button>
									<Button
										variant="outlined"
										color="error"
										onClick={() => handleDeleteLabel(index)}
									>
										{t('delete')}
									</Button>
								</TableCell>
							</TableRow>
						))}

						{emptyRows > 0 && (
							<TableRow style={{ height: 53 * emptyRows }}>
								<TableCell colSpan={6} />
							</TableRow>
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
								colSpan={3}
								count={labels.length}
								rowsPerPage={rowsPerPage}
								page={page}
								slotProps={{
									select: {
										inputProps: {
											'aria-label': 'rows per page',
										},
										native: true,
									},
								}}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default LabelManager;
