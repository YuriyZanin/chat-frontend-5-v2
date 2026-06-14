import {
  ContactCardSelectable,
  SectionHeaderSelection,
} from 'modules/conversation/contacts/features/contacts-selection';
import { JSX } from 'react';
import type { ContactsPanelProps } from './contacts-panel.props';

export const ContactsPanel = ({ contacts, variant, sentinelRef }: ContactsPanelProps): JSX.Element => {
  // подгружаем новую страницу, когда пользователь приблизится к предпоследнему элементу от низа
  const triggerIndex = contacts?.length ? contacts?.length - 1 : 0;
  return (
    <div>
      <SectionHeaderSelection variant={variant} />
      <ul>
        {contacts?.map((contact, index) => {
          const isSentinel = index === triggerIndex;
          return (
            <div
              key={contact.uid}
              ref={(el) => {
                if (isSentinel && sentinelRef !== undefined) sentinelRef.current = el;
              }}
            >
              <ContactCardSelectable contact={contact} variant={variant} />
            </div>
          );
        })}
      </ul>
    </div>
  );
};
