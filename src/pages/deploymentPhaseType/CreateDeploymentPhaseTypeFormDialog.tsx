import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	LinearProgress,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import { useCreateDeploymentPhaseType } from '../../services';
import { useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import React from 'react';
import { t } from 'i18next';

export default function CreateDeploymentPhaseTypeFormDialog({
	userId,
}: {
	userId: string;
}) {
	const [open, setOpen] = React.useState(false);
	const [formData, setFormData] = useState({ name: '', description: '' });

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const [createDeploymentPhaseTypeTrigger, { isLoading: isCreateLoading }] =
		useCreateDeploymentPhaseType();
	const notifications = useNotifications();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const newType: DeploymentPhaseTypeCreateRequest = {
			name: formData.name.trim(),
			description: formData.description.trim(),
			userId: userId,
		};

		if (!newType.name) {
			notifications.show(t('processTypeNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await createDeploymentPhaseTypeTrigger(newType);
			notifications.show(t('createProcessTypeSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createProcessTypeError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}

		handleClose();
	};

	return (
		<React.Fragment>
			<Button variant="contained" onClick={handleClickOpen}>
				{t('addProcessType')}
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{t('addProcessTypeInfor')}</DialogTitle>
					<DialogContent>
						{isCreateLoading && <LinearProgress />}
						<TextField
							autoFocus
							required
							margin="dense"
							id="name"
							name="name"
							label={t('processTypeName')}
							type="name"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							id="description"
							name="description"
							label={t('description')}
							type="text"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>{t('cancel')}</Button>
						<Button type="submit">{t('submit')}</Button>
					</DialogActions>
				</form>
			</Dialog>
		</React.Fragment>
	);
}
