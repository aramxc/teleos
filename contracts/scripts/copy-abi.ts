import fs from 'fs';
import path from 'path';

// Adjust paths to point from contracts directory to frontend
const sourceDir = path.join(__dirname, '../artifacts/contracts');
const targetAbiDir = path.join(__dirname, '../../frontend/src/contracts/abis');

// Ensure target directory exists
fs.mkdirSync(targetAbiDir, { recursive: true });

// Copy ABI
const abiPath = path.join(sourceDir, 'AgentMarketplace.sol/AgentMarketplace.json');
if (!fs.existsSync(abiPath)) {
    console.error('❌ Source ABI not found at:', abiPath);
    process.exit(1);
}

const contractData = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

// Write ABI to frontend
const targetPath = path.join(targetAbiDir, 'AgentMarketplace.json');
fs.writeFileSync(
    targetPath,
    JSON.stringify(contractData.abi, null, 2)
);

console.log('✅ ABI copied successfully to:', targetPath);