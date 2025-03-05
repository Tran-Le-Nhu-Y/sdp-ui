import { ReactNode, useMemo } from 'react';
import { ResourceRoles } from '../@types/entities';
import keycloak from '../services/keycloak';

const RESOURCE_CLIENT = import.meta.env.VITE_KEYCLOAK_RESOURCE_CLIENT;
const Guard = ({
	checkAll = true,
	requiredRoles,
	children,
}: {
	children: ReactNode;
	checkAll?: boolean;
	requiredRoles: Array<ResourceRoles>;
}) => {
	const result = useMemo(() => {
		if (checkAll)
			return requiredRoles.every((role) =>
				keycloak.hasResourceRole(role, RESOURCE_CLIENT)
			);
		return requiredRoles.some((role) =>
			keycloak.hasResourceRole(role, RESOURCE_CLIENT)
		);
	}, [checkAll, requiredRoles]);

	return result ? <>{children}</> : <></>;
};

export default Guard;
