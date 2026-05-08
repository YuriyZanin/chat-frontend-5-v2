'use client';
import { fileToBase64 } from 'modules/conversation/messages-chat/utils/file-to-base64'; // если нужна конвертация в base64
import { formatTime } from 'modules/conversation/messages-chat/utils/format-cecond';
import {
  useAudioFilesStore,
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect, useRef, useState } from 'react';
import type { Attachment } from '../../context-menu/context-menu-attach-file/context-menu-attach-file.props';
import styles from './audio-recorder-header.module.scss';
import { AudioRecorderHeaderProps } from './audio-recorder-header.props';
import MicSend from './icon/mic-send.svg';
import RedPointer from './icon/red-point.svg';

export const AudioRecorderHeader = ({ setIsRecordingMessage, sendMessage }: AudioRecorderHeaderProps): JSX.Element => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [durationSec, setDurationSec] = useState(0);
  const setAudioFilesStore = useAudioFilesStore((s) => s.setAudioFiles);
  const clearAudioFilesStore = useAudioFilesStore((s) => s.clearAudioFiles);
  const audioFilesStore = useAudioFilesStore((s) => s.audioFiles);
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  const forwardMessageStore = useForwardMessageStore((s) => s.forwardMessage);
  const clearForwardMessageStore = useForwardMessageStore((s) => s.clearForwardMessage);
  const repliedMessageStore = useRepliedMessageStore((s) => s.repliedMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);

  // Таймер для обновления длительности
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRecording) {
      const startTime = Date.now();
      timer = setInterval(() => {
        setDurationSec(Math.floor((Date.now() - startTime) / 1000));
      }, 250);
    } else {
    }
    return (): void => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e): void => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async (): Promise<void> => {
        // Останавливаем все дорожки микрофона
        stream.getTracks().forEach((track) => track.stop());
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        //валидация полученных данных
        if (blob.size < 1024) {
          console.error('Запись слишком короткая (менее 1 КБ)');
          return;
        }
        if (blob.size > 10_000_000) {
          console.error('Запись слишком длинная (более 10 МБ)');
          return;
        }
        // создаем имя файла
        const fileName = `voice_${Date.now()}.webm`;
        // создаем файл и записываеь в него полученные бинарные данные
        const file = new File([blob], fileName, { type: 'audio/webm' });
        // Конвертируем файл в нужный формат
        const fileData = await fileToBase64(file);
        const newAttachments: Attachment[] = [];
        // Подготавливаем объект файла для сторa
        newAttachments.push({
          id: crypto.randomUUID(),
          file: file,
          preview: URL.createObjectURL(file),
          type: 'video/webm',
          fileData,
        });
        // Сохраняем в store
        setAudioFilesStore(newAttachments);
      };
      // Очищаем чанки
      chunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Ошибка доступа к микрофону', err);
    }
  };
  const stopRecording = (): void => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Обработчики для кнопки
  const handlePointerStart = (): void => {
    if (!isRecording) startRecording();
  };

  const handlePointerEnd = (): void => {
    if (isRecording) stopRecording();
  };
  const handleCloseRecordingHeader = (): void => {
    setIsRecordingMessage(false);
    clearAudioFilesStore();
    clearRepliedMessageStore();
    clearForwardMessageStore();
    clearSelectedMessagesStore();
  };

  const handleMicSend = (): void => {
    if (audioFilesStore.length) {
      sendMessage({
        content: audioFilesStore[0].fileData.filename,
        file: audioFilesStore[0],
        repliedMessage: repliedMessageStore,
      });
    }
    if (forwardMessageStore) {
      sendMessage({ content: forwardMessageStore?.content ?? '', forwardMessage: forwardMessageStore });
    }
    if (selectedMessagesStore && selectedMessagesStore.length) {
      selectedMessagesStore.forEach((msg) => {
        sendMessage({ content: msg.content ?? '', forwardMessage: msg });
      });
    }
    clearRepliedMessageStore();
    clearForwardMessageStore();
    clearSelectedMessagesStore();
    setIsRecordingMessage(false);
    clearAudioFilesStore();
  };
  return (
    <div className={styles.wrapper}>
      <button className={styles.cancel} onClick={handleCloseRecordingHeader}>
        Отмена
      </button>
      <div className={styles.block}>
        <div className={styles.couter}>
          <div className={styles.icon}>
            <div className={styles.icon}>
              <RedPointer />
            </div>
          </div>
          <div className={styles.time}>{formatTime(durationSec)}</div>
        </div>
        <div className={styles.micIcon}>
          {!isRecording && audioFilesStore.length ? (
            <button className={styles.micIcon} onClick={handleMicSend}>
              <MicSend />
            </button>
          ) : (
            <button
              className={styles.micIcon}
              onMouseDown={handlePointerStart}
              onMouseUp={handlePointerEnd}
              onTouchStart={handlePointerStart}
              onTouchEnd={handlePointerEnd}
              onContextMenu={(e) => e.preventDefault()}
              onMouseLeave={handlePointerEnd}
            >
              <MicActiveIcon isRecording={isRecording} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MicActiveIcon = ({ isRecording }: { isRecording: boolean }): JSX.Element => (
  <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="34" fill="#7769E1" />
    <circle
      cx="40"
      cy="40"
      r="37"
      stroke="#615AA3"
      strokeOpacity="0.3"
      strokeWidth={6}
      className={isRecording ? styles.pulse : ''}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M41.9948 39.3314V31.3314C41.9948 30.2282 41.1005 29.334 39.9974 29.334C38.8943 29.334 38 30.2283 38 31.3314V39.3314C38 40.4345 38.8943 41.3288 39.9974 41.3288C41.1005 41.3288 41.9948 40.4345 41.9948 39.3314ZM39.9974 27.334C37.7897 27.334 36 29.1237 36 31.3314V39.3314C36 41.5391 37.7897 43.3288 39.9974 43.3288C42.2051 43.3288 43.9948 41.5391 43.9948 39.3314V31.3314C43.9948 29.1237 42.2051 27.334 39.9974 27.334ZM38.998 48.3305C34.3355 47.846 30.6985 44.0082 30.6641 39.334H32.5641C32.6011 43.2467 35.8728 46.4822 39.9971 46.4822C44.1215 46.4822 47.3932 43.2467 47.4302 39.334H49.3302C49.2958 44.0077 45.6598 47.845 40.998 48.3304V52.6663H38.998V48.3305Z"
      fill="white"
    />
  </svg>
);
