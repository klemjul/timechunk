import { cn } from '@/lib/utils';

interface ColorDisplayProps {
  color: string;
  text?: string;
  className?: string;
}

function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function ColorDisplay({ color, text, className }: ColorDisplayProps) {
  const textColor = getContrastTextColor(color);
  const displayText = text || color;

  return (
    <div
      className={cn('px-2 py-1 rounded text-xs font-medium', className)}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      {displayText}
    </div>
  );
}
