export interface EditorOverlay {
  id: string;
  type: 'text' | 'sticker' | 'caption-list' | 'heading';
  text: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  fontSize: number; // raw value
  color: string;
  strokeColor: string;
  strokeWidth: number;
  backgroundColor: string;
  fontFamily: string;
  scale: number;
  rotation: number; // degrees
  fontWeight: string;
  // Animation style
  animation: 'none' | 'bounce' | 'pulse' | 'wiggle' | 'shake' | 'fade-in' | 'slide-up';
  // Timeframe constraints (seconds)
  startTime: number;
  endTime: number;
  // Unique list structure (for rankings / list overlays)
  listItems?: {
    id: string;
    text: string;
    emoji?: string;
    color: string;
    isStrikethrough?: boolean;
    isActive?: boolean;
  }[];
}

export interface VideoProject {
  id: string;
  videoUrl: string;
  videoTitle: string;
  duration: number; // seconds
  headerText: string;
  headerBgColor: string;
  headerTextColor: string;
  overlays: EditorOverlay[];
  volume: number; // 0 - 1
  currentTime: number;
}
