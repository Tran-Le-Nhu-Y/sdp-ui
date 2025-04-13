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
import { useCreateCustomer } from '../../services';
import { useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import React from 'react';
import { t } from 'i18next';

export default function CreateCustomerFormDialog({
	userId,
}: {
	userId: string;
}) {
	const [open, setOpen] = React.useState(false);
	const [formData, setFormData] = useState({ name: '', email: '' });

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

	const [createCustomerTrigger, { isLoading: isCreateLoading }] =
		useCreateCustomer();
	const notifications = useNotifications();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const newCustomer: CustomerCreateRequest = {
			name: formData.name.trim(),
			email: formData.email.trim(),
			userId: userId,
		};

		if (!newCustomer.name) {
			notifications.show(t('customerNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await createCustomerTrigger(newCustomer);
			notifications.show(t('createCustomerSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('createCustomerError'), {
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
				{t('addCustomer')}
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<form onSubmit={handleSubmit}>
					<DialogTitle>{t('addCustomerInfor')}</DialogTitle>
					<DialogContent>
						{isCreateLoading && <LinearProgress />}
						<TextField
							autoFocus
							required
							margin="dense"
							id="name"
							name="name"
							label={t('customerName')}
							type="name"
							fullWidth
							variant="standard"
							onChange={handleChange}
						/>
						<TextField
							autoFocus
							required
							margin="dense"
							id="email"
							name="email"
							label={t('email')}
							type="email"
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
