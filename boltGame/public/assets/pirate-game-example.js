/**
 * Pirate Adventure Game Example
 * Demonstrates using pirate-assets.json with other asset registries
 * Creates a complete pirate-themed game with ships, islands, and treasure hunting
 */

// Import the multi-registry system
// import { MultiRegistryAssetManager } from './multi-registry-loader.js';

class PirateAdventureGame extends Phaser.Scene {
  constructor() {
    super({ key: 'PirateAdventureGame' });
    this.assetManager = null;
    this.player = null;
    this.ships = null;
    this.treasures = null;
    this.islands = null;
  }

  async preload() {
    // Initialize multi-registry asset manager
    this.assetManager = new MultiRegistryAssetManager();
    
    // Register ALL three asset registries
    await this.assetManager.registerRegistries([
      { 
        name: 'platformer', 
        path: './assets/platformer-assets-curated.json' 
      },
      { 
        name: 'characters', 
        path: './assets/character-assets-extended.json' 
      },
      { 
        name: 'pirate', 
        path: './assets/pirate-assets.json' 
      }
    ]);

    // Load assets from ALL registries for a complete pirate adventure
    await this.assetManager.loadAllRequiredAssets(this, {
      // Pirate-specific assets
      ships: ['ship_pirate_large', 'ship_pirate_medium', 'ship_ghost', 'boat_row_small'],
      pirate_items: ['chest', 'barrel', 'cannon', 'tool_shovel'],
      flags: ['flag_pirate', 'flag_pirate_high'],
      environment: ['palm_straight', 'palm_bend', 'rocks_a', 'patch_sand'],
      structures: ['tower_complete_large', 'structure_platform_dock', 'platform_planks'],
      
      // Character assets for crew members
      crew: ['player_idle', 'female_idle', 'soldier_idle'],
      enemies: ['zombie_idle', 'zombie_walk1'],
      
      // Platformer basics for gameplay
      platforms: ['terrain_grass_block', 'terrain_sand_block'],
      collectibles: ['coin_bronze', 'gem_blue'],
      basic_enemies: ['snail_walk_a']
    });

    console.log('🏴‍☠️ Pirate Adventure assets loaded from', this.assetManager.registries.size, 'registries!');
  }

  create() {
    // Create ocean background
    this.createOceanBackground();
    
    // Create main island
    this.createIsland();
    
    // Create pirate base
    this.createPirateBase();
    
    // Create ships in harbor
    this.createShips();
    
    // Create player character (pirate captain)
    this.createPirateCaptain();
    
    // Create crew members
    this.createCrew();
    
    // Create treasures and objectives
    this.createTreasures();
    
    // Create enemies
    this.createEnemies();
    
    // Setup physics and interactions
    this.setupPhysics();
    
    // Setup controls
    this.setupControls();
    
    // Create UI
    this.createUI();
  }

  createOceanBackground() {
    // Create ocean gradient background
    this.add.graphics()
      .fillGradientStyle(0x1E90FF, 0x1E90FF, 0x4169E1, 0x4169E1, 1)
      .fillRect(0, 0, 1200, 800);
    
    console.log('🌊 Ocean background created');
  }

  createIsland() {
    // Create main island with sand and grass terrain
    this.islands = this.add.group();
    
    // Sand base
    for (let x = 300; x < 900; x += 64) {
      for (let y = 500; y < 700; y += 64) {
        const sand = this.add.sprite(x, y, 'patch_sand');
        this.islands.add(sand);
      }
    }
    
    // Grass areas
    for (let x = 400; x < 800; x += 64) {
      const grass = this.add.sprite(x, 500, 'terrain_grass_block');
      this.islands.add(grass);
    }
    
    // Add palm trees
    this.add.sprite(350, 450, 'palm_straight');
    this.add.sprite(500, 420, 'palm_bend');
    this.add.sprite(750, 440, 'palm_straight');
    
    // Add rocks
    this.add.sprite(420, 480, 'rocks_a');
    this.add.sprite(680, 490, 'rocks_a');
    
    console.log('🏝️ Island terrain created');
  }

  createPirateBase() {
    // Create pirate tower fortress
    const tower = this.add.sprite(600, 400, 'tower_complete_large');
    
    // Add pirate flag
    this.add.sprite(600, 350, 'flag_pirate_high');
    
    // Create dock area
    this.add.sprite(200, 550, 'structure_platform_dock');
    this.add.sprite(150, 580, 'platform_planks');
    
    // Add cannons for defense
    this.add.sprite(550, 470, 'cannon');
    this.add.sprite(650, 470, 'cannon');
    
    console.log('🏰 Pirate base established');
  }

  createShips() {
    this.ships = this.physics.add.group();
    
    // Main pirate ship
    const pirateShip = this.physics.add.sprite(100, 400, 'ship_pirate_large');
    pirateShip.setScale(1.0);
    this.ships.add(pirateShip);
    
    // Ghost ship in the distance
    const ghostShip = this.physics.add.sprite(1000, 200, 'ship_ghost');
    ghostShip.setAlpha(0.7);
    this.ships.add(ghostShip);
    
    // Small escape boat
    const boat = this.physics.add.sprite(180, 520, 'boat_row_small');
    this.ships.add(boat);
    
    console.log('⚓ Ships deployed in harbor');
  }

  createPirateCaptain() {
    // Create player character (pirate captain)
    this.player = this.physics.add.sprite(600, 450, 'player_idle');
    this.player.setScale(1.0);
    this.player.body.setSize(48, 60);
    this.player.setCollideWorldBounds(true);
    
    // Add captain's hat effect (could be enhanced with custom sprites)
    console.log('👑 Pirate captain ready for adventure');
  }

  createCrew() {
    // Create crew members around the base
    const female = this.physics.add.sprite(550, 450, 'female_idle');
    female.setScale(1.0);
    
    const soldier = this.physics.add.sprite(650, 450, 'soldier_idle');
    soldier.setScale(1.0);
    
    console.log('👥 Crew members assembled');
  }

  createTreasures() {
    this.treasures = this.physics.add.group();
    
    // Main treasure chest
    const mainChest = this.physics.add.sprite(580, 470, 'chest');
    this.treasures.add(mainChest);
    
    // Scattered treasures
    const coin1 = this.physics.add.sprite(450, 480, 'coin_bronze');
    const coin2 = this.physics.add.sprite(720, 490, 'coin_bronze');
    const gem = this.physics.add.sprite(380, 470, 'gem_blue');
    
    this.treasures.add(coin1);
    this.treasures.add(coin2);
    this.treasures.add(gem);
    
    // Barrels with supplies
    this.add.sprite(520, 480, 'barrel');
    this.add.sprite(680, 480, 'barrel');
    
    console.log('💰 Treasures hidden around the island');
  }

  createEnemies() {
    // Zombie pirates (undead crew)
    const zombie1 = this.physics.add.sprite(800, 480, 'zombie_idle');
    zombie1.setScale(1.0);
    zombie1.setTint(0x88ff88); // Ghostly green tint
    
    // Basic island creatures
    const snail = this.physics.add.sprite(400, 500, 'snail_walk_a');
    snail.setScale(1.0);
    
    console.log('💀 Enemies lurking on the island');
  }

  setupPhysics() {
    // Create physics groups for platforms
    this.platforms = this.physics.add.staticGroup();
    
    // Add island terrain to physics
    this.islands.children.entries.forEach(island => {
      if (island.texture.key === 'terrain_grass_block' || 
          island.texture.key === 'terrain_sand_block') {
        this.platforms.add(island);
      }
    });
    
    // Player physics
    this.physics.add.collider(this.player, this.platforms);
    
    // Treasure collection
    this.physics.add.overlap(this.player, this.treasures, this.collectTreasure, null, this);
    
    console.log('⚖️ Physics system configured');
  }

  setupControls() {
    // Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D,SPACE,E');
    
    console.log('🎮 Controls ready - Arrow keys to move, SPACE to jump, E to interact');
  }

  createUI() {
    // Game title
    this.add.text(20, 20, '🏴‍☠️ Pirate Adventure', {
      fontSize: '24px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    
    // Asset source info
    this.add.text(20, 50, 'Assets from 3 registries: Pirate + Character + Platformer', {
      fontSize: '14px',
      fill: '#ffff00'
    });
    
    // Controls info
    this.add.text(20, 750, 'Arrow Keys: Move | SPACE: Jump | E: Interact', {
      fontSize: '16px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    });
    
    console.log('📺 UI elements created');
  }

  update() {
    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }
    
    // Jumping
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    
    // Ship bobbing animation
    if (this.ships) {
      this.ships.children.entries.forEach((ship, index) => {
        ship.y += Math.sin(this.time.now * 0.001 + index) * 0.5;
      });
    }
  }

  collectTreasure(player, treasure) {
    treasure.destroy();
    
    // Treasure collection effect
    this.add.text(treasure.x, treasure.y - 30, '+100 Gold!', {
      fontSize: '16px',
      fill: '#ffff00'
    }).setOrigin(0.5);
    
    console.log('💰 Treasure collected!');
  }
}

// Pirate Game Configuration
const pirateGameConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  backgroundColor: '#1E90FF',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: PirateAdventureGame
};

// Quick start function for pirate adventure
function startPirateAdventure() {
  console.log('🏴‍☠️ Starting Pirate Adventure...');
  console.log('📦 Loading assets from multiple registries...');
  
  return new Phaser.Game(pirateGameConfig);
}

// Example of using specific pirate assets
class PirateAssetShowcase extends Phaser.Scene {
  constructor() {
    super({ key: 'PirateAssetShowcase' });
  }

  async preload() {
    // Load only pirate assets for a focused showcase
    const response = await fetch('./assets/pirate-assets.json');
    const pirateAssets = await response.json();
    
    // Load a selection of pirate assets
    const showcaseAssets = [
      'ship_pirate_large', 'chest', 'flag_pirate', 'tower_complete_large',
      'palm_straight', 'cannon', 'barrel', 'rocks_a'
    ];
    
    showcaseAssets.forEach(assetId => {
      const baseUrl = pirateAssets.baseURL;
      // Convert asset ID to filename (replace underscores with hyphens)
      const filename = assetId.replace(/_/g, '-') + '.png';
      this.load.image(assetId, `${baseUrl}/${filename}`);
    });
  }

  create() {
    this.add.text(400, 50, '🏴‍☠️ Pirate Assets Showcase', {
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    // Display assets in a grid
    const assets = [
      { key: 'ship_pirate_large', x: 200, y: 200, label: 'Pirate Ship' },
      { key: 'chest', x: 400, y: 200, label: 'Treasure Chest' },
      { key: 'flag_pirate', x: 600, y: 200, label: 'Pirate Flag' },
      { key: 'tower_complete_large', x: 800, y: 200, label: 'Fortress' },
      { key: 'palm_straight', x: 200, y: 400, label: 'Palm Tree' },
      { key: 'cannon', x: 400, y: 400, label: 'Cannon' },
      { key: 'barrel', x: 600, y: 400, label: 'Barrel' },
      { key: 'rocks_a', x: 800, y: 400, label: 'Rocks' }
    ];
    
    assets.forEach(asset => {
      this.add.sprite(asset.x, asset.y, asset.key).setScale(1.5);
      this.add.text(asset.x, asset.y + 80, asset.label, {
        fontSize: '14px',
        fill: '#ffffff'
      }).setOrigin(0.5);
    });
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PirateAdventureGame, PirateAssetShowcase, startPirateAdventure };
}

console.log('🏴‍☠️ Pirate Adventure Game System Ready!');
console.log('🎮 Use startPirateAdventure() to begin your pirate journey!');