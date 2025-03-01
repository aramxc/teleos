import { ethers } from 'ethers';
import AgentMarketplaceAbi from '../../frontend/src/contracts/abis/AgentMarketplace.json';
import { AGENT_MARKETPLACE_ADDRESS } from '../../frontend/src/contracts/addresses/contracts';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from root directory
dotenv.config({ path: resolve(__dirname, '../../.env') });

const RPC_URL = "https://sepolia.base.org";
const PRIVATE_KEY = process.env.DEPLOYMENT_WALLET_PRIVATE_KEY;
if (!PRIVATE_KEY) {
    throw new Error("DEPLOYMENT_WALLET_PRIVATE_KEY not set in environment");
}
const formattedPrivateKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY : `0x${PRIVATE_KEY}`;

const OWNER_WALLET_ADDRESS = "0x8E1de3b958434dBb3a0fd53D3413A6A0c0C263F1"; // Wallet Address # 3 in chrome CB wallet


async function verifyAgentStatus(agentId: string) {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(formattedPrivateKey, provider);
        
        const contractAddress = AGENT_MARKETPLACE_ADDRESS['baseSepolia'];
        const contract = new ethers.Contract(
            contractAddress,
            AgentMarketplaceAbi,
            wallet
        );

        // Get agent details
        const agent = await contract.agents(agentId);
        console.log(`Agent ${agentId}:`);
        console.log('Is Active:', agent.isActive);
        console.log('Price:', ethers.formatUnits(agent.price, 6), 'USDC');
        console.log('Owner:', agent.owner);
        
        return { isActive: agent.isActive, price: agent.price };
    } catch (error) {
        console.error('Failed to verify agent status:', error);
        return { isActive: false, price: 0n };
    }
}

// Function to set price and activate agent
async function setAgentPriceAndActivate(agentId: string, price: number) {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(formattedPrivateKey, provider);
    const contract = new ethers.Contract(
        AGENT_MARKETPLACE_ADDRESS['baseSepolia'],
        AgentMarketplaceAbi,
        wallet
    );

    try {
        const priceInUSDC = BigInt(Math.floor(price * 1_000_000));
        const tx = await contract.registerAgent(agentId, priceInUSDC, OWNER_WALLET_ADDRESS);
        await tx.wait();
        console.log(`Successfully registered agent ${agentId}`);
    } catch (error) {
        console.error('Failed to setup agent:', error);
        const functions = Object.keys(contract.interface.format()).map(key => contract.interface.getFunction(key).name);
        console.log('Available contract functions:', functions);
    }
}

// Array of agent IDs to check
const agentIdsToCheck = [
    "3b281db5-e78f-40e7-84e5-1d9374a3fb78",
    "798daf15-e50a-41f0-b405-d5b63e44e568",
    "aaa594a9-a94e-4ece-97c7-560d3dbc83fb",
    // "fc05500c-9870-4ce7-9e70-e345fbd96e6c",
    // "4a7434eb-30af-4d3c-a788-ebf6e66a91bc",
    // "63056214-1742-4c88-a632-db24f73606d9",
    // "0e1cd976-645c-4b71-b36f-22e22612def9",
    // "470d9913-cefa-4e76-a13a-01137929d377",
    // "4945d46b-0ed1-4366-b547-0f22ffa5170d",
    // "70489676-3497-4d58-bdb6-dea95ee68d81",
    // "301639f9-a173-4baf-a74f-bff7a6a8ac59",
    // "bc1c6c51-9325-4e3d-af2e-c82788f62248",
    // "d0d8b774-4077-41f4-a6f0-0bb8b2b5b834",
    // "7e79ca91-5b4b-4ed5-9f0f-8e30e582812e",
    // "b483bf5d-7d9f-44cd-9ebd-dea5b990ed36",
    // "c3842956-66b5-4c2d-b001-85de62753aee",
    // "50064455-2224-4f4a-80be-64f164dde0cd",
    // "2a8a612c-df35-4013-b2fb-73c828658162",
    // "864a4e94-793c-462e-b918-a8107c8989b1",
    // "c019176d-6cb4-4ce5-a4f8-e208181bf82c",
    // "7d08c7d5-5292-4f36-a353-23d695d8a21d",
    // "9efa99fb-32e1-4138-abfe-8f3381027a72",
    // "b662bc95-bf1b-4b7a-91e3-4ae560483824",
    // "844782b6-f4bf-4648-b427-d7afb0af19d3",
    // "205d510d-d761-4278-9bc6-facf92de2a89",
    // "f216d6df-66e9-4b90-9524-22e01b7f837b",
    // "79733074-7528-48af-9ba6-f63ac6134607",
    // "f165a93e-fe23-4480-ac21-268da9b9a768",
    // "21ffcf6e-9780-4e74-830d-f4a4adbc549e",
    // "50f4d0a9-545f-4b07-9002-473ce33f0efd",
    // "3e34a652-35c5-4616-9434-8c0e82cb1b6b",
    // "4fe081d0-02d5-49f0-851b-5166a05696cd",
    // "67fbc325-5808-438b-9b3c-1f0384030100",
    // "e9512f4c-678d-422f-a4db-f7c10bdbaa12",
    // "c7f9578b-61fc-4562-a2e7-ba348320ed89",
    // "5f5fd37c-ea46-4caa-bf65-372440ef4203",
    // "8a59f274-244f-4e18-8cc2-5ad85f7b82cb",
    // "ce5b5333-4abc-425c-b744-2e7c8841e409",
    // "ede4b3cc-6707-4b91-b00a-6c2d68b7ee98",
    // "15676a7b-2f4a-4cca-8a92-2a6e2dfebf46",
    // "5bef23fd-56b5-482b-b6fb-20c5ff5157e6",
    // "9a30b5f6-bef0-4471-9f9e-37e6b8b0fe3d",
    // "d4277c7e-1baf-4a01-b45f-fd19545ad528",
    // "e68423e5-8abf-4d84-b860-3b1700c94257",
    // "3a2f944a-4c89-44a0-b130-684187220365",
    // "778140ce-d473-47b5-b2bc-e8a0b4ebd4f4",
    // "3cbc5801-3c2f-4a2f-9bbe-ad46edb50782",
    // "075db264-1fa0-4c62-8cfa-8c0b42e1a181",
    // "2c2971af-d3e2-4339-9022-58347da05d04",
    // "311adaab-ee21-48ed-9158-b2a367d0ae10",
    // "91a8568d-fdee-4025-9f8a-abffc6597d2b",
    // "ad599ceb-31b8-4489-8d5a-0e2b1525f307",
    // "c0a4442a-c6f1-4b86-b440-7d912c1d2765",
    // "68044b83-f2ec-4853-8ef9-35631497b27d",
    // "7aba789b-9b4a-49c8-b3b6-acd533f987dc",
    // "0ab0e66f-c20d-40f6-8a50-edd93e408ed4",
    // "b464722a-2c8c-48f2-a3dc-72190d73c08d",
    // "b2c24051-714d-4c99-84a4-f93a003dfc7c",
    // "1924b427-2fa1-464d-b954-ad8ad9fd92bd",
    // "055af630-1615-4d7f-999e-21c6270788be",
    // "2dcbc7db-e3c5-49c3-b483-878ae7879573",
    // "2c26fc43-068e-44d4-80d4-c8ba988822c3",
    // "1a068aec-63ad-449c-9f67-056b03450d09",
    // "7a6631d7-def2-4f13-965f-3013ed7321b1",
    // "06da5e84-68bb-4717-a6b2-9e1df3dde427",
    // "97e935da-003e-4a8a-b7c2-aa28cd4d7dd3",
    // "0ce9e722-9524-4752-8c62-c8ab2a20b556",
    // "d25d8261-c0d3-40c1-ad7e-8c3d63df3a2e",
    // "6b679b9e-e5e0-49a8-a73e-ef589e93fa0a",
    // "045cba2a-e127-4e12-afa1-00c7ce4588cf",
    // "a13c0b8f-8637-4005-934f-a26fab5f58f5",
    // "d412aadd-fe47-4d1b-9210-65fa375523df",
    // "36253033-7a8d-40fc-a0ce-4e0e0b90949f",
    // "ab948836-87fb-4c8b-84c9-74f2c87eaaa2",
    // "6641c4ee-9b21-4931-8149-6e5c687875c0",
    // "4f1efcd8-8491-4853-a2e3-9ec2c7d5ed97",
    // "0e0ce062-329b-4683-a3c2-c9d0c6f5aa9b",
    // "6a784534-bd0d-4b6c-b7c9-8a66c46b9659",
    // "6a39c839-ae3d-48c8-a99a-156f69a7f4da",
    // "8654e658-e52d-4628-85d0-732bbb40efc5",
    // "dd413d0e-bb79-4f8f-b43f-d0d4fcfc3365",
    // "f81d494c-5d62-4830-b141-47d534b1104a",
    // "f2fb8dcd-6d39-400d-8eaa-172927ea83d2",
    // "c166a99d-4f69-4541-bf56-44e8e4bc013b",
    // "ac3012bd-13e6-496f-87d2-a9970434da63",
    // "e2e1c60a-fa68-4798-a1b0-77c26128921e",
    // "949c4abc-f981-4af1-a588-9df15e75c3c6",
    // "e2cb89e4-665d-4130-86fe-e5ccb5f7536f",
    // "bd941998-f95d-48c9-a8a9-55fb794bdb30",
    // "014ff728-6423-44e2-83e0-e98cae261dbe",
    // "c27ca703-bfef-4e59-883d-0b41cdfd6924",
    // "73531ac6-493f-4698-8c3d-3def439dad4b",
    // "a72c271c-e043-406c-b3dc-3c14b5752f4f",
    // "24bd3e15-647d-4792-99e8-99f6d6876d6a",
    // "8a3a81ef-1cc5-4be2-8e68-d88f01b43d35",
    // "873d3999-95e3-4576-9db2-a21e9a0bf200",
    // "abd0cba7-9985-4857-bcf5-8e3a0d5b29f0",
    // "480acec0-7eab-4aaf-a655-4ddea08d362f",
    // "ce737536-944c-47f7-bdab-3357e08f1fcb",
    // "d912b6b7-3e7e-4b60-8bc4-8ad9f3aad637"
];

// Check status
let currentIndex = 0;

async function checkNextAgent() {
    if (currentIndex >= agentIdsToCheck.length) {
        console.log('Finished checking all agents!');
        return;
    }

    const agentId = agentIdsToCheck[currentIndex];
    console.log(`Checking agent ${currentIndex + 1} of ${agentIdsToCheck.length}: ${agentId}`);
    
    const { isActive, price } = await verifyAgentStatus(agentId);
    
    // If not active or price is 0, set new price and activate
    if (!isActive || price === 0n) {
        console.log('Agent needs update, setting price and activating...');
        await setAgentPriceAndActivate(agentId, 0.01);
    }

    currentIndex++;
    await checkNextAgent();
}

// Start checking agents
checkNextAgent().catch(console.error);