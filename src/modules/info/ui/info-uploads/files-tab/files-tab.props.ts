import type { RestMessageFileApi } from 'modules/conversation/messages-chat/model/messages-list/user-messages.api.schema';
export type FilesTabProps = {
  items: RestMessageFileApi[];
};

export type CardFileProps = {
  item: RestMessageFileApi;
};
