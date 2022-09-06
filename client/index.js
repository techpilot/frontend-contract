import { ethers } from "./ethers-5.2.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please install metamask!";
  }
}

async function fund() {
  if (window.ethereum !== "undefined") {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount}...`);
    // provider/connection to the blockchain
    // signer / wallet / gas

    // contract / ABI / Address

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // returns connected wallet
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      await listenToTransactionMine(transactResponse, provider);
      console.log("Done...");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenToTransactionMine(transactResponse, provider) {
  console.log(`Mining ${transactResponse?.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt?.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function getBalance() {
  if (window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw() {
  if (window.ethereum !== "undefined") {
    console.log("Withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // returns connected wallet
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactResponse = await contract.withdraw();
      await listenToTransactionMine(transactResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
