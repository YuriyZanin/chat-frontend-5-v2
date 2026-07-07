// src/modules/settings/lib/image-cropper/use-image-cropper.ts
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'; // Добавляем useEffect
import { cropImage } from './crop-image';

type UseImageCropperReturn = {
  zoom: number;
  setZoom: (value: number) => void;
  previewUrl: string | null;
  originalFile: File | null;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
  setPosition: ({ x, y }: { x: number; y: number }) => void;
  position: { x: number; y: number };
  containerRef: RefObject<HTMLDivElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  cropAndGetFile: () => Promise<File>;

  // fileInputRef: React.RefObject<HTMLInputElement>;
};

// Принимаем начальные значения
export const useImageCropper = (
  initialPreviewUrl: string | null = null,
  initialOriginalFile: File | null = null,
): UseImageCropperReturn => {
  const [zoom, setZoom] = useState<number>(100);
  // Используем initialPreviewUrl для начального состояния
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);
  // Используем initialOriginalFile для начального состояния
  const [originalFile, setOriginalFile] = useState<File | null>(initialOriginalFile);
  // Состояние для позиции изображения
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [maxOffset, setMaxOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  // Рефы
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });

  // Опционально: синхронизируем originalFile с previewUrl, если originalFile не предоставлен, но previewUrl есть
  // Но в данном случае, мы явно передаём оба, так что это может быть не нужно.
  // Если initialOriginalFile === null, но initialPreviewUrl !== null, то originalFile останется null.
  // Это может быть корректным поведением, если URL получен не из выбранного File.

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Выбран не изображение');
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      console.error('Размер файла превышает 5 МБ');
      return;
    }

    setOriginalFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setZoom(100); // Сбрасываем zoom при новом файле
    setPosition({ x: 0, y: 0 });
  }, []);

  // Расчет максимального смещения
  useEffect(() => {
    if (!containerRef.current || !previewUrl) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    const img = new window.Image();
    img.src = previewUrl;
    img.onload = (): void => {
      const scale = zoom / 100;
      const imageWidth = img.width * scale;
      const imageHeight = img.height * scale;

      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Если изображение больше контейнера, вычисляем максимальное смещение
      const maxX = Math.max(0, (imageWidth - containerWidth) / 10);
      const maxY = Math.max(0, (imageHeight - containerHeight) / 15);

      setMaxOffset({ x: maxX, y: maxY });

      // Если изображение меньше контейнера, центрируем
      if (imageWidth <= containerWidth && imageHeight <= containerHeight) {
        setPosition({ x: 0, y: 0 });
      }
    };
  }, [previewUrl, zoom, setMaxOffset]);

  // Обработчики для перетаскивания
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (zoom <= 100) return;

      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      dragOffset.current = { x: position.x, y: position.y };
    },
    [zoom, position],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      const newX = Math.max(-maxOffset.x, Math.min(maxOffset.x, dragOffset.current.x + deltaX));
      const newY = Math.max(-maxOffset.y, Math.min(maxOffset.y, dragOffset.current.y + deltaY));

      setPosition({ x: newX, y: newY });
    },
    [isDragging, maxOffset],
  );
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  // Функция для создания обрезанного файла
  const cropAndGetFile = useCallback(async (): Promise<File> => {
    if (!previewUrl) {
      throw new Error('Изображение не загружено');
    }

    if (!containerRef.current) {
      throw new Error('Контейнер не найден');
    }

    // Получаем размеры контейнера
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerSize = {
      width: containerRect.width,
      height: containerRect.height,
    };

    // Создаем обрезанное изображение
    const croppedFile = await cropImage(previewUrl, zoom, position, containerSize);

    return croppedFile;
  }, [previewUrl, zoom, position]);

  const reset = useCallback(() => {
    setZoom(100);
    setPreviewUrl(null);
    setOriginalFile(null);
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    setMaxOffset({ x: 0, y: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return {
    zoom,
    setZoom,
    previewUrl,
    originalFile,
    isDragging,
    setIsDragging,
    handleFileChange,
    reset,
    setPosition,
    position,
    containerRef,
    fileInputRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cropAndGetFile,
  };
};
