export const PROMPT_ENHANCER_INSTRUCTIONS = `
You are a specialized game development prompt enhancer. Your job is to analyze user requests and enhance them with specific game development context and requirements.

When you receive a user request, you should:

1. **Identify Game Type**: Determine what type of game the user wants to create
2. **Add Game-Specific Context**: Enhance the prompt with relevant game development details
3. **Include Asset Requirements**: Specify what sprites and assets are needed
4. **Add Technical Requirements**: Include Phaser.js setup, game loop, and other technical details
5. **Maintain Original Intent**: Preserve the user's original request while adding game development context

Focus on HTML5 browser games using Phaser.js with professional sprites and assets.
`;

export const enhanceGamePrompt = (userRequest: string): string => {
  // Game detection patterns
  const gamePatterns = {
    platformer: /platform|jump|run|mario|sonic|side-scroll/i,
    shooter: /shoot|gun|bullet|space|invader|galaga/i,
    puzzle: /puzzle|match|tetris|connect|logic/i,
    racing: /race|car|drive|speed|track/i,
    rpg: /rpg|role|character|quest|adventure/i,
    strategy: /strategy|tower|defense|planning/i,
    arcade: /arcade|classic|retro|simple/i
  };

  // Detect game type
  let gameType = 'arcade';
  for (const [type, pattern] of Object.entries(gamePatterns)) {
    if (pattern.test(userRequest)) {
      gameType = type;
      break;
    }
  }

  // Enhance based on game type
  const enhancements = {
    platformer: `
🎮 **PLATFORMER GAME ENHANCEMENT**
- Character with jumping and movement mechanics
- Multiple levels with increasing difficulty
- Collectibles (coins, power-ups)
- Enemies with basic AI
- Background parallax effects
- Sound effects for jumping, collecting, and death
- Score system and lives counter
- Level progression system
`,
    shooter: `
🎮 **SHOOTER GAME ENHANCEMENT**
- Player ship with movement controls
- Enemy spawning system
- Bullet/projectile mechanics
- Collision detection for bullets and enemies
- Power-ups and weapon upgrades
- Background scrolling effect
- Explosion animations
- High score system
- Multiple enemy types with different behaviors
`,
    puzzle: `
🎮 **PUZZLE GAME ENHANCEMENT**
- Grid-based game board
- Match detection algorithms
- Score calculation system
- Timer or move counter
- Visual feedback for matches
- Sound effects for matches and moves
- Level progression with increasing difficulty
- Hint system for stuck players
`,
    racing: `
🎮 **RACING GAME ENHANCEMENT**
- Car with physics-based movement
- Track with boundaries and obstacles
- Lap counter and timer
- Multiple tracks or procedural generation
- Car upgrades and customization
- Sound effects for engine, collisions
- Visual effects for speed and drift
- Leaderboard system
`,
    rpg: `
🎮 **RPG GAME ENHANCEMENT**
- Character with stats and inventory
- NPCs with dialogue system
- Quest tracking system
- Combat mechanics with turn-based or real-time
- Experience and leveling system
- Item collection and management
- World exploration mechanics
- Save/load game state
`,
    strategy: `
🎮 **STRATEGY GAME ENHANCEMENT**
- Resource management system
- Unit placement and movement
- Turn-based or real-time strategy
- Victory/defeat conditions
- Fog of war or limited visibility
- Multiple unit types with different abilities
- Strategic depth and planning elements
- AI opponents with different difficulty levels
`,
    arcade: `
🎮 **ARCADE GAME ENHANCEMENT**
- Simple, addictive gameplay loop
- Increasing difficulty over time
- High score tracking
- Quick restart functionality
- Minimalist but engaging graphics
- Sound effects and background music
- Mobile-friendly controls
- Progressive difficulty scaling
`
  };

  return `${userRequest}

${enhancements[gameType as keyof typeof enhancements]}

**TECHNICAL REQUIREMENTS:**
- Use Phaser.js 3 for game framework
- Implement proper game state management
- Add responsive controls for keyboard/mouse/touch
- Include loading screens and asset management
- Optimize for browser performance
- Add proper game loop with requestAnimationFrame
- Implement collision detection systems
- Include particle effects and visual feedback
- Add background music and sound effects
- Create smooth animations and transitions

**ASSET REQUIREMENTS:**
- Professional sprites for all game elements
- Background images and tilesets
- UI elements (buttons, menus, HUD)
- Sound effects and background music
- Particle effects and animations
- Loading screen and game over screens

**GAME DEVELOPMENT APPROACH:**
- Start with core gameplay mechanics
- Add visual and audio polish
- Implement scoring and progression systems
- Test and balance difficulty
- Add additional features and content
`;
}; 