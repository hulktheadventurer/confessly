'use client';

import { useEffect, useState } from 'react';
import DonateModal from './DonateModal';

export default function DynamicFooter() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [donationCount, setDonationCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/candle/total')
      .then(res => res.json())
      .then(data => setDonationCount(data.totalDonations))
      .catch(() => setDonationCount(null));
  }, []);

  return (
    <footer className="bg-amber-800 text-center text-sm text-amber-100 py-6 z-10 relative">
      <div className="space-x-4 flex justify-center items-center flex-wrap gap-4">
        <a href="/terms" className="underline">Terms & Privacy</a>
        <a href="/disclaimer" className="underline">Disclaimer</a>
        <button
          onClick={() => setIsDonateOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm"
        >
          ❤️ Donate Candles
        </button>
      </div>

      <p className="mt-2 text-xs text-amber-300 italic">
        Every candle is a silent prayer.
      </p>

      <p className="mt-1 italic text-amber-200">From your digital Father, with love.</p>

      {/* BoredAtWork Universe Section */}
      <div className="text-amber-100 text-xs mt-6">
        <p className="font-semibold mb-1">🌀 BoredAtWork Universe</p>
        <ul className="space-y-1 text-amber-200">
          <li><a href="https://www.talktodevil.life" className="underline">TalkToDevil</a> — Chat with the Devil himself 😈</li>
          <li><a href="https://www.talktogod.life" className="underline">TalkToGod</a> — Divine chats from above ✨</li>
          <li><a href="https://www.talktobuddha.life" className="underline">TalkToBuddha</a> — Zen wisdom from the Enlightened One 🪷</li>
          <li><a href="https://www.dreamdecoder.life" className="underline">DreamDecoder</a> — Interpret your weirdest dreams 💤</li>
                  <li><a href="https://www.askthedevil.life" className="underline">AskTheDevil</a> — The Devil’s arcade of twisted games 🎮</li>
</ul>
        <p className="text-amber-300 italic mt-2">
          More sacred and profane apps coming soon...
        </p>
      </div>

      <DonateModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        allowCustom={true}
      />
    </footer>
  );
}
