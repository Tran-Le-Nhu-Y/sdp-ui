import { useTranslation } from 'react-i18next';
import { Box, Button, IconButton, LinearProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { TextEditor } from '../../components';
import { Edit } from '@mui/icons-material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
	useCreateMailTemplate,
	useGetMailTemplateByUserId,
	useUpdateMailTemplate,
} from '../../services';
import { HideDuration } from '../../utils';
import { useNotifications, useSession } from '@toolpad/core';

function UseGuideScrollDialog() {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(false);
	const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

	const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
		setOpen(true);
		setScroll(scrollType);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const descriptionElementRef = React.useRef<HTMLElement>(null);
	React.useEffect(() => {
		if (open) {
			const { current: descriptionElement } = descriptionElementRef;
			if (descriptionElement !== null) {
				descriptionElement.focus();
			}
		}
	}, [open]);

	return (
		<React.Fragment>
			<Button onClick={handleClickOpen('paper')}>{t('guide')}</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				scroll={scroll}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title" color="primary">
					{t('instructionForWritingMailTemplate')}
				</DialogTitle>
				<DialogContent dividers={scroll === 'paper'}>
					<DialogContentText
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						<Box p={1}>
							<ReactMarkdown>{t('useGuideDetail')}</ReactMarkdown>
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>{t('exit')}</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

export default function TemplateCompleteDeploymentPage() {
	const { t } = useTranslation();
	const session = useSession();
	const userId = session?.user?.id ?? '';
	const notifications = useNotifications();
	const [content, setContent] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [createMailTemplateTrigger, mailTemplateCreating] =
		useCreateMailTemplate();
	const [updateMailTemplateTrigger, mailTemplateUpdating] =
		useUpdateMailTemplate();

	const handleEdit = () => {
		setIsEditing(true);
		if (!content) {
			setContent('');
		}
	};

	const handleSubmit = async () => {
		if (!content?.trim()) {
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
					type: 'SOFTWARE_DEPLOYED_SUCCESSFULLY',
					content: content,
					userId,
				});
				notifications.show(t('updateMailCompleteDeploymentSuccess'), {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				notifications.show(t('updateMailCompleteDeploymentError'), {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
				console.error(error);
			}
		} else {
			try {
				await createMailTemplateTrigger({
					content: content,
					type: 'SOFTWARE_DEPLOYED_SUCCESSFULLY',
					userId: userId,
				});
				notifications.show(t('createMailCompleteDeploymentSuccess'), {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
				await mailTemplate.refetch();
			} catch (error) {
				notifications.show(t('createMailCompleteDeploymentError'), {
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
		type: 'SOFTWARE_DEPLOYED_SUCCESSFULLY',
	});
	useEffect(() => {
		if (mailTemplate.isError)
			notifications.show(t('noMailTemplate'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (mailTemplate.isSuccess) setContent(mailTemplate.data.content);
	}, [
		notifications,
		mailTemplate.isError,
		t,
		mailTemplate.isSuccess,
		mailTemplate.data,
	]);

	if (
		mailTemplate.isLoading ||
		mailTemplateCreating.isLoading ||
		mailTemplateUpdating.isLoading
	)
		return <LinearProgress />;
	return (
		<Stack spacing={2}>
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<UseGuideScrollDialog />
				<IconButton onClick={handleEdit} disabled={isEditing}>
					<Edit color="info" />
				</IconButton>
			</Stack>

			<Stack>
				{!isEditing ? (
					<Box>
						<TextEditor
							data={mailTemplate.data?.content || ''}
							readOnly={!isEditing}
						/>
					</Box>
				) : (
					<Stack>
						<Box>
							<TextEditor
								data={content || ''}
								onChange={(newValue) => setContent(newValue)}
							/>
						</Box>
						<Box mt={3} display="flex" justifyContent="center" gap={2}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
							>
								{t('submit')}
							</Button>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => setIsEditing(false)}
							>
								{t('cancel')}
							</Button>
						</Box>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
}
