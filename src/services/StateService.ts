import * as core from '@actions/core';
import * as fs from 'fs';

export interface GameState {
  petName: string;
  hp: number;
  maxHp: number;
  xp: number;
  mood: string;
  moodScore: number;
  level: number;
  lastFed: string; // YYYY-MM-DD HH:mm:ss (UTC)
  streak: number;
}

const STATE_FILE = 'gitgotchi.json';

import * as path from 'path';

export class StateService {
  async loadState(petName: string, assetsDir: string): Promise<GameState> {
    const initialState: GameState = {
      petName: petName,
      hp: 100,
      maxHp: 100,
      xp: 0,
      mood: 'happy',
      moodScore: 5,
      level: 1,
      lastFed: new Date().toISOString().replace('T', ' ').split('.')[0],
      streak: 0
    };

    const statePath = path.join(assetsDir, STATE_FILE);

    try {
      if (fs.existsSync(statePath)) {
        console.log(`Loading state from ${statePath}`);
        const content = fs.readFileSync(statePath, 'utf8');
        const loadedState = JSON.parse(content) as GameState;
        
        return loadedState;
      } else {
          console.log(`State file ${statePath} not found. Starting fresh.`);
      }
    } catch (error) {
      core.warning(`Could not load existing state, using initial state. Error: ${error}`);
    }

    return initialState;
  }

  async saveState(state: GameState, svgContent: string, assetsDir: string): Promise<string> {
    try {
        if (!fs.existsSync(assetsDir)) {
          fs.mkdirSync(assetsDir, { recursive: true });
        }
        
        // 1. Clean up old SVGs to prevent bloat
        // Filter for gitgotchi-*.svg
        const files = fs.readdirSync(assetsDir);
        for (const file of files) {
            if (file.startsWith('gitgotchi-') && file.endsWith('.svg')) {
                const filePath = path.join(assetsDir, file);
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Deleted old artifact: ${file}`);
                } catch (err) {
                    console.warn(`Failed to delete ${file}: ${err}`);
                }
            }
        }

        // 2. Generate new unique filename
        const timestamp = new Date().getTime();
        const svgFilename = `gitgotchi-${timestamp}.svg`;
        
        const statePath = path.join(assetsDir, STATE_FILE);
        const svgPath = path.join(assetsDir, svgFilename);

        const jsonContent = JSON.stringify(state, null, 2);
        fs.writeFileSync(statePath, jsonContent);
        fs.writeFileSync(svgPath, svgContent);
        console.log(`Saved state to ${statePath} and image to ${svgPath}`);
        
        return svgFilename;
    } catch (error) {
        core.error(`Failed to save state: ${error}`);
        throw error;
    }
  }
}
