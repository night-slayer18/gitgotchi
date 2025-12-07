import * as core from '@actions/core';
import * as fs from 'fs';
import * as github from '@actions/github';
import { StateService } from './services/StateService';
import { GitHubService } from './services/GitHubService';
import { GameEngine } from './game/GameEngine';
import { SvgGenerator } from './renderer/SvgGenerator';

async function run(): Promise<void> {
  try {
    const token = core.getInput('token');
    const petName = core.getInput('pet_name') || 'GitGotchi';
    const templateFile = core.getInput('template_file') || 'TEMPLATE.md';
    const outFile = core.getInput('out_file') || 'README.md';
    const assetsDir = core.getInput('assets_dir') || '.github/gitgotchi';
    const username = github.context.actor;

    const stateService = new StateService();
    const currentState = await stateService.loadState(petName, assetsDir);

    const githubService = new GitHubService(token);
    // Fetch contributions since last fed time
    const lastFedDate = new Date(currentState.lastFed);
    const contributions = await githubService.getContributionStats(username, lastFedDate);

    const gameEngine = new GameEngine();
    const nextState = gameEngine.calculateNextState(currentState, contributions);
    nextState.petName = petName; 

    core.info(`New State: HP=${nextState.hp}, XP=${nextState.xp}, Streak=${nextState.streak}`);

    const svgGenerator = new SvgGenerator();
    const svgContent = svgGenerator.render(nextState);

    await stateService.saveState(nextState, svgContent, assetsDir);

    if (fs.existsSync(templateFile)) {
        console.log(`Processing template ${templateFile}...`);
        let templateContent = fs.readFileSync(templateFile, 'utf8');
        
        // Construct relative path for the image link. 
        // Assuming outFile is in root and assetsDir is relative to root.
        const imagePath = `${assetsDir}/gitgotchi.svg`;
        const imageTag = `![GitGotchi](${imagePath})`;
        
        // Replace placeholder
        templateContent = templateContent.replace('{{ gitgotchi }}', imageTag);
        templateContent = templateContent.replace('<!-- gitgotchi -->', imageTag);
        
        fs.writeFileSync(outFile, templateContent);
        console.log(`Updated ${outFile} from ${templateFile}`);
    } else {
        console.log(`Template file ${templateFile} not found. Skipping template build.`);
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
    else core.setFailed(String(error));
  }
}

run();
