import { GameState } from '../services/StateService';
import { ContributionStats } from '../services/GitHubService';

export class GameEngine {
  calculateNextState(current: GameState, contributions: ContributionStats): GameState {
    const now = new Date();
    const lastFed = new Date(current.lastFed);
    const next = { ...current };

    // Initialize moodScore if missing (for backward compatibility or new field)
    if (next.moodScore === undefined) next.moodScore = 5;

    // 1. Decay (Based on time passed)
    const hoursElapsed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
    const decayCycles = Math.floor(hoursElapsed / 24);

    if (decayCycles > 0) {
      next.hp = Math.max(0, next.hp - (10 * decayCycles));
      
      // Mood decay: -1 "Happy" Level per day
      next.moodScore = Math.max(1, next.moodScore - decayCycles);
    }

    // 2. Recovery / Feeding
    const totalContributions = contributions.commits + contributions.prsMerged + contributions.issuesClosed;

    if (totalContributions > 0) {
      // HP Recovery: +20 HP per Commit
      const hpGain = contributions.commits * 20;
      next.hp = Math.min(next.maxHp, next.hp + hpGain);

      // Streak Logic: Sync with Real GitHub Streak
      next.streak = contributions.streak;

      // XP Gain: +50 XP per PR merge
      // STRICT SCORING: Commits give HP, PRs give XP.
      let rawXp = (contributions.prsMerged * 50); 
      
      if (next.streak >= 3) {
          rawXp = Math.floor(rawXp * 1.5);
      }
      next.xp += rawXp;

      // Mood Recovery: +1 per Issue Closed
      next.moodScore = Math.min(5, next.moodScore + contributions.issuesClosed);
    }

    // 3. Evolution
    if (next.xp < 100) next.level = 1; // Egg
    else if (next.xp < 500) next.level = 2; // Baby
    else if (next.xp < 2000) next.level = 3; // Teen
    else next.level = 4; // Adult

    // Ghost Check
    if (next.hp <= 0) {
        next.hp = 0;
        next.level = 5; // Ghost
    }

    // 4. Update Mood String based on moodScore
    switch (next.moodScore) {
        case 5: next.mood = 'excited'; break;
        case 4: next.mood = 'happy'; break;
        case 3: next.mood = 'neutral'; break;
        case 2: next.mood = 'sad'; break;
        default: next.mood = 'angry'; break;
    }

    next.lastFed = now.toISOString();

    return next;
  }
}
