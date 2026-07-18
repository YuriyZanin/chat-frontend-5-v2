import type { Attachment } from '../../context-menu/context-menu-attach-file/context-menu-attach-file.props';

export type AlertAttachmentImageProps = {
  onOk: () => void;
  onCancel: () => void;
};

export type PreviewImageCardProps = {
  image: Attachment;
};
