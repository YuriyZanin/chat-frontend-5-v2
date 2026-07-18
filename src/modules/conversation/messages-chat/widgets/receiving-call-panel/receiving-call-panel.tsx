import clsx from 'clsx';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
import Image from 'next/image';
import { JSX, useState } from 'react';
import { useCallsStore } from '../../model/calls';
import styles from './receiving-call-panel.module.scss';
type ReceivingCallPanelProps = {
  onReject: () => void;
  onAccept: () => void;
};

export const ReceivingCallPanel = ({ onAccept, onReject }: ReceivingCallPanelProps): JSX.Element | null => {
  const { setCallData, contactFio, avatarUrl } = useCallsStore();

  const handleAccept = (): void => {
    onAccept();
    setCallData({
      isReceivingModalOpen: false,
    });
  };

  const handleReject = (): void => {
    onReject();
    setCallData({
      isReceivingModalOpen: false,
    });
  };

  const URL_DEFAULT_AVATAR = '/images/profile/default.png';
  // создаем url для запроса картинки через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain(avatarUrl ?? '')}`;
  // создаем состояние которое динамически заменить картинку аватара на дефолтную в случае ошибки при её загрузке
  const [imgSrc, setImgSrc] = useState(result !== '/api/proxy' ? result : URL_DEFAULT_AVATAR);
  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <Image
          src={imgSrc}
          alt={contactFio}
          width={160}
          height={160}
          unoptimized
          className={styles.avatar}
          onError={() => {
            setImgSrc(URL_DEFAULT_AVATAR);
          }}
        />
        <div className={styles.description}>
          <div className={styles.contact}>{`${contactFio}`}</div>
          <div className={styles.state}>Входящий звонок</div>
        </div>
      </div>
      <div className={styles.footerButtons}>
        <button className={clsx(styles.button, styles.cancelButton)} onClick={handleReject}>
          Отмена
        </button>
        <button className={clsx(styles.button, styles.answerButton)} onClick={handleAccept}>
          Ответить
        </button>
      </div>
    </div>
  );
};
