import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';

import {
	useDeleteDocumentLabel,
	useGetAllDocumentLabelsByUserId,
	useGetDocumentLabelById,
	useUpdateDocumentLabel,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { hideDuration, isValidLength, TextLength } from '../../utils';
import CachedIcon from '@mui/icons-material/Cached';
import { usePostDocumentLabelMutation } from '../../services/document-label';
import { useNavigate } from 'react-router-dom';
import { PaginationTable } from '../../components';

function DocumentLabelPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dialogs = useDialogs();
	const notifications = useNotifications();

	const [showCreatingLabelPanel, setShowCreatingLabelPanel] = useState(false);
	const [labelCreating, setLabelCreating] = useState<{
		name: string;
		description?: string | undefined;
		color: string;
	}>({ name: '', color: '0e8a16' });
	const [editingId, setEditingId] = useState<string | null>(null);
	const [currentLabel, setCurrentLabel] = useState<DocumentLabel | null>(null);
	const [createLabelTrigger, createLabel] = usePostDocumentLabelMutation();
	useEffect(() => {
		if (createLabel.isSuccess)
			notifications.show(t('createLabelSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		else if (createLabel.isError)
			notifications.show(t('createLabelError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
	}, [createLabel.isError, createLabel.isSuccess, notifications, t]);

	const [filteredLabels, setFilteredLabels] = useState({
		userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		labelName: '',
		pageNumber: 0,
		pageSize: 5,
	});
	const labels = useGetAllDocumentLabelsByUserId(filteredLabels);

	useEffect(() => {
		if (labels.error)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
	}, [notifications, labels.error, t]);

	const label = useGetDocumentLabelById(editingId!, { skip: !editingId });
	useEffect(() => {
		if (label.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (label.isSuccess) setCurrentLabel(label.data);
	}, [notifications, label.isError, t, label.isSuccess, label.data]);

	const getRandomColor = () => {
		// Generate a random hex color
		return `${Math.floor(Math.random() * 20052003)
			.toString(16)
			.substring(0, 6)}`;
	};

	const handleCancel = () => {
		setShowCreatingLabelPanel(false);
		resetFields();
	};

	const resetFields = () => {
		setLabelCreating({ name: '', color: '0e8a16' });
	};

	const handleCreateLabel = async () => {
		if (!labelCreating.name.trim()) {
			notifications.show(t('labelNameRequired'), {
				severity: 'warning',
				autoHideDuration: hideDuration.fast,
			});
			return;
		}

		await createLabelTrigger({
			name: labelCreating.name,
			description: labelCreating.description,
			color: labelCreating.color,
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		});

		setShowCreatingLabelPanel(false);
		resetFields();
	};

	const [deleteLabelTrigger, deleteLabel] = useDeleteDocumentLabel();
	useEffect(() => {
		if (deleteLabel.isError)
			notifications.show(t('deleteLabelError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (deleteLabel.isSuccess)
			notifications.show(t('deleteLabelSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
	}, [deleteLabel.isError, deleteLabel.isSuccess, notifications, t]);
	const onDelete = async (labelId: string) => {
		const confirmed = await dialogs.confirm(t('deleteLabelConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteLabelTrigger(labelId);
	};

	const [updateLabelTrigger, updateLabel] = useUpdateDocumentLabel();
	useEffect(() => {
		if (updateLabel.isError)
			notifications.show(t('updateLabelError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (updateLabel.isSuccess) {
			navigate(-1);
			notifications.show(t('updateLabelSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		}
	}, [notifications, t, updateLabel.isError, updateLabel.isSuccess, navigate]);

	const onUpdatingSave = async () => {
		if (editingId !== null && label.data) {
			setEditingId(null);
			setCurrentLabel(null);
			try {
				await updateLabelTrigger({
					labelId: editingId,
					data: {
						name: label.data.name,
						description: label.data.description,
						color: label.data.color,
					},
				}).unwrap();
			} catch (error) {
				console.error(error);
			}
		}
	};

	const onUpdatingCancel = () => {
		setEditingId(null);
	};

	const isLoading = useMemo(
		() => labels.isLoading || createLabel.isLoading || updateLabel.isLoading,
		[createLabel.isLoading, labels.isLoading, updateLabel.isLoading]
	);

	return (
		<Stack spacing={1}>
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
							label={labelCreating.name || t('labelName')}
							size="small"
							sx={{
								backgroundColor: `#${labelCreating.color}`,
								color: '#fff',
								fontWeight: 'bold',
							}}
						/>
					</Stack>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							label={t('labelName') as string}
							value={labelCreating.name}
							helperText={t('hyperTextMedium')}
							onChange={(e) => {
								const newValue = e.target.value;
								if (isValidLength(newValue, TextLength.Medium))
									setLabelCreating((prev) => ({ ...prev, name: newValue }));
							}}
							variant="outlined"
							size="small"
							maxRows={1}
							fullWidth
						/>
						<TextField
							label={t('description') as string}
							value={labelCreating.description}
							helperText={t('hyperTextVeryLong')}
							onChange={(e) => {
								const newValue = e.target.value;
								if (isValidLength(newValue, TextLength.VeryLong))
									setLabelCreating((prev) => ({
										...prev,
										description: newValue,
									}));
							}}
							variant="outlined"
							size="small"
							fullWidth
						/>
						<Stack direction="row" spacing={1} alignItems="flex-start">
							<IconButton
								color="secondary"
								onClick={() =>
									setLabelCreating((prev) => ({
										...prev,
										color: getRandomColor(),
									}))
								}
							>
								<CachedIcon />
							</IconButton>
							<TextField
								label={t('color') as string}
								value={labelCreating.color}
								helperText={t('hyperTextColor')}
								onChange={(e) => {
									const color = e.target.value;
									if (color.match(/^[0-9a-fA-F]{6}$/))
										setLabelCreating((prev) => ({
											...prev,
											color,
										}));
								}}
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
							color="primary"
							onClick={async () => {
								await handleCreateLabel();
							}}
						>
							{t('submit')}
						</Button>
					</Stack>
				</Box>
			)}
			{isLoading ? (
				<LinearProgress />
			) : (
				<PaginationTable
					// filterableCols={[
					// 	{
					// 		key: 'name',
					// 		label: t('labelName'),
					// 	},
					// ]}
					headers={
						<>
							<TableCell key={`label`}>{t('label')}</TableCell>
							<TableCell key={`description`} align="center">
								{t('description')}
							</TableCell>
							<TableCell key={`createdAt`} align="center">
								{t('dateCreated')}
							</TableCell>
							<TableCell key={`updatedAt`} align="center">
								{t('lastUpdated')}
							</TableCell>
							<TableCell />
						</>
					}
					count={labels.data?.totalElements ?? 0}
					rows={labels.data?.content ?? []}
					pageNumber={filteredLabels.pageNumber}
					pageSize={filteredLabels.pageSize}
					onPageChange={(newPage) => {
						setFilteredLabels((prev) => ({ ...prev, ...newPage }));
					}}
					// onAddClick={() => setShowCreatingLabelPanel(true)}
					addButtonText={t('addDocumentLabel')}
					getCell={(row) => (
						<TableRow key={row.id}>
							{editingId === row.id ? (
								<EditableLabel
									isLoading={label.isLoading}
									name={currentLabel?.name}
									description={currentLabel?.description}
									color={currentLabel?.color}
									onNameChange={(e) => {
										setCurrentLabel((prev) => ({
											...prev!,
											name: e.target.value,
										}));
									}}
									onDescriptionChange={(e) => {
										setCurrentLabel((prev) => ({
											...prev!,
											description: e.target.value,
										}));
									}}
									onColorChange={(e) => {
										setCurrentLabel((prev) => ({
											...prev!,
											color: e.target.value,
										}));
									}}
									onGenerateColor={() => {
										setCurrentLabel((prev) => ({
											...prev!,
											color: getRandomColor(),
										}));
									}}
									onSave={onUpdatingSave}
									onCancel={onUpdatingCancel}
									onDelete={() => {
										onDelete(row.id);
									}}
								/>
							) : (
								<>
									<TableCell key={`label`}>
										<Chip
											label={row.name || t('labelName')}
											sx={{
												backgroundColor: `#${row.color ?? 'ccc'}`,
												color: '#fff',
												fontWeight: 'bold',
											}}
										/>
									</TableCell>
									<TableCell key={`description`} align="center">
										{row.description}
									</TableCell>
									<TableCell key={`createAt`} align="center">
										{row.createdAt}
									</TableCell>
									<TableCell key={`updateAt`} align="center">
										{row.updatedAt}
									</TableCell>
									<TableCell>
										<Stack direction="row">
											<IconButton
												size="small"
												onClick={() => setEditingId(row.id)}
											>
												<EditIcon color="info" />
											</IconButton>
											<IconButton
												size="small"
												onClick={async () => onDelete(row.id)}
											>
												<DeleteIcon color="error" />
											</IconButton>
										</Stack>
									</TableCell>
								</>
							)}
						</TableRow>
					)}
				/>
			)}
		</Stack>
	);
}

interface EditableLabelProps {
	isLoading: boolean;
	name?: string;
	description?: string;
	color?: string;
	onNameChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onDescriptionChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onColorChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onGenerateColor: () => void;
	onSave: () => void;
	onCancel: () => void;
	onDelete: () => void;
}

const EditableLabel = ({
	isLoading,
	name,
	description,
	color,
	onNameChange,
	onDescriptionChange,
	onColorChange,
	onGenerateColor,
	onSave,
	onCancel,
	onDelete,
}: EditableLabelProps) => {
	const { t } = useTranslation('standard');
	const colorSettled = `#${color ?? 'ccc'}`;

	if (isLoading) return <LinearProgress />;
	return (
		<>
			<TableCell align="left">
				<Stack
					direction="column"
					spacing={2}
					alignItems="flex-start"
					justifyContent={'space-between'}
				>
					<Chip
						label={name}
						sx={{
							backgroundColor: colorSettled,
							color: '#fff',
							fontWeight: 'bold',
						}}
					/>
					<TextField
						label={t('labelName') as string}
						value={name}
						onChange={onNameChange}
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
					<TextField
						label={t('description') as string}
						value={description}
						onChange={onDescriptionChange}
						fullWidth
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
					<Stack direction="row" alignItems="center">
						<IconButton color="secondary" onClick={onGenerateColor}>
							<CachedIcon />
						</IconButton>
						<TextField
							label={t('color') as string}
							value={colorSettled}
							onChange={onColorChange}
							size="small"
						/>
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
						spacing={1}
					>
						<Button variant="outlined" onClick={onCancel}>
							{t('cancel')}
						</Button>
						<Button variant="contained" color="success" onClick={onSave}>
							{t('save')}
						</Button>
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
					<IconButton onClick={onDelete}>
						<DeleteIcon color="error" />
					</IconButton>
					<Chip
						sx={{
							backgroundColor: 'white',
							color: '#fff',
						}}
					/>
				</Stack>
			</TableCell>
		</>
	);
};

export default DocumentLabelPage;
