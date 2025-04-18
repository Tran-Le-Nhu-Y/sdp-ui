import { useCallback, useEffect, useState } from 'react';
import {
	useCreateMailTemplate,
	useGetMailTemplateByUserId,
	useUpdateMailTemplate,
} from '../services';
import { HideDuration } from '../utils';
import { useNotifications, useSession } from '@toolpad/core';
import { useTranslation } from 'react-i18next';

const useMailTemplate = ({
	type,
	updateSuccessText = '',
	updateErrorText = '',
	createSuccessText = '',
	createErrorText = '',
}: {
	type: MailTemplateType;
	updateSuccessText?: string;
	updateErrorText?: string;
	createSuccessText?: string;
	createErrorText?: string;
}) => {
	const { t } = useTranslation('standard');
	const userId = useSession()?.user?.id ?? '';
	const notifications = useNotifications();
	const [mail, setMail] = useState<{ subject: string; content: string }>({
		subject: '',
		content: '',
	});

	const mailTemplate = useGetMailTemplateByUserId({
		userId: userId,
		type: type,
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

	const [createMailTemplateTrigger, mailTemplateCreating] =
		useCreateMailTemplate();
	const [updateMailTemplateTrigger, mailTemplateUpdating] =
		useUpdateMailTemplate();

	const handleSubmit = useCallback(async () => {
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
					type: type,
					...mail,
				}).unwrap();
				notifications.show(updateSuccessText, {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				notifications.show(updateErrorText, {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.error(error);
			}
		} else {
			try {
				await createMailTemplateTrigger({
					...mail,
					type: type,
					userId: userId,
				}).unwrap();
				notifications.show(createSuccessText, {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				notifications.show(createErrorText, {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.error(error);
			}
		}
	}, [
		createErrorText,
		createMailTemplateTrigger,
		createSuccessText,
		mail,
		mailTemplate.data,
		notifications,
		t,
		type,
		updateErrorText,
		updateMailTemplateTrigger,
		updateSuccessText,
		userId,
	]);

	return {
		mail,
		setMail,
		mailTemplate,
		mailTemplateCreating,
		mailTemplateUpdating,
		handleSubmit,
	};
};

export default useMailTemplate;
