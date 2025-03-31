function toEntity(response: SoftwareLicenseResponse): SoftwareLicense {
	return {
		id: response.id,
		startTime: new Date(response.startTimeMs).toLocaleString(),
		endTime: new Date(response.endTimeMs).toLocaleString(),
		expireAlertIntervalDay: response.expireAlertIntervalDay,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: null,
	};
}

function toDetailEntity(
	response: SoftwareLicenseDetailResponse,
	licenseCreator: UserMetadata,
	processCreator: UserMetadata
): SoftwareLicenseDetail {
	const process = response.process;
	return {
		id: response.id,
		description: response.description,
		startTimeMs: response.startTimeMs,
		endTimeMs: response.endTimeMs,
		isExpireAlertDone: false,
		expireAlertIntervalDay: response.expireAlertIntervalDay,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: null,
		process: {
			id: process.id,
			softwareVersion: {
				id: process.softwareVersionId,
				name: process.softwareVersionName,
			},
			customer: {
				id: process.customerId,
				name: process.customerName,
				email: process.customerEmail,
			},
			creator: processCreator,
		},
		creator: licenseCreator,
	};
}

export { toEntity, toDetailEntity };
