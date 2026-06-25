/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ShortsEditor from './components/ShortsEditor';
import { Sparkles, Video, Flame, Film } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans select-none antialiased">
      
      {/* Sleek App Navigation Topbar */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-800 p-2 rounded-xl text-zinc-100 border border-zinc-700">
            <Film className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              Shorts Video Editor
            </h1>
            <p className="text-xs text-zinc-400">Add overlays, emojis, subtitles, and rank lists to your vertical videos.</p>
          </div>
        </div>
      </header>

      {/* Primary Workspace Area */}
      <main className="flex-1 p-6 flex flex-col justify-center">
        <ShortsEditor />
      </main>

    </div>
  );
}

