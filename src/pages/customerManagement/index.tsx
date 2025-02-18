import { useTranslation } from 'react-i18next';
import { PaginationTable } from '../../components';

import { IconButton, Stack, TableCell, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useState } from 'react';

export default function CustomerManagementPage() {
	const { t } = useTranslation();
	//const navigate = useNavigate();

	const [customerTablePage, setCustomerTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const customers = [
		{
			id: '1',
			name: 'Nguyễn Văn A',
			address: '123 Lý Tự Trọng, Cần Thơ',
			email: 'nguyenvana@gmail.com',
			phoneNumber: '0901234567',
		},
		{
			id: '2',
			name: 'Trần Thị B',
			address: '456 Nguyễn Trãi, TP.HCM',
			email: 'tranthib@gmail.com',
			phoneNumber: '0912345678',
		},
		{
			id: '3',
			name: 'Lê Quốc C',
			address: '789 Trần Hưng Đạo, Hà Nội',
			email: 'lequocc@gmail.com',
			phoneNumber: '0923456789',
		},
	];

	const handleDelete = (id: string) => {
		alert(`Xóa khách hàng có ID: ${id}`);
	};

	return (
		<div>
			{/* {loading ? (
				<LinearProgress />
			) : ( */}
			<PaginationTable
				// filterableCols={[
				// 	{
				// 		key: 'name',
				// 		label: 'Phiên bản',
				// 	},
				// ]}
				headers={
					<>
						<TableCell key={`customerName`}>{t('customerName')}</TableCell>
						<TableCell key={`address`} align="center">
							{t('address')}
						</TableCell>
						<TableCell key={`email`} align="center">
							{t('email')}
						</TableCell>
						<TableCell key={`phoneNumber`} align="center">
							{t('phoneNumber')}
						</TableCell>
						<TableCell />
						<TableCell />
					</>
				}
				count={customers.length ?? 0}
				rows={customers}
				pageNumber={customerTablePage.pageNumber}
				pageSize={customerTablePage.pageSize}
				onPageChange={(newPage) => setCustomerTablePage(newPage)}
				// onAddClick={() => navigate(`/create-customer`)}
				//addButtonText={t('addCustomer')}
				getCell={(row) => (
					<TableRow key={row.id}>
						<TableCell key={`customerName`}>{row.name}</TableCell>
						<TableCell key={`address`} align="center">
							{row.address}
						</TableCell>
						<TableCell key={`email`} align="center">
							{row.email}
						</TableCell>
						<TableCell key={`phoneNumber`} align="center">
							{row.phoneNumber}
						</TableCell>

						<TableCell>
							<Stack direction="row">
								<IconButton size="small" onClick={() => {}}>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<IconButton size="small" onClick={() => {}}>
									<EditIcon color="info" />
								</IconButton>
								<IconButton size="small" onClick={() => handleDelete(row.id)}>
									<DeleteIcon color="error" />
								</IconButton>
							</Stack>
						</TableCell>
					</TableRow>
				)}
			/>
			{/* )} */}
		</div>
	);
}
