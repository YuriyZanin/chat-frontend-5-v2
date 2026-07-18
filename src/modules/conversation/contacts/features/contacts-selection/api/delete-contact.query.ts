import { useMutation, UseMutationOptions, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import {
  ContactsInfiniteData,
  DeleteContactsContext,
} from 'modules/conversation/contacts/features/contacts-selection/model';
import { deleteContact } from './delete-contact.api';

export const useDeleteContactsMutation = (
  options?: UseMutationOptions<void, Error, string[], DeleteContactsContext>,
): UseMutationResult<void, Error, string[]> => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[], DeleteContactsContext>({
    mutationFn: async (uids) => {
      await Promise.all(uids.map(deleteContact));
    },

    onMutate: async (uids) => {
      await queryClient.cancelQueries({
        queryKey: ['contacts', 'contacts-list'],
      });

      const previousContacts = queryClient.getQueryData<ContactsInfiniteData>(['contacts', 'contacts-list']);

      queryClient.setQueryData<ContactsInfiniteData>(['contacts', 'contacts-list'], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: page.results.filter((contact) => !uids.includes(contact.uid)),
          })),
        };
      });

      return { previousContacts };
    },

    onError: (_err, _uids, context) => {
      if (context?.previousContacts) {
        queryClient.setQueryData(['contacts', 'contacts-list'], context.previousContacts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', 'contacts-list'] });
      queryClient.invalidateQueries({ queryKey: ['chats', 'chat-list'] });
    },

    ...options,
  });
};
