import {
	Typography,
	Stack,
	LinearProgress,
	Tooltip,
	Button,
	TextField,
	IconButton,
	styled,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttachmentList } from '../../components';
import {
	convertToAPIDateFormat,
	HideDuration,
	isValidLength,
	parseToDayjs,
	TextLength,
} from '../../utils';
import {
	useGetAllPhaseAttachments,
	useUpdateDeploymentPhaseAttachment,
	useCreateFile,
	useUpdateDeploymentPhase,
} from '../../services';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

export default function DetailTab({
	numOrder,
	phaseId,
	description,
	plannedStartDate,
	plannedEndDate,
}: {
	numOrder?: number;
	phaseId?: string;
	description?: string | null;
	plannedStartDate?: string;
	plannedEndDate?: string;
}) {
	const { t } = useTranslation('standard');
	const dialogs = useDialogs();
	const notifications = useNotifications();
	const userId = useSession()?.user?.id;
	const [descSnapshot, setDescSnapshot] = useState(description);
	const [enableEditDesc, setEnableEditDesc] = useState(false);

	const plannedStartDateAsDayjs = plannedStartDate
		? parseToDayjs(plannedStartDate)
		: dayjs();
	const plannedEndDateAsDayjs = plannedEndDate
		? parseToDayjs(plannedEndDate)
		: dayjs();

	const attachments = useGetAllPhaseAttachments(phaseId!, {
		skip: !phaseId,
	});

	const [updateAttachmentTrigger, { isLoading: isAttachmentUpdating }] =
		useUpdateDeploymentPhaseAttachment();
	const [uploadFileTrigger] = useCreateFile();
	const addAttachments = async (fileList: FileList) => {
		if (!phaseId || !userId) return;

		const files: File[] = [];
		for (let index = 0; index < fileList.length; index++) {
			const file = fileList.item(index);
			if (file) files.push(file);
		}

		try {
			const attachmentIds = await Promise.all(
				files.map(async (file) => {
					return await uploadFileTrigger({
						userId: userId,
						file: file,
					}).unwrap();
				})
			);
			await Promise.all(
				attachmentIds.map(async (attachmentId) => {
					return await updateAttachmentTrigger({
						phaseId: phaseId,
						attachmentId: attachmentId,
						operator: 'ADD',
					}).unwrap();
				})
			);

			notifications.show(t('uploadFileSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('uploadedFileError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};
	const deleteAttachment = async (attachmentId: string) => {
		if (!phaseId) return;

		const confirmed = await dialogs.confirm(t('deleteFileConfirm'), {
			title: t('deleteFile'),
			okText: t('yes'),
			cancelText: t('cancel'),
			severity: 'error',
		});
		if (!confirmed) return;

		try {
			await updateAttachmentTrigger({
				phaseId: phaseId,
				attachmentId: attachmentId,
				operator: 'REMOVE',
			}).unwrap();

			notifications.show(t('deleteFileSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('deleteFileError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	const [updatePhaseTrigger, { isLoading: isPhaseUpdating }] =
		useUpdateDeploymentPhase();
	const handleUpdatePhase = async (data: DeploymentPhaseUpdateRequest) => {
		try {
			await updatePhaseTrigger(data).unwrap();

			notifications.show(t('updateDeploymentPhaseSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateDeploymentPhaseError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Stack spacing={1}>
			{(isAttachmentUpdating || isPhaseUpdating) && <LinearProgress />}

			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography variant="h6">{t('plannedStartDate')}:</Typography>
				<DatePicker
					slotProps={{ textField: { size: 'small' } }}
					value={plannedStartDateAsDayjs}
					maxDate={plannedEndDateAsDayjs}
					onChange={(value) => {
						if (!value || !phaseId || numOrder === undefined || !plannedEndDate)
							return;

						const dateAsString = convertToAPIDateFormat(value);
						handleUpdatePhase({
							numOrder,
							phaseId,
							description: descSnapshot,
							plannedStartDate: dateAsString,
							plannedEndDate,
						});
					}}
				/>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography variant="h6">{t('plannedEndDate')}:</Typography>
				<DatePicker
					slotProps={{ textField: { size: 'small' } }}
					value={plannedEndDateAsDayjs}
					minDate={plannedStartDateAsDayjs}
					onChange={(value) => {
						if (
							!value ||
							!phaseId ||
							numOrder === undefined ||
							!plannedStartDate
						)
							return;

						const dateAsString = convertToAPIDateFormat(value);
						handleUpdatePhase({
							numOrder,
							phaseId,
							description: descSnapshot,
							plannedStartDate,
							plannedEndDate: dateAsString,
						});
					}}
				/>
			</Stack>

			<Stack
				spacing={1}
				direction={'row'}
				alignItems={'center'}
				overflow={'auto'}
			>
				<Typography variant="h6">{t('uploadedFiles')}:</Typography>
				<Tooltip arrow title={t('addFile')}>
					<Button
						component="label"
						variant="contained"
						tabIndex={-1}
						size="small"
						startIcon={<CloudUploadIcon />}
					>
						{t('add')}
						<VisuallyHiddenInput
							type="file"
							multiple
							onChange={(event) => {
								const files = event.target.files;
								if (files) addAttachments(files);
							}}
						/>
					</Button>
				</Tooltip>
			</Stack>
			<AttachmentList
				attachments={attachments?.data ?? []}
				onRemoveClick={deleteAttachment}
			/>

			<Stack direction={'column'}>
				<Stack direction={'row'} spacing={1} alignItems={'center'}>
					<Typography variant="h6">{t('description')}:</Typography>
					{enableEditDesc ? (
						<Tooltip arrow title={t('submit')}>
							<IconButton
								color="primary"
								onClick={() => {
									if (
										!phaseId ||
										numOrder === undefined ||
										!plannedStartDate ||
										!plannedEndDate
									)
										return;

									handleUpdatePhase({
										numOrder,
										phaseId,
										description: descSnapshot,
										plannedStartDate,
										plannedEndDate,
									});
									setEnableEditDesc(false);
								}}
							>
								<DoneIcon />
							</IconButton>
						</Tooltip>
					) : (
						<Tooltip arrow title={t('edit')}>
							<IconButton
								color="primary"
								onClick={() => setEnableEditDesc(true)}
							>
								<EditIcon />
							</IconButton>
						</Tooltip>
					)}
				</Stack>
				<TextField
					id="deployment-phase-description"
					multiline
					rows={4}
					slotProps={{
						input: {
							readOnly: !enableEditDesc,
						},
					}}
					helperText={`${t('max')} ${TextLength.VeryLong} ${t('character')}`}
					value={descSnapshot}
					onChange={(e) => {
						const newDesc = e.target.value;
						if (isValidLength(newDesc, TextLength.VeryLong))
							setDescSnapshot(newDesc);
					}}
				/>
			</Stack>
		</Stack>
	);
}
