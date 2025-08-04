/**
 * Multi-Registry Asset Loader
 * Load assets from multiple JSON registries simultaneously
 * Supports both platformer-assets-curated.json and character-assets-extended.json
 */

class MultiRegistryAssetManager {
  constructor() {
    this.registries = new Map();
    this.loadedAssets = new Map();
    this.assetIndex = new Map(); // Global asset lookup
  }

  // Register multiple JSON asset registries
  async registerRegistries(registryConfigs) {
    for (const config of registryConfigs) {
      try {
        const response = await fetch(config.path);
        const registry = await response.json();
        this.registries.set(config.name, registry);
        this.indexAssets(config.name, registry);
        console.log(`✅ Registered ${config.name} registry with ${this.getRegistryAssetCount(config.name)} assets`);
      } catch (error) {
        console.error(`❌ Failed to load registry ${config.name}:`, error);
      }
    }
  }

  // Index all assets for fast lookup across registries
  indexAssets(registryName, registry) {
    const categories = registry.categories || {};
    
    Object.entries(categories).forEach(([categoryName, category]) => {
      if (category.assets) {
        category.assets.forEach(asset => {
          // Store asset with registry source info
          this.assetIndex.set(asset.id, {
            ...asset,
            source: registryName,
            category: categoryName
          });
        });
      }
    });
  }

  // Load assets from ALL registered registries
  async loadAllRequiredAssets(scene, requirements) {
    const assetsToLoad = this.gatherRequiredAssets(requirements);
    
    console.log(`🎮 Loading ${assetsToLoad.length} assets from ${this.registries.size} registries...`);
    
    for (const asset of assetsToLoad) {
      if (!this.loadedAssets.has(asset.id)) {
        console.log(`📦 Loading ${asset.id} from ${asset.source} registry`);
        scene.load.image(asset.id, asset.url);
        this.loadedAssets.set(asset.id, asset);
      }
    }
    
    return new Promise((resolve) => {
      scene.load.once('complete', () => {
        console.log(`✅ Successfully loaded ${assetsToLoad.length} assets!`);
        this.printLoadingSummary();
        resolve();
      });
      scene.load.start();
    });
  }

  // Gather assets from multiple registries based on requirements
  gatherRequiredAssets(requirements) {
    const requiredAssets = [];
    
    // Process each requirement category
    Object.entries(requirements).forEach(([category, assetIds]) => {
      assetIds.forEach(assetId => {
        const asset = this.assetIndex.get(assetId);
        if (asset) {
          requiredAssets.push(asset);
        } else {
          console.warn(`⚠️ Asset ${assetId} not found in any registry`);
        }
      });
    });
    
    return requiredAssets;
  }

  // Get asset info with source registry
  getAssetInfo(assetId) {
    return this.assetIndex.get(assetId);
  }

  // Get all assets from specific registry
  getAssetsFromRegistry(registryName) {
    return Array.from(this.assetIndex.values())
      .filter(asset => asset.source === registryName);
  }

  // Get registry statistics
  getRegistryStats() {
    const stats = {};
    this.registries.forEach((registry, name) => {
      stats[name] = {
        categories: Object.keys(registry.categories || {}).length,
        totalAssets: this.getRegistryAssetCount(name)
      };
    });
    return stats;
  }

  getRegistryAssetCount(registryName) {
    return Array.from(this.assetIndex.values())
      .filter(asset => asset.source === registryName).length;
  }

  printLoadingSummary() {
    const stats = this.getRegistryStats();
    console.log('📊 Registry Loading Summary:');
    Object.entries(stats).forEach(([name, stat]) => {
      console.log(`   ${name}: ${stat.totalAssets} assets, ${stat.categories} categories`);
    });
  }
}

// Universal helper function to load from multiple registries
async function loadMultiRegistryAssets(scene, config) {
  const assetManager = new MultiRegistryAssetManager();
  
  // Register both curated and extended character registries
  await assetManager.registerRegistries([
    { 
      name: 'curated', 
      path: './assets/platformer-assets-curated.json' 
    },
    { 
      name: 'characters', 
      path: './assets/character-assets-extended.json' 
    }
  ]);
  
  // Load what the game needs from ALL registries
  await assetManager.loadAllRequiredAssets(scene, config.requirements);
  
  return assetManager;
}

// Example game implementation using both registries
class ExamplePlatformerGame extends Phaser.Scene {
  constructor() {
    super({ key: 'ExamplePlatformerGame' });
  }

  async preload() {
    // Load assets from BOTH registries
    this.assetManager = await loadMultiRegistryAssets(this, {
      requirements: {
        // From curated registry (platformer essentials)
        enemies: ['snail_walk_a', 'slime_normal_walk_a', 'frog_idle'],
        platforms: ['terrain_grass_block', 'terrain_stone_block', 'terrain_grass_cloud'],
        collectibles: ['coin_bronze', 'gem_blue', 'heart'],
        hazards: ['saw', 'lava_top', 'water_top'],
        
        // From character registry (detailed characters)
        mainCharacters: ['player_idle', 'player_walk1', 'player_walk2', 'player_jump', 'player_fall'],
        femaleCharacters: ['female_idle', 'female_action1', 'female_jump'],
        enemies_advanced: ['zombie_idle', 'zombie_walk1', 'zombie_action1'],
        militaryCharacters: ['soldier_idle', 'soldier_action1', 'soldier_talk']
      }
    });
    
    // Display what was loaded from where
    console.log('🎯 Game Requirements Loaded:', this.assetManager.getRegistryStats());
  }

  create() {
    // Create game world using assets from BOTH registries
    this.createBackground();
    this.createPlatforms();
    this.createPlayer();
    this.createEnemies();
    this.createCollectibles();
    this.setupUI();
  }

  createBackground() {
    // Use Phaser graphics for background (from curated registry approach)
    this.add.graphics()
      .fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98D8FF, 0x98D8FF, 1)
      .fillRect(0, 0, 800, 600);
  }

  createPlatforms() {
    // Platforms from curated registry
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(200, 500, 'terrain_grass_block');
    this.platforms.create(400, 450, 'terrain_stone_block'); 
    this.platforms.create(600, 400, 'terrain_grass_cloud');
  }

  createPlayer() {
    // Player from character registry
    this.player = this.physics.add.sprite(100, 400, 'player_idle');
    this.player.setScale(1.0);
    console.log('🎮 Player asset from:', this.assetManager.getAssetInfo('player_idle').source);

    // Create player animations
    this.anims.create({
      key: 'player_walk',
      frames: [
        { key: 'player_walk1' },
        { key: 'player_walk2' }
      ],
      frameRate: 8,
      repeat: -1
    });
  }

  createEnemies() {
    // Mix enemies from both registries
    this.enemies = this.physics.add.group();
    
    // Basic enemies from curated registry
    const snail = this.enemies.create(300, 400, 'snail_walk_a');
    const slime = this.enemies.create(500, 400, 'slime_normal_walk_a');
    
    // Advanced enemies from character registry  
    const zombie = this.enemies.create(700, 400, 'zombie_idle');
    
    console.log('👹 Enemy assets from:', 
      this.assetManager.getAssetInfo('snail_walk_a').source,
      this.assetManager.getAssetInfo('zombie_idle').source
    );
  }

  createCollectibles() {
    // Collectibles from curated registry
    this.collectibles = this.physics.add.group();
    this.collectibles.create(250, 450, 'coin_bronze');
    this.collectibles.create(450, 400, 'gem_blue');
    this.collectibles.create(650, 350, 'heart');
  }

  setupUI() {
    // UI elements from curated registry
    this.add.text(10, 10, 'Multi-Registry Platformer Demo', {
      fontSize: '16px',
      fill: '#000'
    });
    
    this.add.text(10, 30, `Assets loaded from ${this.assetManager.registries.size} registries`, {
      fontSize: '12px',
      fill: '#666'
    });
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MultiRegistryAssetManager, loadMultiRegistryAssets };
}