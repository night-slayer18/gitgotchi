"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const github = __importStar(require("@actions/github"));
const StateService_1 = require("./services/StateService");
const GitHubService_1 = require("./services/GitHubService");
const GameEngine_1 = require("./game/GameEngine");
const SvgGenerator_1 = require("./renderer/SvgGenerator");
async function run() {
    try {
        const token = core.getInput('token');
        const petName = core.getInput('pet_name') || 'GitGotchi';
        const templateFile = core.getInput('template_file') || 'TEMPLATE.md';
        const outFile = core.getInput('out_file') || 'README.md';
        const assetsDir = core.getInput('assets_dir') || '.github/gitgotchi';
        const username = github.context.actor;
        const stateService = new StateService_1.StateService();
        const currentState = await stateService.loadState(petName, assetsDir);
        const githubService = new GitHubService_1.GitHubService(token);
        // Fetch contributions since last fed time
        const lastFedDate = new Date(currentState.lastFed);
        const contributions = await githubService.getContributionStats(username, lastFedDate);
        const gameEngine = new GameEngine_1.GameEngine();
        const nextState = gameEngine.calculateNextState(currentState, contributions);
        nextState.petName = petName;
        core.info(`New State: HP=${nextState.hp}, XP=${nextState.xp}, Streak=${nextState.streak}`);
        const svgGenerator = new SvgGenerator_1.SvgGenerator();
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
        }
        else {
            console.log(`Template file ${templateFile} not found. Skipping template build.`);
        }
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
        else
            core.setFailed(String(error));
    }
}
run();
