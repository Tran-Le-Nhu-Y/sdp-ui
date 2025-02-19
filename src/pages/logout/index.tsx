import { useEffect } from 'react';
import keycloak from '../../services/keycloak';

const LogoutPage = () => {
	useEffect(() => {
		if (!keycloak.authenticated) return;
		keycloak.logout({ redirectUri: `${location.origin}` });
	}, []);

	return <></>;
};

export default LogoutPage;
