import React from 'react';
import { generateQRMatrix } from '../../utils/helpers';

interface QRCodeViewProps {
  code: string;
  title?: string;
  subtitle?: string;
  size?: number; // pixel width
  showBorder?: boolean;
}

export const QRCodeView: React.FC<QRCodeViewProps> = ({
  code,
  title,
  subtitle,
  size = 140,
  showBorder = true,
}) => {
  const matrix = React.useMemo(() => generateQRMatrix(code), [code]);
  const cellSize = size / matrix.length;

  return (
    <div className={`inline-flex flex-col items-center bg-white p-3 rounded-xl text-neutral-900 shadow-md ${showBorder ? 'border border-neutral-300' : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shape-rendering-crispEdges"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#000000"
              />
            ) : null
          )
        )}
      </svg>
      <div className="mt-2 text-center">
        {title && <p className="font-bold text-xs tracking-wider uppercase text-neutral-800">{title}</p>}
        <p className="font-mono text-[10px] font-semibold text-neutral-500 tracking-wider">{code}</p>
        {subtitle && <p className="text-[9px] text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
};
