import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductById, useUpdateProduct } from '../../services';
import { useEffect } from 'react';
import { useNotifications } from '@toolpad/core';
import { LinearProgress } from '@mui/material';
import { hideDuration } from '../../utils';

export default function ModifyProductPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>(); // get product id from URL
	const notifications = useNotifications();

	const product = useGetProductById(id!, { skip: !id });
	useEffect(() => {
		if (product.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
	}, [notifications, product.isError, t]);

	const [updateProductTrigger, updateProduct] = useUpdateProduct();
	useEffect(() => {
		if (updateProduct.isError)
			notifications.show(t('updateProductError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (updateProduct.isSuccess) {
			navigate(-1);
			notifications.show(t('updateProductSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		}
	}, [
		notifications,
		t,
		updateProduct.isError,
		updateProduct.isSuccess,
		navigate,
	]);

	const handleSubmit = async (data: {
		productNameProp: string;
		descriptionProp: string;
	}) => {
		try {
			await updateProductTrigger({
				productId: id!,
				data: {
					name: data.productNameProp,
					description: data.descriptionProp,
				},
			}).unwrap();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			{product.isLoading ? (
				<LinearProgress />
			) : (
				<CreateOrModifyForm
					title={t('modifyProduct')}
					label={`${t('productName')}`}
					showModifyValues={{
						productNameToShow: product.data?.name || '',
						descriptionToShow: product.data?.description || '',
					}}
					onSubmit={handleSubmit}
					onCancel={() => navigate(-1)}
				/>
			)}
		</div>
	);
}
