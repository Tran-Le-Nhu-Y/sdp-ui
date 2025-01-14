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
import { isValidLength, TextLength } from '../../utils';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
	createNewLabel,
	deleteLabelById,
	selectAllLabels,
	updateLabel,
} from '../../redux/slices/DocumentLabelSlice';

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

export default function DocumentLabelPage() {
	const { t } = useTranslation();

	const labels = useAppSelector(selectAllLabels);
	const dispatch = useAppDispatch();

	const [showCreatingLabelPanel, setShowCreatingLabelPanel] = useState(false);
	const [labelName, setLabelName] = useState('');
	const [labelDescription, setLabelDescription] = useState('');
	const [labelColor, setLabelColor] = useState('#0e8a16');
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [currentLabel, setCurrentLabel] = useState<DocumentLabel | null>(null);

	const handleRandomColor = () => {
		const getRandomColor = () => {
			// Generate a random hex color
			return `#${Math.floor(Math.random() * 20052003)
				.toString(16)
				.padStart(6, '0')}`;
		};
		const randomColor = getRandomColor();
		if (editingIndex !== null && currentLabel) {
			setCurrentLabel((prev) => ({
				...prev!,
				color: randomColor,
			}));
		} else setLabelColor(randomColor);
	};

	const handleCancel = () => {
		setShowCreatingLabelPanel(false);
		resetFields();
	};

	const resetFields = () => {
		setLabelName('');
		setLabelDescription('');
		setLabelColor('#0e8a16');
	};

	const handleCreateLabel = () => {
		// call creating label api here
		const newLabel: DocumentLabel = {
			id: `${Math.random()}`,
			name: labelName,
			description: labelDescription,
			color: labelColor,
		};
		dispatch(createNewLabel(newLabel));

		setShowCreatingLabelPanel(false);
		resetFields();
	};

	const handleDeleteLabel = (id: string) => {
		dispatch(deleteLabelById(id));
	};

	const handleEditLabel = (index: number) => {
		setEditingIndex(index);
		setCurrentLabel({ ...labels[index] });
	};

	const handleSaveEditLabel = () => {
		if (editingIndex !== null && currentLabel) {
			dispatch(updateLabel(currentLabel));
			setEditingIndex(null);
			setCurrentLabel(null);
		}
	};

	const handleCancelEdit = () => {
		setEditingIndex(null);
		setCurrentLabel(null);
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
					onClick={() => setShowCreatingLabelPanel(true)}
				>
					{t('addDocumentLabel')}
				</Button>
			</Stack>
			{showCreatingLabelPanel && (
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
							label={labelName || t('labelName')}
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
							onChange={(e) => {
								const newValue = e.target.value;
								if (isValidLength(newValue, TextLength.Medium))
									setLabelName(newValue);
							}}
							variant="outlined"
							size="small"
							maxRows={1}
							fullWidth
						/>
						<TextField
							label={t('description') as string}
							value={labelDescription}
							onChange={(e) => {
								const newValue = e.target.value;
								if (isValidLength(newValue, TextLength.VeryLong))
									setLabelDescription(newValue);
							}}
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
							<TableCell align="left" sx={{ fontWeight: 'bold' }}>
								{t('label')}
							</TableCell>
							<TableCell align="left" sx={{ fontWeight: 'bold' }}>
								{t('description')}
							</TableCell>
							<TableCell align="right" sx={{ fontWeight: 'bold' }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedLabels.map((label, index) => (
							<TableRow key={index}>
								{editingIndex === index ? (
									<>
										<TableCell align="left">
											<Stack
												direction="column"
												spacing={2}
												alignItems="flex-start"
												justifyContent={'space-between'}
											>
												<Chip
													label={currentLabel?.name || t('labelName')}
													sx={{
														backgroundColor: currentLabel?.color || '#ccc',
														color: '#fff',
														fontWeight: 'bold',
													}}
												/>
												<TextField
													label={t('labelName') as string}
													value={currentLabel?.name}
													onChange={(e) =>
														setCurrentLabel((prev) => ({
															...prev!,
															name: e.target.value,
														}))
													}
													size="small"
												/>
											</Stack>
										</TableCell>
										<TableCell align="left">
											<Stack
												direction="column"
												spacing={2}
												alignItems="flex-start"
												justifyContent={'space-between'}
											>
												<Chip
													sx={{
														backgroundColor: 'white',
														color: '#fff',
													}}
												/>
												<Stack
													direction="row"
													alignItems="flex-end"
													justifyContent={'space-between'}
												>
													<TextField
														label={t('description') as string}
														value={currentLabel?.description}
														onChange={(e) =>
															setCurrentLabel((prev) => ({
																...prev!,
																description: e.target.value,
															}))
														}
														fullWidth
														size="small"
													/>
													<Stack direction="row" alignItems="center">
														<IconButton
															color="secondary"
															onClick={handleRandomColor}
														>
															<CachedIcon />
														</IconButton>
														<TextField
															label={t('color') as string}
															value={currentLabel?.color}
															onChange={(e) =>
																setCurrentLabel((prev) => ({
																	...prev!,
																	color: e.target.value,
																}))
															}
															size="small"
														/>
													</Stack>
												</Stack>
											</Stack>
										</TableCell>
										<TableCell align="left">
											<Stack
												direction="column"
												spacing={2}
												alignItems="flex-end"
												justifyContent={'space-between'}
											>
												<Button
													variant="outlined"
													color="error"
													onClick={() => handleDeleteLabel(label.id)}
												>
													{t('delete')}
												</Button>
												<Stack
													direction="row"
													alignItems="flex-end"
													justifyContent={'space-between'}
													spacing={1}
												>
													<Button variant="outlined" onClick={handleCancelEdit}>
														{t('cancel')}
													</Button>
													<Button
														variant="contained"
														color="success"
														onClick={handleSaveEditLabel}
													>
														{t('save')}
													</Button>
												</Stack>
											</Stack>
										</TableCell>
									</>
								) : (
									<>
										<TableCell align="left">
											<Chip
												label={label.name}
												sx={{
													backgroundColor: label.color,
													color: '#fff',
													fontWeight: 'bold',
												}}
											/>
										</TableCell>
										<TableCell align="left">{label.description}</TableCell>
										<TableCell align="right">
											<Button
												variant="outlined"
												color="primary"
												sx={{ marginRight: 1 }}
												onClick={() => handleEditLabel(index)}
											>
												{t('edit')}
											</Button>
											<Button
												variant="outlined"
												color="error"
												onClick={() => handleDeleteLabel(label.id)}
											>
												{t('delete')}
											</Button>
										</TableCell>
									</>
								)}
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
}
