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
import {
	ReadonlyTextEditor,
	TextEditor,
	UserGuideScrollDialog,
} from '../../components';
import { Edit } from '@mui/icons-material';
import { TextLength } from '../../utils';
import { useMailTemplate } from '../../hooks';

export default function TemplateCompleteDeploymentPage() {
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
		type: 'SOFTWARE_DEPLOYED_SUCCESSFULLY',
		updateSuccessText: t('updateMailCompleteDeploymentSuccess'),
		updateErrorText: t('updateMailCompleteDeploymentError'),
		createSuccessText: t('createMailCompleteDeploymentSuccess'),
		createErrorText: t('createMailCompleteDeploymentError'),
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
							onClick={handleSubmit}
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
