import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	LinearProgress,
	TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
	useGetDeploymentPhaseTypeById,
	useUpdateDeploymentPhaseType,
} from '../../services';
import { useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import React from 'react';
import { t } from 'i18next';

interface UpdateDeploymentPhaseTypeProps {
	typeId: string;
	open: boolean;
	onClose: () => void;
}

export default function UpdateDeploymentPhaseTypeFormDialog({
	typeId,
	open,
	onClose,
}: UpdateDeploymentPhaseTypeProps) {
	const [formData, setFormData] = useState({ name: '', description: '' });
	const notifications = useNotifications();
	const type = useGetDeploymentPhaseTypeById(typeId!, { skip: !typeId });
	useEffect(() => {
		if (type.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (type.isSuccess)
			setFormData({
				name: type.data.name,
				description: type.data.description ?? '',
			});
	}, [notifications, type.isError, type.isSuccess, type.data]);
	const [updateDeploymentPhaseTypeTrigger, { isLoading: isUpdateLoading }] =
		useUpdateDeploymentPhaseType();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const updatingType: DeploymentPhaseTypeUpdateRequest = {
			name: formData.name.trim(),
			description: formData.description.trim(),
			typeId: typeId!,
		};

		if (!updatingType.name) {
			notifications.show(t('processTypeNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await updateDeploymentPhaseTypeTrigger(updatingType);
			notifications.show(t('updateProcessTypeSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateProcessTypeError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}

		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{t('modifyProcessTypeInfor')}</DialogTitle>
				<DialogContent>
					{(type.isLoading || isUpdateLoading) && <LinearProgress />}
					<TextField
						autoFocus
						required
						margin="dense"
						id="name"
						name="name"
						label={t('processTypeName')}
						type="text"
						fullWidth
						variant="standard"
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						required
						margin="dense"
						id="description"
						name="description"
						label={t('description')}
						type="text"
						fullWidth
						variant="standard"
						value={formData.description}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>{t('cancel')}</Button>
					<Button type="submit">{t('submit')}</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
