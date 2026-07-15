import { Participant } from 'modules/info/entity/info.entity';
import { ParticipantCardSelectable } from 'modules/info/ui/info-uploads/participants-tab/participant-card-selectable';
import { JSX } from 'react';

export const ParticipantsPanel = ({
  participants,
  isOwnerGroupOrChannel,
}: {
  participants?: Participant[];
  isOwnerGroupOrChannel: boolean;
}): JSX.Element => {
  return (
    <div>
      <ul>
        {participants?.map((member) => (
          <ParticipantCardSelectable
            key={member.uid}
            isOwnerGroupOrChannel={isOwnerGroupOrChannel}
            participant={member}
          />
        ))}
      </ul>
    </div>
  );
};
