import { userInst } from '../instance';

export async function getUserMetadata(userId: string) {
	const response = await userInst.get(`/users/${userId}`);
	const userRepresentation: UserRepresentation = response.data;

	return {
		id: userRepresentation.id,
		firstName: userRepresentation.firstName,
		lastName: userRepresentation.lastName,
		email: userRepresentation.email,
	} as UserMetadata;
}
