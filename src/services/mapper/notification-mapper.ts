function toEntity(response: NotificationHistoryResponse): NotificationHistory {
	const notification = response.notification;
	return {
		numOrder: response.numOrder,
		notification: notification,
		createdAt: new Date(response.createdAtMillis).toLocaleDateString(),
		isRead: response.isRead,
	};
}

export { toEntity };
