import { createApi } from '@reduxjs/toolkit/query/react';
import { toEntity } from './mapper/mail-template-mapper';
import { axiosBaseQuery } from '../utils';
import { sdpInstance } from './instance';

const EXTENSION_URL = 'v1/software/mail-template';
export const mailTemplateApi = createApi({
	reducerPath: 'mailTemplateApi',
	baseQuery: axiosBaseQuery(sdpInstance),
	tagTypes: ['MailTemplate'],
	endpoints: (builder) => ({
		getMailTemplate: builder.query<
			MailTemplate,
			{ userId: string; type: MailTemplateType }
		>({
			query: ({ userId, type }) => ({
				url: `/${EXTENSION_URL}/${userId}/user`,
				method: 'GET',
				params: {
					type: type,
				},
			}),
			providesTags(result, _error, args) {
				const { userId, type } = args;
				return result
					? [
							{
								type: 'MailTemplate',
								id: `${userId}-${type}`,
							} as const,
						]
					: [];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
			transformResponse(rawResult: MailTemplateResponse) {
				return toEntity(rawResult);
			},
		}),
		postMailTemplate: builder.mutation<MailTemplate, MailTemplateCreateRequest>(
			{
				query: ({ userId, content, type }) => ({
					url: `/${EXTENSION_URL}/${userId}`,
					method: 'POST',
					body: {
						content: content,
						type: type,
					},
				}),
				invalidatesTags(_result, _error, args) {
					const { userId, type } = args;
					return [
						{
							type: 'MailTemplate',
							id: `${userId}-${type}`,
						} as const,
					];
				},
				transformErrorResponse(baseQueryReturnValue) {
					return baseQueryReturnValue.status;
				},
				transformResponse(rawResult: MailTemplateResponse) {
					return toEntity(rawResult);
				},
			}
		),
		putMailTemplate: builder.mutation<void, MailTemplateUpdateRequest>({
			query: ({ templateId, content, type }) => ({
				url: `/${EXTENSION_URL}/${templateId}`,
				method: 'PUT',
				body: {
					content: content,
					type: type,
				},
			}),
			invalidatesTags(_result, _error, args) {
				const { userId, type } = args;
				return [
					{
						type: 'MailTemplate',
						id: `${userId}-${type}`,
					} as const,
				];
			},
			transformErrorResponse(baseQueryReturnValue) {
				return baseQueryReturnValue.status;
			},
		}),
	}),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetMailTemplateQuery,
	usePostMailTemplateMutation,
	usePutMailTemplateMutation,
} = mailTemplateApi;
