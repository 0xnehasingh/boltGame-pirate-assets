/**
 * Character Animation Helper
 * Advanced character creation and animation using character-assets-extended.json
 * Supports Player, Female, Zombie, and Soldier characters with full animation sets
 */

class CharacterAnimationManager {
  constructor(scene) {
    this.scene = scene;
    this.characters = new Map();
    this.characterAssets = null;
  }

  // Load character assets registry
  async loadCharacterAssets() {
    try {
      const response = await fetch('./assets/character-assets-extended.json');
      this.characterAssets = await response.json();
      console.log('✅ Character assets loaded:', this.characterAssets.usage.assetCount);
      return this.characterAssets;
    } catch (error) {
      console.error('❌ Failed to load character assets:', error);
      throw error;
    }
  }

  // Load all character sprites for a specific character type
  async loadCharacterSprites(characterType) {
    if (!this.characterAssets) {
      await this.loadCharacterAssets();
    }

    const categoryName = `${characterType}_characters`;
    const category = this.characterAssets.categories[categoryName];
    
    if (!category) {
      throw new Error(`Character type '${characterType}' not found`);
    }

    console.log(`📦 Loading ${category.count} sprites for ${characterType} character...`);
    
    // Load all assets for this character type
    category.assets.forEach(asset => {
      this.scene.load.image(asset.id, asset.url);
    });

    return new Promise((resolve) => {
      this.scene.load.once('complete', () => {
        console.log(`✅ ${characterType} character sprites loaded!`);
        resolve(category);
      });
      this.scene.load.start();
    });
  }

  // Create a fully animated character
  createAnimatedCharacter(x, y, characterType, config = {}) {
    const characterId = `${characterType}_${Date.now()}`;
    
    // Create the sprite with idle pose
    const sprite = this.scene.physics.add.sprite(x, y, `${characterType}_idle`);
    sprite.setScale(config.scale || 1.0);
    
    // Setup character properties
    const character = {
      id: characterId,
      type: characterType,
      sprite: sprite,
      animations: {},
      currentAnimation: null,
      config: {
        speed: config.speed || 100,
        jumpPower: config.jumpPower || 300,
        health: config.health || 100,
        ...config
      }
    };

    // Create all animations for this character
    this.createCharacterAnimations(characterType, character);
    
    // Store character reference
    this.characters.set(characterId, character);
    
    console.log(`🎮 Created ${characterType} character:`, characterId);
    return character;
  }

  // Create comprehensive animation set for a character
  createCharacterAnimations(characterType, character) {
    const animationSets = this.characterAssets.usage.animationSets;
    
    // Basic Movement Animations
    this.scene.anims.create({
      key: `${characterType}_walk`,
      frames: [
        { key: `${characterType}_walk1` },
        { key: `${characterType}_walk2` }
      ],
      frameRate: 8,
      repeat: -1
    });

    this.scene.anims.create({
      key: `${characterType}_idle`,
      frames: [{ key: `${characterType}_idle` }],
      frameRate: 1
    });

    this.scene.anims.create({
      key: `${characterType}_jump`,
      frames: [{ key: `${characterType}_jump` }],
      frameRate: 1
    });

    this.scene.anims.create({
      key: `${characterType}_fall`,
      frames: [{ key: `${characterType}_fall` }],
      frameRate: 1
    });

    // Combat Animations
    this.scene.anims.create({
      key: `${characterType}_attack`,
      frames: [
        { key: `${characterType}_action1` },
        { key: `${characterType}_action2` }
      ],
      frameRate: 12,
      repeat: 0
    });

    this.scene.anims.create({
      key: `${characterType}_kick`,
      frames: [{ key: `${characterType}_kick` }],
      frameRate: 1
    });

    this.scene.anims.create({
      key: `${characterType}_hurt`,
      frames: [{ key: `${characterType}_hurt` }],
      frameRate: 1
    });

    // Environmental Animations
    this.scene.anims.create({
      key: `${characterType}_climb`,
      frames: [
        { key: `${characterType}_climb1` },
        { key: `${characterType}_climb2` }
      ],
      frameRate: 6,
      repeat: -1
    });

    this.scene.anims.create({
      key: `${characterType}_swim`,
      frames: [
        { key: `${characterType}_swim1` },
        { key: `${characterType}_swim2` }
      ],
      frameRate: 6,
      repeat: -1
    });

    // Interaction Animations
    this.scene.anims.create({
      key: `${characterType}_cheer`,
      frames: [
        { key: `${characterType}_cheer1` },
        { key: `${characterType}_cheer2` }
      ],
      frameRate: 4,
      repeat: 2
    });

    this.scene.anims.create({
      key: `${characterType}_talk`,
      frames: [{ key: `${characterType}_talk` }],
      frameRate: 1
    });

    // Utility animations
    this.scene.anims.create({
      key: `${characterType}_duck`,
      frames: [{ key: `${characterType}_duck` }],
      frameRate: 1
    });

    console.log(`🎭 Created animation set for ${characterType}`);
  }

  // Character behavior methods
  playAnimation(characterId, animationName) {
    const character = this.characters.get(characterId);
    if (character) {
      const fullAnimName = `${character.type}_${animationName}`;
      character.sprite.play(fullAnimName);
      character.currentAnimation = animationName;
    }
  }

  moveCharacter(characterId, direction) {
    const character = this.characters.get(characterId);
    if (!character) return;

    const sprite = character.sprite;
    const speed = character.config.speed;

    switch(direction) {
      case 'left':
        sprite.setVelocityX(-speed);
        sprite.setFlipX(true);
        this.playAnimation(characterId, 'walk');
        break;
      case 'right':
        sprite.setVelocityX(speed);
        sprite.setFlipX(false);
        this.playAnimation(characterId, 'walk');
        break;
      case 'stop':
        sprite.setVelocityX(0);
        this.playAnimation(characterId, 'idle');
        break;
      case 'jump':
        if (sprite.body.touching.down) {
          sprite.setVelocityY(-character.config.jumpPower);
          this.playAnimation(characterId, 'jump');
        }
        break;
    }
  }

  // Character action methods
  performAction(characterId, actionType) {
    const character = this.characters.get(characterId);
    if (!character) return;

    switch(actionType) {
      case 'attack':
        this.playAnimation(characterId, 'attack');
        break;
      case 'kick':
        this.playAnimation(characterId, 'kick');
        break;
      case 'duck':
        this.playAnimation(characterId, 'duck');
        break;
      case 'talk':
        this.playAnimation(characterId, 'talk');
        break;
      case 'cheer':
        this.playAnimation(characterId, 'cheer');
        break;
      case 'climb':
        this.playAnimation(characterId, 'climb');
        break;
      case 'swim':
        this.playAnimation(characterId, 'swim');
        break;
    }
  }

  // Get character info
  getCharacter(characterId) {
    return this.characters.get(characterId);
  }

  getAllCharacters() {
    return Array.from(this.characters.values());
  }

  // Character state management
  updateCharacterStates() {
    this.characters.forEach(character => {
      const sprite = character.sprite;
      
      // Auto-switch to fall animation when in air
      if (!sprite.body.touching.down && character.currentAnimation !== 'jump') {
        this.playAnimation(character.id, 'fall');
      }
      
      // Auto-switch to idle when stopped
      if (sprite.body.velocity.x === 0 && sprite.body.touching.down && 
          character.currentAnimation === 'walk') {
        this.playAnimation(character.id, 'idle');
      }
    });
  }
}

// Character factory functions for easy creation
class CharacterFactory {
  static async createPlayer(scene, x, y, config = {}) {
    const manager = new CharacterAnimationManager(scene);
    await manager.loadCharacterSprites('player');
    return manager.createAnimatedCharacter(x, y, 'player', {
      speed: 120,
      jumpPower: 350,
      health: 100,
      ...config
    });
  }

  static async createFemale(scene, x, y, config = {}) {
    const manager = new CharacterAnimationManager(scene);
    await manager.loadCharacterSprites('female');
    return manager.createAnimatedCharacter(x, y, 'female', {
      speed: 110,
      jumpPower: 320,
      health: 90,
      ...config
    });
  }

  static async createZombie(scene, x, y, config = {}) {
    const manager = new CharacterAnimationManager(scene);
    await manager.loadCharacterSprites('zombie');
    return manager.createAnimatedCharacter(x, y, 'zombie', {
      speed: 60,
      jumpPower: 200,
      health: 150,
      ...config
    });
  }

  static async createSoldier(scene, x, y, config = {}) {
    const manager = new CharacterAnimationManager(scene);
    await manager.loadCharacterSprites('soldier');
    return manager.createAnimatedCharacter(x, y, 'soldier', {
      speed: 100,
      jumpPower: 280,
      health: 120,
      ...config
    });
  }
}

// Example usage in a Phaser scene
class CharacterDemoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterDemoScene' });
  }

  async preload() {
    // Characters will be loaded automatically by CharacterFactory
  }

  async create() {
    // Create different character types
    this.player = await CharacterFactory.createPlayer(this, 100, 400);
    this.female = await CharacterFactory.createFemale(this, 200, 400);
    this.zombie = await CharacterFactory.createZombie(this, 300, 400);
    this.soldier = await CharacterFactory.createSoldier(this, 400, 400);

    // Setup character manager for updates
    this.characterManager = this.player.manager || new CharacterAnimationManager(this);

    // Setup input controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D,SPACE,X,C');

    // Create platforms for characters to walk on
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(250, 500, 'terrain_grass_block'); // You'd need to load this separately

    // Setup physics collisions
    this.physics.add.collider(this.player.sprite, this.platforms);
    this.physics.add.collider(this.female.sprite, this.platforms);
    this.physics.add.collider(this.zombie.sprite, this.platforms);
    this.physics.add.collider(this.soldier.sprite, this.platforms);
  }

  update() {
    // Update character states
    if (this.characterManager) {
      this.characterManager.updateCharacterStates();
    }

    // Player controls
    if (this.cursors.left.isDown) {
      this.characterManager.moveCharacter(this.player.id, 'left');
    } else if (this.cursors.right.isDown) {
      this.characterManager.moveCharacter(this.player.id, 'right');
    } else {
      this.characterManager.moveCharacter(this.player.id, 'stop');
    }

    if (this.cursors.up.isDown) {
      this.characterManager.moveCharacter(this.player.id, 'jump');
    }

    // Action controls
    if (Phaser.Input.Keyboard.JustDown(this.wasd.X)) {
      this.characterManager.performAction(this.player.id, 'attack');
    }

    if (Phaser.Input.Keyboard.JustDown(this.wasd.C)) {
      this.characterManager.performAction(this.player.id, 'kick');
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CharacterAnimationManager, CharacterFactory };
}