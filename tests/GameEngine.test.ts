import { GameEngine } from '../src/game/GameEngine';
import { GameState } from '../src/services/StateService';

describe('GameEngine', () => {
  let engine: GameEngine;
  let baseState: GameState;

  beforeEach(() => {
    engine = new GameEngine();
    baseState = {
      petName: 'TestPet',
      hp: 100,
      maxHp: 100,
      xp: 0,
      mood: 'excited',
      moodScore: 5,
      level: 1,
      lastFed: new Date().toISOString().replace('T', ' ').split('.')[0],
      streak: 0
    };
  });

  test('should decay HP and Mood over time', () => {
    // Simulate 2 days passed
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    // lastFed is 48h ago. 
    // Logic: (now - lastFed) / 24h = 2 cycles.
    baseState.lastFed = twoDaysAgo.toISOString().replace('T', ' ').split('.')[0];

    const next = engine.calculateNextState(baseState, { commits: 0, prsMerged: 0, issuesClosed: 0, streak: 0 });

    // HP Decay: 10 * 2 = 20
    expect(next.hp).toBe(80);
    // Mood Decay: 5 - 2 = 3 (neutral)
    expect(next.moodScore).toBe(3);
    expect(next.mood).toBe('neutral');
  });

  test('should recover HP on commits', () => {
    baseState.hp = 50;
    const next = engine.calculateNextState(baseState, { commits: 1, prsMerged: 0, issuesClosed: 0, streak: 1 });
    // 50 + 20 = 70
    expect(next.hp).toBe(70);
  });

  test('should gain XP on PRs', () => {
    const next = engine.calculateNextState(baseState, { commits: 0, prsMerged: 1, issuesClosed: 0, streak: 0 });
    // 0 + 50 = 50
    expect(next.xp).toBe(50);
  });

  test('should apply steak multiplier to XP', () => {
    baseState.streak = 3;
    const next = engine.calculateNextState(baseState, { commits: 0, prsMerged: 1, issuesClosed: 0, streak: 3 });
    // 50 * 1.5 = 75
    expect(next.xp).toBe(75);
  });

  test('should gain XP on Commits', () => {
    // 2 Commits * 5 XP = 10 XP
    const next = engine.calculateNextState(baseState, { commits: 2, prsMerged: 0, issuesClosed: 0, streak: 0 });
    expect(next.xp).toBe(10);
  });

  test('should recover Mood on issues closed', () => {
    baseState.moodScore = 2; // Sad
    const next = engine.calculateNextState(baseState, { commits: 0, prsMerged: 0, issuesClosed: 2, streak: 0 });
    // 2 + 2 = 4 (Happy)
    expect(next.moodScore).toBe(4);
    expect(next.mood).toBe('happy');
  });

  test('should evolve based on XP', () => {
    baseState.xp = 90;
    // 1 PR = 50 XP -> 140 XP
    const next = engine.calculateNextState(baseState, { commits: 0, prsMerged: 1, issuesClosed: 0, streak: 0 });
    expect(next.level).toBe(2); // Baby (101-500)
  });

  test('should become ghost at 0 HP', () => {
    baseState.hp = 10;
    // Simulate 2 days passed -> -20 HP -> -10 HP (capped at 0)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    baseState.lastFed = twoDaysAgo.toISOString().replace('T', ' ').split('.')[0];

    const next = engine.calculateNextState(baseState, { commits: 0, prsMerged: 0, issuesClosed: 0, streak: 0 });
    expect(next.hp).toBe(0);
    expect(next.level).toBe(5); // Ghost
  });
});
