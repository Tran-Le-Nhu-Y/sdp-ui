import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
	url: `${import.meta.env.VITE_KEYCLOAK_URL}`,
	realm: 'SDP',
	clientId: 'react-app',
});

export async function refreshToken() {
	if (!keycloak.didInitialize) return;
	try {
		await keycloak.updateToken(5);
	} catch (error) {
		console.error(error);
		await keycloak.login();
	}
}

export default keycloak;
