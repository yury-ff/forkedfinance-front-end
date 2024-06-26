import { ethers } from "ethers";

import usdcABI from "../assets/USDCABI.json";
import { usdcAddr } from "../costant/prod-costant";

export function getUsdcContract(signer) {
  const usdcContract = new ethers.Contract(usdcAddr, usdcABI, signer);

  return usdcContract;
}
