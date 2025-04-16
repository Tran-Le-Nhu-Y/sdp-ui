import { Typography, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AttachmentList } from '../../components';
import { parseToDayjs, TextLength } from '../../utils';
import { useGetAllPhaseAttachments } from '../../services';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export default function DetailTab({
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

	const plannedStartDateAsDayjs = plannedStartDate
		? parseToDayjs(plannedStartDate)
		: dayjs();
	const plannedEndDateAsDayjs = plannedEndDate
		? parseToDayjs(plannedEndDate)
		: dayjs();

	const attachments = useGetAllPhaseAttachments(phaseId!, {
		skip: !phaseId,
	});

	return (
		<Stack spacing={1}>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography variant="h6">{t('plannedStartDate')}:</Typography>
				<DatePicker
					readOnly
					slotProps={{ textField: { size: 'small' } }}
					value={plannedStartDateAsDayjs}
				/>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography variant="h6">{t('plannedEndDate')}:</Typography>
				<DatePicker
					readOnly
					slotProps={{ textField: { size: 'small' } }}
					value={plannedEndDateAsDayjs}
				/>
			</Stack>

			<Stack width={'100%'} spacing={1} direction={'row'}>
				<AttachmentList attachments={attachments?.data ?? []} />
			</Stack>

			<Stack direction={'column'}>
				<Typography variant="h6">{t('description')}:</Typography>
				<TextField
					id="deployment-phase-description"
					multiline
					rows={4}
					slotProps={{
						input: {
							readOnly: true,
						},
					}}
					helperText={`${t('max')} ${TextLength.VeryLong} ${t('character')}`}
					value={description}
				/>
			</Stack>
		</Stack>
	);
}
