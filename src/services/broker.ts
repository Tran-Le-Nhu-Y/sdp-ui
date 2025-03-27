import { Client } from '@stomp/stompjs';

const client = new Client({
	brokerURL: import.meta.env.VITE_RABBITMQ_URL,
	connectHeaders: {
		login: import.meta.env.VITE_RABBITMQ_USERNAME,
		passcode: import.meta.env.VITE_RABBITMQ_PASSWORD,
		host: import.meta.env.VITE_RABBITMQ_VHOST,
	},
	// debug: function (str) {
	// 	console.log(str);
	// },
	reconnectDelay: 5000,
	heartbeatIncoming: 4000,
	heartbeatOutgoing: 4000,
});

client.onStompError = function (frame) {
	// Will be invoked in case of error encountered at Broker
	// Bad login/passcode typically will cause an error
	// Complaint brokers will set `message` header with a brief message. Body may contain details.
	// Compliant brokers will terminate the connection after any error
	console.log('Broker reported error: ' + frame.headers['message']);
	console.log('Additional details: ' + frame.body);
};

/**
 * The client would be activated if not, otherwise, nothing do.
 * @param userId ID of the logged in user.
 * @param callback
 */
export function subscribeNotification(
	userId: string,
	callback: (newNotificationId: number) => void
) {
	if (client.active) return;

	client.onConnect = function () {
		client.subscribe(
			`/exchange/sdp-notification-topic-user/${userId}`,
			(message) => callback(Number(message.body)),
			{
				'x-queue-name': `client-user-${userId}`,
			}
		);
	};
	client.activate();
}

export function sendNotification(dest: NotificationDestination, body: unknown) {
	const json = JSON.stringify(body);
	client.publish({ destination: dest, body: json });
}

export function unsubscribeNotification() {
	client.deactivate();
}

export enum NotificationDestination {
	TEST = '/topic/test01',
}
