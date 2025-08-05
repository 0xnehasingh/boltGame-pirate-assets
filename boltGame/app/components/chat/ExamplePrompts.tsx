import React from 'react';

const EXAMPLE_PROMPTS = [
  { text: 'Make a Space Invaders game', icon: '/M1.png' },
  { text: 'Create a 2D platformer game', icon: '/M2.png' },
  { text: 'Build a Tic Tac Toe game', icon: '/M3.png' },
  { text: 'Develop a memory matching game', icon: '/M4.png' },
  { text: 'Create a Snake game', icon: '/M5.png' },
  { text: 'Build a card-matching game', icon: '/M6.png' },
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div
        className="flex flex-col gap-4"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {/* First row - slice(0,3) */}
        <div className="flex justify-center gap-4">
          {EXAMPLE_PROMPTS.slice(0, 3).map((examplePrompt, index: number) => (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="flex items-center space-x-2 border border-emerald-500/30 rounded-full backdrop-blur-sm text-slate-200 px-4 py-2 text-sm transition-all duration-200 font-medium shadow-lg"
              style={{ 
                backgroundColor: '#141313',
                '--hover-border-color': index === 0 ? '#3B82F6' : index === 1 ? '#3B82F6' : '#10B981'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const color = index === 0 ? '#06B6D4' : index === 1 ? '#3B82F6' : '#10B981';
                e.currentTarget.style.borderColor = color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              }}
            >
              <img 
                src={examplePrompt.icon} 
                alt={`${examplePrompt.text} icon`}
                className="w-5 h-5 flex-shrink-0"
              />
              <span>{examplePrompt.text}</span>
            </button>
          ))}
        </div>
        
        {/* Second row - slice(3,6) */}
        <div className="flex justify-center gap-4">
          {EXAMPLE_PROMPTS.slice(3, 6).map((examplePrompt, index: number) => (
            <button
              key={index + 3}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="flex items-center space-x-1 border border-emerald-500/30 rounded-full backdrop-blur-sm text-slate-200 px-4 py-2 text-sm transition-all duration-200 font-medium shadow-lg"
              style={{ 
                backgroundColor: '#141313',
                '--hover-border-color': index === 0 ? '#F97316' : index === 1 ? '#10B981' : '#EF4444'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const color = index === 0 ? '#F97316' : index === 1 ? '#10B981' : '#EF4444';
                e.currentTarget.style.borderColor = color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              }}
            >
              <img 
                src={examplePrompt.icon} 
                alt={`${examplePrompt.text} icon`}
                className="w-5 h-5 flex-shrink-0"
              />
              <span>{examplePrompt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
