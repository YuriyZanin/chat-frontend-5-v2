import clsx from 'clsx';
import { useCallsStore } from 'modules/conversation/messages-chat/model/calls/calls.store';
import { CallAnimation } from 'modules/conversation/shared/ui/call-animation';
import { JSX, useEffect, useRef } from 'react';
import { ImageUI } from 'shared/ui';
import { useIceServersQuery } from '../../api';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import { getDurationTime } from '../../lib/get-duration-time';
import CallActiveIcon from '../../shared/icons/call-active.svg';
import CallEndIcon from '../../shared/icons/close.svg';
import CloseScreenIcon from '../../shared/icons/closescreen.svg';
import FullScreenIcon from '../../shared/icons/fullscreen.svg';
import MicroIcon from '../../shared/icons/micro.svg';
import VideoIcon from '../../shared/icons/video.svg';
import styles from './outgoing-call-panel.module.scss';

type OutgoingCallPanelProps = {
  avatarUrl?: string;
  contact: string;
  user_uid: string;
  wsUrl: string;
  currentUid: string;
};

export const OutgoingCallPanel = ({
  avatarUrl,
  contact,
  user_uid,
  wsUrl,
  currentUid,
}: OutgoingCallPanelProps): JSX.Element | null => {
  const {
    isFullScreen,
    isShowVideo,
    hasRemoteVideo,
    state,
    duration,
    messageRtcUid,
    answerSdp,
    iceCandidates,
    isSound,
    toggleFullScreen,
    toggleCallsOpen,
    toggleSound,
    setState,
    setDuration,
    setCallData,
    resetCall,
  } = useCallsStore();
  const { data: iceConfig, isLoading } = useIceServersQuery();
  const { sendOfferCall, sendIceCandidate, sendCallCompletion } = useWebSocketChat(wsUrl, currentUid);

  const localStreamRef = useRef<MediaStream | undefined>(undefined);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const localIceCandidateBuffer = useRef<RTCIceCandidate[]>([]);
  const iceCandidateBuffer = useRef<RTCIceCandidate[]>([]);

  const callStartTimeRef = useRef<number | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) return;

    const initCall = async (): Promise<void> => {
      const pc = new RTCPeerConnection({ iceServers: iceConfig?.iceServers });
      peerConnectionRef.current = pc;
      console.log('Соединение pc открыто');

      // Создаем поток только с аудио
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStreamRef.current = stream;

      // Добавляем аудиодорожку в RTCPeerConnection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

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

        // Обрабатываем все потоки из события
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

      // пересогласование параметров соединения
      pc.onnegotiationneeded = async (): Promise<void> => {
        if (pc.signalingState !== 'stable') {
          console.warn('Нельзя отправить offer: текущее состояние —', pc.signalingState);
          return;
        }

        try {
          //создаём и отправляем offer тому, кому хотим позвонить
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
              to_user_uid: user_uid,
              offer_sdp: offer.sdp,
            },
          });
        } catch (error) {
          console.error('Ошибка при создании/отправке offer:', error);
        }
      };

      // При нахождении кандидата срабатывает обработчик pc.onicecandidate кандидат (сетевой маршрут) отправляется другому участнику через сигнальный сервер:
      pc.onicecandidate = (event): void => {
        if (event.candidate) {
          if (messageRtcUid) {
            const requestUid = crypto.randomUUID();
            sendIceCandidate({
              action: 'ice_candidate',
              request_uid: requestUid,
              object: {
                from_user_uid: currentUid,
                to_user_uid: user_uid,
                message_rtc_uid: messageRtcUid,
                ice_candidate: event.candidate.candidate, // строковое представление кандидата
              },
            });
          } else {
            localIceCandidateBuffer.current.push(event.candidate);
          }
        }
      };

      // Обработка состояния соединения
      pc.onconnectionstatechange = (): void => {
        const state = pc.connectionState;
        console.log('Состояние соединения изменилось:', state);

        switch (state) {
          case 'connected':
            setState(state);
            callStartTimeRef.current = Date.now();
            durationIntervalRef.current = setInterval(() => {
              if (callStartTimeRef.current) {
                const currentDuration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
                setDuration(currentDuration);
              }
            }, 1000);
            break;
          case 'failed':
            setState('error');
            break;
          case 'disconnected':
            if (durationIntervalRef.current) {
              clearInterval(durationIntervalRef.current);
              durationIntervalRef.current = null;
            }
            setState('end');
            setCallData({ isCallModalOpen: false });
            break;
          case 'closed':
            setState('end');
            break;
          case 'connecting':
            setState(state);
            break;
        }
      };
    };
    setState('call');
    initCall();
  }, [isLoading]);

  useEffect(() => {
    // берем все кандидаты из буфера и добавляем их
    const processIceCandidateBuffer = async (pc: RTCPeerConnection): Promise<void> => {
      for (const candidate of iceCandidateBuffer.current) {
        await pc.addIceCandidate(candidate);
      }
      iceCandidateBuffer.current = [];
    };

    const answerCall = async (): Promise<void> => {
      if (!answerSdp) return;

      if (!peerConnectionRef.current) {
        console.warn('RTCPeerConnection не инициализирован');
        return;
      }

      const pc = peerConnectionRef.current;

      try {
        await pc.setRemoteDescription({
          type: 'answer',
          sdp: answerSdp,
        });
        await processIceCandidateBuffer(pc);
        setState('connected');
      } catch (error) {
        console.error('Ошибка установки remoteDescription для answer:', error);
        setState('error');
      }
    };

    answerCall();
  }, [answerSdp]);

  useEffect(() => {
    const addCandidate = async (candidateStr: string): Promise<void> => {
      if (!peerConnectionRef.current) {
        console.warn('RTCPeerConnection не инициализирован');
        return;
      }

      const pc = peerConnectionRef.current;

      if (pc.signalingState === 'closed') {
        console.warn('Попытка добавить ICE‑кандидат в закрытое соединение');
        return;
      }

      const iceCandidate = new RTCIceCandidate({
        candidate: candidateStr,
        sdpMid: '0',
        sdpMLineIndex: 0,
      });

      if (pc.remoteDescription) {
        await pc.addIceCandidate(iceCandidate);
      } else {
        iceCandidateBuffer.current.push(iceCandidate);
      }
    };

    const buffer = iceCandidateBuffer.current;
    const existing = buffer.map((i) => i.candidate);

    iceCandidates.filter((c) => !existing.includes(c)).map((c) => addCandidate(c));
  }, [iceCandidates]);

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
      const requestUid = crypto.randomUUID();
      sendCallCompletion({
        action: 'call_completion',
        request_uid: requestUid,
        object: {
          from_user_uid: currentUid,
          to_user_uid: user_uid,
          type_complete: 'completed',
          message_rtc_uid: messageRtcUid,
          duration: duration,
        },
      });

      clearCall();
      resetCall();
    } catch (error) {
      console.error('Ошибка при завершении звонка:', error);
    }
  };

  const clearCall = (): void => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = undefined;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    iceCandidateBuffer.current = [];
    localIceCandidateBuffer.current = [];
    remoteStreamRef.current = null;

    const localVideo = document.getElementById('local-video') as HTMLVideoElement;
    const remoteVideo = document.getElementById('remote-video') as HTMLVideoElement;

    if (localVideo) {
      localVideo.srcObject = null;
    }
    if (remoteVideo) {
      remoteVideo.srcObject = null;
    }

    // Очистка таймера
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    callStartTimeRef.current = null;
  };

  useEffect(() => {
    if (state === 'end' || state === 'error' || state === 'rejected' || state === 'unreceived') {
      clearCall();
    }
  }, [state]);

  const sendBufferedLocalIceCandidates = (): void => {
    if (!messageRtcUid || !localIceCandidateBuffer.current.length) return;

    localIceCandidateBuffer.current.forEach((candidate) => {
      const requestUid = crypto.randomUUID();
      sendIceCandidate({
        action: 'ice_candidate',
        request_uid: requestUid,
        object: {
          from_user_uid: currentUid,
          to_user_uid: user_uid,
          message_rtc_uid: messageRtcUid,
          ice_candidate: candidate.candidate,
        },
      });
    });
  };

  useEffect(() => {
    sendBufferedLocalIceCandidates();
  }, [messageRtcUid]);

  const URL_DEFAULT_AVATAR = '/images/profile/default.png';

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
        <button onClick={toggleCallsOpen}>
          <CloseScreenIcon />
        </button>
      </div>
      <div className={styles.info}>
        {!hasRemoteVideo && (
          <ImageUI
            src={avatarUrl ?? URL_DEFAULT_AVATAR}
            width={160}
            height={160}
            alt={contact}
            className={styles.avatar}
          />
        )}
        <div className={styles.description}>
          <div className={styles.contact}>{contact}</div>
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
