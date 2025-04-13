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
import { useGetCustomerById, useUpdateCustomer } from '../../services';
import { useNotifications } from '@toolpad/core';
import { HideDuration } from '../../utils';
import React from 'react';
import { t } from 'i18next';

interface UpdateCustomerProps {
	customerId: string;
	open: boolean;
	onClose: () => void;
}

export default function UpdateCustomerFormDialog({
	customerId,
	open,
	onClose,
}: UpdateCustomerProps) {
	const [formData, setFormData] = useState({ name: '', email: '' });
	const notifications = useNotifications();
	const customer = useGetCustomerById(customerId!, { skip: !customerId });
	useEffect(() => {
		if (customer.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (customer.isSuccess)
			setFormData({ name: customer.data.name, email: customer.data.email });
	}, [notifications, customer.isError, customer.isSuccess, customer.data]);
	const [updateCustomerTrigger, { isLoading: isUpdateLoading }] =
		useUpdateCustomer();

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const updatingCustomer: CustomerUpdateRequest = {
			name: formData.name.trim(),
			email: formData.email.trim(),
			customerId: customerId!,
		};

		if (!updatingCustomer.name) {
			notifications.show(t('customerNameRequired'), {
				severity: 'warning',
				autoHideDuration: HideDuration.fast,
			});
			return;
		}

		try {
			await updateCustomerTrigger(updatingCustomer);
			notifications.show(t('updateCustomerSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateCustomerError'), {
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
				<DialogTitle>{t('editCustomer')}</DialogTitle>
				<DialogContent>
					{(customer.isLoading || isUpdateLoading) && <LinearProgress />}
					<TextField
						autoFocus
						required
						margin="dense"
						id="name"
						name="name"
						label={t('customerName')}
						type="text"
						fullWidth
						variant="standard"
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						required
						margin="dense"
						id="email"
						name="email"
						label={t('email')}
						type="email"
						fullWidth
						variant="standard"
						value={formData.email}
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
