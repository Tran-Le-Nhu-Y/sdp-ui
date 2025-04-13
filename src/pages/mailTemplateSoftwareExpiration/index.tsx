import { useTranslation } from 'react-i18next';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Stack,
	TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Edit } from '@mui/icons-material';
import {
	useCreateMailTemplate,
	useGetMailTemplateByUserId,
	useUpdateMailTemplate,
} from '../../services';
import { HideDuration, TextLength } from '../../utils';
import { useNotifications, useSession } from '@toolpad/core';
import {
	ReadonlyTextEditor,
	TextEditor,
	UserGuideScrollDialog,
} from '../../components';

export default function TemplateSoftwareExpirationPage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const notifications = useNotifications();
	const [mail, setMail] = useState<{ subject: string; content: string }>({
		subject: '',
		content: '',
	});
	const [isEditing, setIsEditing] = useState(false);
	const [createMailTemplateTrigger, mailTemplateCreating] =
		useCreateMailTemplate();
	const [updateMailTemplateTrigger, mailTemplateUpdating] =
		useUpdateMailTemplate();

	const handleSubmit = async () => {
		if (!mail.subject.trim() || !mail.content.trim()) {
			notifications.show(t('contentRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		if (mailTemplate.data) {
			try {
				await updateMailTemplateTrigger({
					templateId: mailTemplate.data.id,
					type: 'SOFTWARE_EXPIRE_ALERT',
					...mail,
				}).unwrap();
				notifications.show(t('updateMailSoftwareExpirationSuccess'), {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				notifications.show(t('updateMailSoftwareExpirationError'), {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.error(error);
			}
		} else {
			try {
				await createMailTemplateTrigger({
					...mail,
					type: 'SOFTWARE_EXPIRE_ALERT',
					userId: userId,
				}).unwrap();
				notifications.show(t('createMailSoftwareExpirationSuccess'), {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				notifications.show(t('createMailSoftwareExpirationError'), {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.error(error);
			}
		}
		setIsEditing(false);
	};

	const mailTemplate = useGetMailTemplateByUserId({
		userId: userId,
		type: 'SOFTWARE_EXPIRE_ALERT',
	});
	useEffect(() => {
		if (mailTemplate.isError)
			notifications.show(t('noMailTemplate'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
		else if (mailTemplate.isSuccess) setMail(mailTemplate.data);
	}, [
		mailTemplate.data,
		mailTemplate.isError,
		mailTemplate.isSuccess,
		notifications,
		t,
	]);

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
