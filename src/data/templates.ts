export interface VideoTemplate {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
}

export const PRELOADED_VIDEOS: VideoTemplate[] = [
  {
    id: 'thrilling-action',
    title: 'Epic Fire & Action Loop',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&auto=format&fit=crop&q=80',
    duration: 15
  },
  {
    id: 'cyberpunk-ride',
    title: 'Neon Joyride Track',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&auto=format&fit=crop&q=80',
    duration: 15
  },
  {
    id: 'playful-animation',
    title: 'Bunny CGI Comedy',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=80',
    duration: 60
  },
  {
    id: 'escape-action',
    title: 'Speed & Escape Loop',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=80',
    duration: 14
  }
];

export interface TextPreset {
  id: string;
  name: string;
  style: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
    backgroundColor: string;
    fontFamily: string;
    fontSize: number;
    textShadow: string;
    fontWeight: string;
  };
}

export const TEXT_PRESETS: TextPreset[] = [
  {
    id: 'shorts-yellow',
    name: 'Shorts Yellow (Impact)',
    style: {
      color: '#FACC15', // yellow-400
      strokeColor: '#000000',
      strokeWidth: 4,
      backgroundColor: 'transparent',
      fontFamily: 'Bebas Neue',
      fontSize: 32,
      textShadow: '3px 3px 0px #000',
      fontWeight: 'bold'
    }
  },
  {
    id: 'shorts-white',
    name: 'Classic White Outlined',
    style: {
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 4,
      backgroundColor: 'transparent',
      fontFamily: 'Bebas Neue',
      fontSize: 32,
      textShadow: '3px 3px 0px #000',
      fontWeight: 'bold'
    }
  },
  {
    id: 'comic-boom',
    name: 'Comic Bubble Red',
    style: {
      color: '#EF4444', // red-500
      strokeColor: '#FFFFFF',
      strokeWidth: 3,
      backgroundColor: '#000000',
      fontFamily: 'Bangers',
      fontSize: 28,
      textShadow: '2px 2px 0px #EF4444',
      fontWeight: '900'
    }
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber Cyan',
    style: {
      color: '#22D3EE', // cyan-400
      strokeColor: '#000000',
      strokeWidth: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      fontFamily: 'Space Grotesk',
      fontSize: 26,
      textShadow: '0 0 10px #22D3EE, 0 0 20px #0891B2',
      fontWeight: 'bold'
    }
  },
  {
    id: 'minecraft',
    name: 'Retro Pixel Green',
    style: {
      color: '#22C55E', // green-500
      strokeColor: '#000000',
      strokeWidth: 3,
      backgroundColor: 'transparent',
      fontFamily: 'Courier New',
      fontSize: 28,
      textShadow: '2px 2px 0px #15803D',
      fontWeight: 'bold'
    }
  }
];

export interface RankingPreset {
  id: string;
  name: string;
  items: {
    text: string;
    styleId: string;
  }[];
}

export const RANKING_PRESETS: RankingPreset[] = [
  {
    id: 'top-5-pranks',
    name: 'Prank Ranking (Top 5)',
    items: [
      { text: '1.', styleId: 'minecraft' },
      { text: '2.', styleId: 'shorts-yellow' },
      { text: '3.', styleId: 'shorts-yellow' },
      { text: '4. OOPS', styleId: 'shorts-white' },
      { text: '5. WHAT', styleId: 'shorts-white' }
    ]
  },
  {
    id: 'top-3-fails',
    name: 'Epic Fails (Top 3)',
    items: [
      { text: '1. JUMP FAIL', styleId: 'comic-boom' },
      { text: '2. SLIP', styleId: 'shorts-yellow' },
      { text: '3. CLOSE CALL', styleId: 'shorts-white' }
    ]
  }
];
