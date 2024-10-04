const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // const encryptedJson = fs.readFileSync("./encryptedKey.json", "utf-8");

  // let wallet;
  // wallet = await ethers.Wallet.fromEncryptedJson(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD,
  // );
  // wallet = wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8",
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, Please wait ....");

  try {
    const contract = await contractFactory.deploy();
    await contract.deploymentTransaction().wait(1);
    const address = await contract.getAddress();
    console.log(contract);
    console.log(`Contract Address: ${address}`);

    // const currentFavoriteNumber = await contract.retrieve();
    // console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);

    // const transactionResponse = await contract.store("7");
    // // const transactionReceipt = await transactionResponse.wait(1);
    // const updateFavoriteNumber = await contract.retrieve();
    // console.log(`Updated Favorite Number: ${updateFavoriteNumber}`);
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
