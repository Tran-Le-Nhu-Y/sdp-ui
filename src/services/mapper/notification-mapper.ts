function toHistoryEntity(
	response: NotificationHistoryResponse
): NotificationHistory {
	const notification = response.notification;
	return {
		numOrder: response.numOrder,
		notification: notification,
		createdAtMs: response.createdAtMillis,
		isRead: response.isRead,
	};
}

function toEntity(response: NotificationResponse): SdpNotification {
	return {
		id: response.id,
		title: response.title,
		description: response.description,
		createdAt: new Date(response.createdAtMillis).toLocaleDateString(),
	};
}

export { toEntity, toHistoryEntity };
