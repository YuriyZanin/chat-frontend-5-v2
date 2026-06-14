import { RefObject } from 'react';
import type { Contact } from '../../entity';

export type ContactsPanelProps = {
  contacts?: Contact[];
  variant: 'personal' | 'globals';
  sentinelRef?: RefObject<HTMLDivElement | null>;
};
