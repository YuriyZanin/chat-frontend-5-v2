'use client';
import clsx from 'clsx';
import { removeDomain } from 'modules/conversation/chats/utils/utils';
import { CallAnimation } from 'modules/conversation/shared/ui/call-animation';
import Image from 'next/image';
import { JSX, useEffect, useRef, useState } from 'react';
import { useIceServersQuery } from '../../api';
import { useWebSocketChatStore } from '../../api/web-socket/use-web-socket-chat-store';
import { getDurationTime } from '../../lib/get-duration-time';
import { useCallsStore } from '../../model/calls';
import CallActiveIcon from '../../shared/icons/call-active.svg';
import CallEndIcon from '../../shared/icons/close.svg';
import CloseScreenIcon from '../../shared/icons/closescreen.svg';
import FullScreenIcon from '../../shared/icons/fullscreen.svg';
import MicroIcon from '../../shared/icons/micro.svg';
import VideoIcon from '../../shared/icons/video.svg';
import styles from './incoming-call-panel.module.scss';

type IncomingCallPanelProps = {
  currentUid: string;
};

export const IncomingCallPanel = ({ currentUid }: IncomingCallPanelProps): JSX.Element | null => {
  const {
    isFullScreen,
    isSound,
    avatarUrl,
    isShowVideo,
    hasRemoteVideo,
    contactFio,
    fromUserUid,
    messageRtcUid,
    offerSdp,
    state,
    duration,
    toggleFullScreen,
    toggleIncomingModalOpen,
    toggleSound,
    setCallData,
    setDuration,
    setState,
    resetCall,
  } = useCallsStore();

  const { data: iceConfig, isLoading } = useIceServersQuery();

  const URL_DEFAULT_AVATAR = '/images/profile/default.png';

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const localIceCandidateBuffer = useRef<RTCIceCandidate[]>([]);
  const iceCandidateBuffer = useRef<RTCIceCandidate[]>([]);

  const callStartTimeRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state === 'connected') {
      callStartTimeRef.current = Date.now();
      durationIntervalRef.current = setInterval(() => {
        if (callStartTimeRef.current) {
          const currentDuration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
          setDuration(currentDuration);
        }
      }, 1000);
    }

    if (state === 'end' && durationIntervalRef.current !== null) {
      clearInterval(durationIntervalRef.current);
    }
  }, [setDuration, state]);

  const webSocketChatSrore = useWebSocketChatStore((s) => s.webSocketChat);

  useEffect(() => {
    if (webSocketChatSrore === null) return;
    const { sendOfferCall, sendIceCandidate, sendAnswerCall } = webSocketChatSrore;
    if (!isLoading) {
      const initPeerConnection = async (): Promise<RTCPeerConnection | null> => {
        console.log('Инициализация PeerConnection');

        try {
          const pc = new RTCPeerConnection({
            iceServers: iceConfig?.iceServers,
          });

          pc.ontrack = (event): void => {
            const stream = event.streams[0];

            stream.onremovetrack = (e): void => {
              if (e.track.kind === 'video') {
                setCallData({ hasRemoteVideo: false });
              }
            };

            // Проверяем, что есть хотя бы один поток
            if (!event.streams || event.streams.length === 0) {
              console.warn('ontrack: нет потоков в событии');
              return;
            }

            // Ищем существующий объединённый поток или создаём новый
            let combinedStream = remoteStreamRef.current;

            if (!combinedStream) {
              combinedStream = new MediaStream();
              remoteStreamRef.current = combinedStream;
            }

            event.streams.forEach((incomingStream) => {
              incomingStream.getTracks().forEach((track) => {
                if (track.kind === 'video') {
                  const existingVideoTracks = combinedStream.getTracks().filter((t) => t.kind === 'video');

                  existingVideoTracks.forEach((oldTrack) => {
                    combinedStream.removeTrack(oldTrack);
                  });

                  combinedStream.addTrack(track);

                  setCallData({ hasRemoteVideo: true });
                } else {
                  const existingTrack = combinedStream.getTracks().find((t) => t.id === track.id);
                  if (!existingTrack) {
                    combinedStream.addTrack(track);
                  }
                }
              });
            });

            remoteStreamRef.current = combinedStream;

            console.log('траки: ' + combinedStream.getTracks());

            if (combinedStream.getTracks().length >= 2) {
              setCallData({ hasRemoteVideo: true });
            }

            combinedStream.getAudioTracks().forEach((track) => {
              track.enabled = isSound;
            });

            const remoteVideo = document.getElementById('remote-video') as HTMLVideoElement | null;

            if (remoteVideo) {
              remoteVideo.srcObject = remoteStreamRef.current;
            }
          };

          pc.onicecandidate = (event): void => {
            if (event.candidate) {
              const requestUid = crypto.randomUUID();
              sendIceCandidate({
                action: 'ice_candidate',
                request_uid: requestUid,
                object: {
                  from_user_uid: currentUid,
                  to_user_uid: fromUserUid,
                  ice_candidate: event.candidate.candidate,
                  message_rtc_uid: messageRtcUid,
                },
              });
            }
          };

          pc.onnegotiationneeded = async (): Promise<void> => {
            console.log('Пересогласование');
            // Проверяем состояние соединения
            if (pc.signalingState !== 'stable') {
              console.warn('Нельзя отправить offer: текущее состояние —', pc.signalingState);
              return;
            }

            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);

              if (!offer.sdp) {
                console.error('SDP offer не содержит данных');
                setState('error');
                return;
              }

              const requestUid = crypto.randomUUID();
              sendOfferCall({
                action: 'offer_call',
                request_uid: requestUid,
                object: {
                  to_user_uid: fromUserUid,
                  offer_sdp: offer.sdp,
                },
              });
            } catch (error) {
              console.error('Ошибка при создании/отправке offer:', error);
            }
          };

          pc.onconnectionstatechange = (): void => {
            const state = pc.connectionState;
            console.log('Состояние соединения изменилось:', state);

            switch (state) {
              case 'connected':
                setState('connected');
                break;
              case 'failed':
                setState('error');
                break;
              case 'disconnected':
                console.warn('Временное отключение. Пытаемся восстановить соединение...');
                break;
              case 'closed':
                setState('end');
                console.log('Соединение закрыто.');
                break;
            }
          };

          return pc;
        } catch (error) {
          console.error('Ошибка создания RTCPeerConnection:', error);
          return null;
        }
      };

      const acceptIncomingCall = async (): Promise<void> => {
        if (!peerConnectionRef.current || peerConnectionRef.current.signalingState === 'closed') {
          const newPc = await initPeerConnection();
          if (!newPc) return;
          peerConnectionRef.current = newPc;
        }

        const pc = peerConnectionRef.current;

        if (pc.signalingState === 'closed') {
          console.warn('Пропускаем setRemoteDescription — соединение закрыто');
          return;
        }

        try {
          // Устанавливаем удалённое описание из offer
          await pc.setRemoteDescription({
            type: 'offer',
            sdp: offerSdp,
          });

          // Создаем поток только с аудио
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          localStreamRef.current = stream;

          if (localStreamRef.current) {
            const stream = localStreamRef.current;
            stream.getTracks().forEach((track) => peerConnectionRef.current!.addTrack(track, stream));
          }

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          const requestUid = crypto.randomUUID();
          sendAnswerCall({
            action: 'answer_call',
            request_uid: requestUid,
            object: {
              from_user_uid: fromUserUid,
              to_user_uid: currentUid,
              answer_sdp: answer.sdp as string,
              message_rtc_uid: messageRtcUid,
            },
          });
        } catch (error) {
          console.error('Ошибка при обработке входящего звонка:', error);
          setState('error');
        }
      };

      acceptIncomingCall();
    }
  }, [isLoading]);

  const checkPermissions = async (): Promise<boolean> => {
    try {
      const cameraPermission = await navigator.permissions.query({
        name: 'camera',
      });

      if (cameraPermission.state === 'denied') {
        alert('Для видео звонка нужно разрешить доступ к камере в настройках браузера');
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Не удалось проверить разрешения:', error);
      return false;
    }
  };

  const enableVideo = async (): Promise<void> => {
    if (!checkPermissions()) return;

    try {
      // Получаем видеопоток
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoTrack = videoStream.getVideoTracks()[0];

      // Добавляем видеодорожку в соединение
      peerConnectionRef.current?.addTrack(videoTrack, videoStream);

      // Добавляем в локальный поток
      localStreamRef.current?.addTrack(videoTrack);

      setCallData({ isShowVideo: true });
    } catch (err) {
      console.log('Ошибка включения видео:', err);
    }
  };

  const disableVideo = (): void => {
    try {
      const videoTrack = localStreamRef.current?.getVideoTracks()[0];
      const peerConnection = peerConnectionRef.current;

      if (!videoTrack || !peerConnection) return;

      // 1. Получаем sender для видеодорожки
      const sender = peerConnection.getSenders().find((s) => s.track === videoTrack);

      if (sender) {
        // 2. Удаляем трек из соединения
        peerConnection.removeTrack(sender);
      }

      // 4. Отключаем трек в локальном потоке
      videoTrack.stop();
      localStreamRef.current?.removeTrack(videoTrack);

      // 5. Обновляем UI
      setCallData({ isShowVideo: false });
      console.log('Видео полностью отключено и удалено из соединения');
    } catch (err) {
      console.error('Ошибка отключения видео:', err);
    }
  };

  useEffect(() => {
    if (isShowVideo) {
      const localVideo = document.getElementById('local-video') as HTMLVideoElement;
      if (localVideo && localStreamRef.current) {
        localVideo.srcObject = localStreamRef.current;
      }
    }
  }, [isShowVideo]);

  const handleSound = (): void => {
    toggleSound();
    const streamRemote = remoteStreamRef.current;
    if (streamRemote) {
      streamRemote.getAudioTracks().forEach((track) => {
        track.enabled = !isSound;
      });
      console.log(`Звук удалённого потока ${isSound ? 'выключен' : 'включён'}`);
    }

    const streamLocal = localStreamRef.current;
    if (streamLocal) {
      streamLocal.getAudioTracks().forEach((track) => {
        track.enabled = !isSound;
      });
      console.log(`Локальный звук ${isSound ? 'выключен' : 'включён'}`);
    }
  };

  const handleEndCall = (): void => {
    try {
      if (webSocketChatSrore === null) return;
      const { sendCallCompletion } = webSocketChatSrore;
      const requestUid = crypto.randomUUID();
      sendCallCompletion({
        action: 'call_completion',
        request_uid: requestUid,
        object: {
          from_user_uid: fromUserUid,
          to_user_uid: currentUid,
          type_complete: 'completed',
          message_rtc_uid: messageRtcUid,
          duration: duration,
        },
      });

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.onicecandidate = null;
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      iceCandidateBuffer.current = [];
      localIceCandidateBuffer.current = [];
      remoteStreamRef.current = null;

      // Очистка таймера
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      callStartTimeRef.current = null;

      resetCall();
    } catch (error) {
      console.error('Ошибка при завершении звонка:', error);
    }
  };
  // создаем url для запроса картинки через наш прокси-сервер который в запрос вставляет токен чтобы пройти автоизацию
  const result = `/api/proxy${removeDomain(avatarUrl ?? '')}`;
  // создаем состояние которое динамически заменить картинку аватара на дефолтную в случае ошибки при её загрузке
  const [imgSrc, setImgSrc] = useState(result !== '/api/proxy' ? result : URL_DEFAULT_AVATAR);

  return (
    <div className={clsx(styles.wrapper, { [styles.fullScreen]: isFullScreen })}>
      <video
        id="remote-video"
        className={clsx(styles.remoteVideo, { [styles.hidden]: !hasRemoteVideo })}
        autoPlay
        playsInline
      />
      <div className={styles.headerButtons}>
        <button onClick={toggleFullScreen}>
          <FullScreenIcon />
        </button>
        <button onClick={toggleIncomingModalOpen}>
          <CloseScreenIcon />
        </button>
      </div>
      <div className={styles.info}>
        {!hasRemoteVideo && (
          <Image
            src={imgSrc}
            width={160}
            height={160}
            unoptimized
            alt={contactFio}
            className={styles.avatar}
            onError={() => {
              setImgSrc(URL_DEFAULT_AVATAR);
            }}
          />
        )}
        <div className={styles.description}>
          <div className={styles.contact}>{contactFio}</div>
          <div className={styles.state}>
            {state === 'call' && (
              <>
                <p>Звонок</p>
                <CallAnimation />
              </>
            )}
            {(state === 'connected' || state === 'end') && (
              <>
                <CallActiveIcon />
                <p>{getDurationTime(duration)}</p>
              </>
            )}
            {state === 'connecting' && (
              <>
                <p>Соединение</p>
                <CallAnimation />
              </>
            )}
            {state === 'error' && <p>Ошибка соединения</p>}
            {state === 'rejected' && <p>Звонок отклонен</p>}
            {state === 'unreceived' && <p>Не отвечает</p>}
          </div>
        </div>
      </div>
      {isShowVideo && <video id="local-video" className={styles.localVideo} autoPlay muted />}
      <div className={styles.footerButtons}>
        <button className={styles.actionButton} onClick={() => (isShowVideo ? disableVideo() : enableVideo())}>
          <VideoIcon />
          <p className={styles.buttonText}>{isShowVideo ? 'Аудио' : 'Видео'}</p>
        </button>
        <button className={styles.actionButton} onClick={handleSound}>
          <MicroIcon />
          <p className={styles.buttonText}>{isSound ? 'Убрать звук' : 'Вкл. звук'}</p>
        </button>
        <button className={styles.actionButton} onClick={handleEndCall}>
          <CallEndIcon />
          <p className={styles.buttonText}>Завершить</p>
        </button>
      </div>
    </div>
  );
};
