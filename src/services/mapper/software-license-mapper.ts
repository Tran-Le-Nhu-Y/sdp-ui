function toEntity(response: SoftwareLicenseResponse): SoftwareLicense {
	return {
		id: response.id,
		description: response.description,
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
		processId: process.id,
		creator: licenseCreator,
	};
}

export { toEntity, toDetailEntity };
