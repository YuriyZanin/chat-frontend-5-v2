import type { ProfileInfo } from 'modules/info/entity/info.entity';
import type { ChatFilesListApi } from 'modules/info/model/info.api.schema';

export type ContactPanelProps = {
  uid: string;
  currentUid: string;
  wsUrl: string;
  profile?: ProfileInfo;
  isLoading: boolean;
  filesList: ChatFilesListApi[] | undefined;
};
