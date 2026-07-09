import { createIcon } from 'shared/ui/icon';
import DeliveredSvg from './delivered.svg';
import ForwardReplySvg from './forward-reply.svg';
import MutedCloseSvg from './muted-close.svg';
import MutedSvg from './muted.svg';
import PendingSvg from './pending.svg';
import PinnedSvg from './pinned.svg';
import ReadSvg from './read.svg';
import SentSvg from './sent.svg';

export const MutedIcon = createIcon(MutedSvg);
export const MutedCloseIcon = createIcon(MutedCloseSvg);
export const DeliveredIcon = createIcon(DeliveredSvg);
export const PendingIcon = createIcon(PendingSvg);
export const ReadIcon = createIcon(ReadSvg);
export const SentIcon = createIcon(SentSvg);
export const PinnedIcon = createIcon(PinnedSvg);
export const ForwardReplyIcon = createIcon(ForwardReplySvg);
