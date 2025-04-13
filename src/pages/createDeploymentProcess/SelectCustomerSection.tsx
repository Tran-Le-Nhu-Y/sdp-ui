import { useTranslation } from 'react-i18next';
import { CollapsibleDataGrid } from '../../components';
import { useMemo, useState } from 'react';
import { useGetAllCustomers } from '../../services';

export default function SelectCustomerSection({
	open,
	onOpenChange,
	onCustomerChange,
}: {
	open: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onCustomerChange: (customerId: string | undefined) => void;
}) {
	const { t } = useTranslation('standard');
	const [customerQuery, setCustomerQuery] = useState<GetAllCustomerQuery>({
		pageNumber: 0,
		pageSize: 5,
	});
	const customers = useGetAllCustomers(customerQuery!, {
		skip: !customerQuery || customerQuery?.pageSize === 0,
	});
	const [selectedCustomer, setSelectedCustomer] = useState<{
		id: string;
		name: string;
	}>();

	const title = useMemo(
		() => selectedCustomer?.name ?? t('notSelected'),
		[selectedCustomer?.name, t]
	);

	return (
		<CollapsibleDataGrid
			expanded={open}
			label={t('customer')}
			title={title}
			dataProps={{
				pageSizeOptions: [5, 10, 25],
				loading: customers.isLoading,
				rows: customers.data?.content,
				rowCount: customers?.data?.totalElements,
				initialState: {
					pagination: {
						paginationModel: {
							page: 0,
							pageSize: 5,
						},
					},
				},
				columns: [
					{
						field: 'name',
						type: 'string',
						headerName: t('customerName'),
						sortable: false,
						editable: false,
						filterable: false,
						headerAlign: 'center',
						width: 400,
						minWidth: 250,
					},
					{
						field: 'email',
						type: 'string',
						headerName: t('email'),
						sortable: false,
						editable: false,
						filterable: false,
						headerAlign: 'center',
						align: 'center',
						width: 400,
						minWidth: 250,
					},
				],
				checkboxSelection: true,
				disableMultipleRowSelection: true,
				getRowId: (row: Customer) => `${row.id}$${row.name}`,
				rowSelectionModel:
					selectedCustomer && `${selectedCustomer.id}$${selectedCustomer.name}`,
				onRowSelectionModelChange: (model) => {
					if (model.length === 1) {
						const [id, name] = model[0].toString().split('$');
						setSelectedCustomer({ id: id, name: name });
						onCustomerChange(id);
					} else {
						setSelectedCustomer(undefined);
						onCustomerChange(undefined);
					}
				},
				paginationModel: {
					pageSize: customerQuery.pageSize ?? 5,
					page: customerQuery.pageNumber ?? 0,
				},
				onPaginationModelChange: (model) =>
					setCustomerQuery((pre) => ({
						...pre,
						pageNumber: model.page,
						pageSize: model.pageSize,
					})),
			}}
			onChange={(_e, expanded) => {
				onOpenChange(expanded);
			}}
		/>
	);
}
