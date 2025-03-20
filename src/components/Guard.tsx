import { ReactNode, useMemo } from 'react';
import { checkRoles } from '../utils';

const Guard = ({
	checkAll = true,
	requiredRoles,
	children,
}: {
	children: ReactNode;
	checkAll?: boolean;
	requiredRoles?: Array<ResourceRoles>;
}) => {
	const result = useMemo(
		() => checkRoles({ checkAll, requiredRoles }),
		[checkAll, requiredRoles]
	);

	return result ? <>{children}</> : <></>;
};

export default Guard;
