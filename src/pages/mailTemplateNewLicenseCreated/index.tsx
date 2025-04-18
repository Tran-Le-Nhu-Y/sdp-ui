import { useTranslation } from 'react-i18next';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Stack,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import { Edit } from '@mui/icons-material';
import { TextLength } from '../../utils';
import {
	ReadonlyTextEditor,
	TextEditor,
	UserGuideScrollDialog,
} from '../../components';
import { useMailTemplate } from '../../hooks';

export default function TemplateNewLicenseCreatedPage() {
	const { t } = useTranslation();
	const [isEditing, setIsEditing] = useState(false);
	const {
		mail,
		setMail,
		mailTemplate,
		mailTemplateCreating,
		mailTemplateUpdating,
		handleSubmit,
	} = useMailTemplate({
		type: 'NEW_LICENSE_CREATED_ALERT',
		updateSuccessText: t('updateMailNewLicenseCreatedSuccess'),
		updateErrorText: t('updateMailNewLicenseCreatedError'),
		createSuccessText: t('createMailNewLicenseCreatedSuccess'),
		createErrorText: t('createMailNewLicenseCreatedError'),
	});

	if (
		mailTemplate.isLoading ||
		mailTemplateCreating.isLoading ||
		mailTemplateUpdating.isLoading
	)
		return <LinearProgress />;
	return (
		<Box>
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<UserGuideScrollDialog />
				{!isEditing && (
					<IconButton onClick={() => setIsEditing(true)}>
						<Edit color="info" />
					</IconButton>
				)}
			</Stack>

			<Stack spacing={2}>
				<TextField
					sx={{ ':disabled': { color: 'black' } }}
					required
					label={t('title')}
					size="small"
					slotProps={{
						input: {
							readOnly: !isEditing,
						},
					}}
					helperText={`${t('max')} ${TextLength.Long} ${t('character')}`}
					value={mail.subject}
					onChange={(e) =>
						setMail((pre) => ({ ...pre, subject: e.target.value }))
					}
				/>

				{isEditing ? (
					<TextEditor
						data={mail.content}
						placeHolder={`${t('mailContent')} *`}
						onChange={(newValue) =>
							setMail((pre) => ({ ...pre, content: newValue }))
						}
					/>
				) : (
					<ReadonlyTextEditor
						data={mail.content}
						placeHolder={`${t('mailContent')} *`}
					/>
				)}

				{isEditing && (
					<Stack direction="row" spacing={1} justifyContent={'center'}>
						<Button
							variant="contained"
							hidden={!isEditing}
							color="primary"
							onClick={() => {
								handleSubmit();
								setIsEditing(false);
							}}
						>
							{t('submit')}
						</Button>
						<Button
							variant="outlined"
							color="primary"
							onClick={() => {
								setMail({
									content: mailTemplate.data?.content ?? '',
									subject: mailTemplate.data?.subject ?? '',
								});
								setIsEditing(false);
							}}
						>
							{t('cancel')}
						</Button>
					</Stack>
				)}
			</Stack>
		</Box>
	);
}
