'use client';

import { ContactCard } from 'modules/conversation/contacts/entity';
import { Participant } from 'modules/info/entity/info.entity';
import { useInfoStore } from 'modules/info/model/info.store';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';
import { Dropdown } from 'shared/ui/dropdown';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import DeleteIcon from '../../../../shared/icons/delete-outline.svg';

export const ParticipantCardSelectable = ({
  participant,
  isOwnerGroupOrChannel,
}: {
  participant: Participant;
  isOwnerGroupOrChannel: boolean;
}): JSX.Element => {
  const isSelectionMode = useInfoStore((s) => s.isAddMembersMode);
  const selectedIds = useInfoStore((s) => s.selectedIds);
  const toggleSelection = useInfoStore((s) => s.toggleSelection);
  const openDeleteModal = useInfoStore((s) => s.openDeleteParticipantModal);

  const isSelected = selectedIds.has(participant.uid);
  const { uid, firstName, lastName, avatarUrl, wasOnlineAt, isOnline } = participant;
  const router = useRouter();

  const contextMenuItems: DropdownItem[] = [
    {
      label: 'Посмотреть профиль',
      variant: 'general',
      onClick: (): void => {
        router.push(`/contacts/${participant.uid}`);
      },
    },
    {
      label: 'Сделать администратором',
      variant: 'general',
      onClick: (): void => {},
    },
    {
      label: 'Удалить из группы',
      icon: <DeleteIcon />,
      variant: 'alert',
      onClick: () => openDeleteModal(participant.uid),
    },
  ];

  const contactCard = (
    <ContactCard
      selectionMode={isSelectionMode}
      selected={isSelected}
      onSelectHandler={() => toggleSelection(participant.uid)}
      contact={{
        uid,
        nickname: '',
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        avatarUrl,
        isOnline,
        wasOnlineAt: wasOnlineAt ?? 0,
      }}
    />
  );

  return (
    <>
      {isSelectionMode ? (
        contactCard
      ) : participant.isOwner || !isOwnerGroupOrChannel ? (
        contactCard
      ) : (
        <Dropdown items={contextMenuItems}>{contactCard}</Dropdown>
      )}
    </>
  );
};
