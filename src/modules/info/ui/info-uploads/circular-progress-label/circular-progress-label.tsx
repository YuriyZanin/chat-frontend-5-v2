import { JSX } from 'react';
import styles from './circular-progress-label.module.scss';
import { CircularProgressLabelProps } from './circular-progress-label.props';

export const CircularProgressLabel = ({
  progress = 0,
  size = 36,
  borderRadius = 20,
  strokeWidth = 2,
  isLoading = false,
  children,
}: CircularProgressLabelProps): JSX.Element => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={styles.container}
      style={{ width: `${size}px`, height: `${size}px`, borderRadius: `${borderRadius}px` }}
    >
      <svg
        width={size - 2}
        height={size - 2}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(-180deg)',
        }}
      >
        {isLoading && (
          <circle
            cx={(size - 2) / 2}
            cy={(size - 2) / 2}
            r={radius}
            stroke="#ffffff"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease-out',
            }}
          />
        )}
      </svg>
      {children}
    </div>
  );
};
