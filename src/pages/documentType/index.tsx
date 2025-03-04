import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
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
} from '@mui/material';

import {
	useDeleteDocumentType,
	useGetAllDocumentTypesByUserId,
	useGetDocumentTypeById,
	useUpdateDocumentType,
	useCreateDocumentType,
} from '../../services';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import { HideDuration, isValidLength, TextLength } from '../../utils';
import { FilterDialog, PaginationTable } from '../../components';

function DocumentTypePage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const dialogs = useDialogs();
	const notifications = useNotifications();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);

	const [showCreatingDocumentTypePanel, setShowCreatingDocumentTypePanel] =
		useState(false);
	const [documentTypeCreating, setDocumentTypeCreating] = useState<{
		name: string;
		description?: string | undefined;
	}>({ name: '' });
	const [editingId, setEditingId] = useState<string | null>(null);
	const [currentDocumentType, setCurrentDocumentType] =
		useState<SdpDocumentType | null>(null);

	const [createDocumentTypeTrigger, createDocumentType] =
		useCreateDocumentType();
	useEffect(() => {
		if (createDocumentType.isSuccess)
			notifications.show(t('createDocumentTypeSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		else if (createDocumentType.isError)
			notifications.show(t('createDocumentTypeError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [
		createDocumentType.isError,
		createDocumentType.isSuccess,
		notifications,
		t,
	]);

	const [documentTypeQuery, setDocumentTypeQuery] =
		useState<GetAllDocumentTypeQuery>({
			userId: userId,
			documentTypeName: '',
			pageNumber: 0,
			pageSize: 6,
		});
	const documentTypes = useGetAllDocumentTypesByUserId(documentTypeQuery!, {
		skip: !documentTypeQuery,
	});
	useEffect(() => {
		if (documentTypes.error)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, documentTypes.error, t]);

	const documentType = useGetDocumentTypeById(editingId!, { skip: !editingId });
	useEffect(() => {
		if (documentType.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (documentType.isSuccess) setCurrentDocumentType(documentType.data);
	}, [
		notifications,
		documentType.isError,
		t,
		documentType.isSuccess,
		documentType.data,
	]);

	const handleCancel = () => {
		setShowCreatingDocumentTypePanel(false);
		resetFields();
	};

	const resetFields = () => {
		setDocumentTypeCreating({ name: '' });
	};

	const handleCreateLabel = async () => {
		if (!documentTypeCreating.name.trim()) {
			notifications.show(t('documentTypeNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		await createDocumentTypeTrigger({
			name: documentTypeCreating.name,
			description: documentTypeCreating.description,
			userId: userId,
		});

		setShowCreatingDocumentTypePanel(false);
		resetFields();
	};

	const [deleteDocumentTypeTrigger, deleteDocumentType] =
		useDeleteDocumentType();

	const onDelete = async (typeId: string) => {
		const confirmed = await dialogs.confirm(t('deleteDocumentTypeConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		try {
			await deleteDocumentTypeTrigger(typeId);
			notifications.show(t('deleteDocumentTypeSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('deleteDocumentTypeError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	const [updateDocumentTypeTrigger, updateDocumentType] =
		useUpdateDocumentType();

	const onUpdatingSave = async () => {
		if (editingId !== null && documentType.data) {
			setEditingId(null);
			setCurrentDocumentType(null);
			try {
				await updateDocumentTypeTrigger({
					typeId: editingId,
					name: currentDocumentType?.name ?? '',
					description: currentDocumentType?.description ?? '',
				}).unwrap();
				notifications.show(t('updateDocumentTypeSuccess'), {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				notifications.show(t('updateDocumentTypeError'), {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.error(error);
			}
		}
	};

	const onUpdatingCancel = () => {
		setEditingId(null);
	};

	const isLoading = useMemo(
		() =>
			documentTypes.isLoading ||
			documentTypes.isFetching ||
			createDocumentType.isLoading ||
			updateDocumentType.isLoading,
		[
			createDocumentType.isLoading,
			documentTypes.isLoading,
			documentTypes.isFetching,
			updateDocumentType.isLoading,
		]
	);

	return (
		<Stack spacing={1}>
			{showCreatingDocumentTypePanel && (
				<Box
					sx={{
						padding: 2,
						border: '1px solid #e0e0e0',
						borderRadius: '8px',
						backgroundColor: '#f9f9f9',
					}}
				>
					<Stack direction="row" spacing={2} alignItems="center">
						<TextField
							label={t('documentTypeName') as string}
							value={documentTypeCreating.name}
							helperText={t('hyperTextMedium')}
							onChange={(e) => {
								const newValue = e.target.value;
								if (isValidLength(newValue, TextLength.Medium))
									setDocumentTypeCreating((prev) => ({
										...prev,
										name: newValue,
									}));
							}}
							variant="outlined"
							size="small"
							maxRows={1}
							fullWidth
						/>
						<TextField
							label={t('description') as string}
							value={documentTypeCreating.description}
							helperText={t('hyperTextVeryLong')}
							onChange={(e) => {
								const newValue = e.target.value;
								if (isValidLength(newValue, TextLength.VeryLong))
									setDocumentTypeCreating((prev) => ({
										...prev,
										description: newValue,
									}));
							}}
							variant="outlined"
							size="small"
							fullWidth
						/>
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
			{isLoading && <LinearProgress />}
			<Box>
				<Stack
					direction="row"
					justifyContent="space-between"
					alignItems="center"
					sx={{ marginBottom: 1 }}
				>
					<FilterDialog
						filters={[
							{
								key: 'documentTypeName',
								label: t('documentTypeName'),
							},
						]}
						open={filterDialogOpen}
						onClose={() => setFilterDialogOpen(false)}
						onOpen={() => setFilterDialogOpen(true)}
						onApply={(filters) => {
							const query: object = filters.reduce((pre, curr) => {
								return { ...pre, [curr.key]: curr.value };
							}, {});
							setDocumentTypeQuery((prev) => ({ ...prev, ...query }));
						}}
						onReset={() => {
							setDocumentTypeQuery((prev) => ({
								...prev,
								documentTypeName: '',
							}));
						}}
					/>
					<Button
						variant="contained"
						onClick={() => setShowCreatingDocumentTypePanel(true)}
					>
						{t('addDocumentType')}
					</Button>
				</Stack>
				{deleteDocumentType.isLoading && <LinearProgress />}
				<PaginationTable
					headers={
						<>
							<TableCell key={`label`}>{t('documentTypeName')}</TableCell>
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
					count={documentTypes.data?.totalElements ?? 0}
					rows={documentTypes.data?.content ?? []}
					onPageChange={(newPage) =>
						setDocumentTypeQuery((prev) => {
							return { ...prev, ...newPage };
						})
					}
					getCell={(row) => (
						<TableRow key={row.id}>
							{editingId === row.id ? (
								<EditableDocumentType
									isLoading={documentType.isLoading}
									name={currentDocumentType?.name ?? ''}
									description={currentDocumentType?.description ?? ''}
									onNameChange={(e) => {
										setCurrentDocumentType((prev) => ({
											...prev!,
											name: e.target.value,
										}));
									}}
									onDescriptionChange={(e) => {
										setCurrentDocumentType((prev) => ({
											...prev!,
											description: e.target.value,
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
									<TableCell key={`documentTypeName`}>{row.name}</TableCell>
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
			</Box>
		</Stack>
	);
}

interface EditableDocumentTypeProps {
	isLoading: boolean;
	name?: string;
	description?: string;

	onNameChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	onDescriptionChange: (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;

	onSave: () => void;
	onCancel: () => void;
	onDelete: () => void;
}

const EditableDocumentType = ({
	isLoading,
	name,
	description,
	onNameChange,
	onDescriptionChange,
	onSave,
	onCancel,
	onDelete,
}: EditableDocumentTypeProps) => {
	const { t } = useTranslation('standard');

	if (isLoading) return <LinearProgress />;
	return (
		<>
			<TableCell align="left">
				<TextField
					label={t('documentTypeName') as string}
					value={name}
					onChange={onNameChange}
					size="small"
				/>
			</TableCell>
			<TableCell align="left">
				<TextField
					label={t('description') as string}
					value={description}
					onChange={onDescriptionChange}
					fullWidth
					size="small"
				/>
			</TableCell>
			<TableCell align="left"></TableCell>
			<TableCell align="left">
				<Stack direction="row" alignItems="flex-end" spacing={1}>
					<Button variant="contained" color="success" onClick={onSave}>
						{t('save')}
					</Button>
					<Button variant="outlined" onClick={onCancel}>
						{t('cancel')}
					</Button>
				</Stack>
			</TableCell>
			<TableCell align="left">
				<IconButton onClick={onDelete}>
					<DeleteIcon color="error" />
				</IconButton>
			</TableCell>
		</>
	);
};

export default DocumentTypePage;
