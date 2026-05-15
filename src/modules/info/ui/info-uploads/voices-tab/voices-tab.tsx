import { useAudioPlayer } from 'modules/conversation/messages-chat/hooks/use-audio-player';
import { getMessageTimeOrDate } from 'modules/conversation/messages-chat/lib/get-message-time';
import { formatTime } from 'modules/conversation/messages-chat/utils/format-cecond';
import { JSX } from 'react';
import Play from './icons/play.svg';
import Stop from './icons/stop.svg';
import styles from './voices-tab.module.scss';
import { VoiceProps, VoicesTabProps } from './voices-tab.props';
export const VoicesTab = ({ items }: VoicesTabProps): JSX.Element => {
  return (
    <div className={styles.container}>
      {items.map((item, index) => (
        <div key={index} className={styles.wrapper}>
          <VoiceCard item={item} />
        </div>
      ))}
    </div>
  );
};

const VoiceCard = ({ item }: VoiceProps): JSX.Element => {
  // хук для прослушивания аудиосообщения
  const { handlePlayPause, currentTime, totalDuration, waveformRef, isPlaying, isLoading } = useAudioPlayer(item);

  return (
    <div className={styles.box}>
      <button className={styles.icon} onClick={handlePlayPause}>
        {isPlaying ? <Stop /> : <Play />}
      </button>
      <div className={styles.info}>
        <div className={styles.text}>{`${item.from_user.first_name} ${item.from_user.last_name}`}</div>
        <div className={styles.voiceLine} ref={waveformRef} />
        <div className={styles.durationEndDate}>
          <div className={styles.duration}>{currentTime ? formatTime(currentTime) : formatTime(totalDuration)}</div>
          <div className={styles.duration}>-</div>
          <div className={styles.duration}>{getMessageTimeOrDate(item.created_at)}</div>
        </div>
      </div>
    </div>
  );
};
