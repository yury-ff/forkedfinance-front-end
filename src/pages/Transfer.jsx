import React, { useState } from "react";
import { ethers } from "ethers";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";

import { fetchUserBalance } from "../utils/fetchUserBalance";
import { walletAddressAtom } from "../state/wallet";
import { userBalanceAtom } from "../state/userBalance";

import Button from "../atoms/Button";
import NumberInput from "../atoms/NumberInput";
import TextInput from "../atoms/StringInput";

const Transfer = () => {
  // TODO: where is this needed?
  // const balance = useRecoilValue(transformedUserBalance);
  const setUserBalance = useSetRecoilState(userBalanceAtom);
  const walletAddress = useRecoilValue(walletAddressAtom);

  const [transferTo, settransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);

  const transferBalance = async (e) => {
    e.preventDefault();
    if (!transferAmount) {
      return;
    }
    if (!transferTo) {
      return;
    }
    try {
      const { currentAddress, signedMessage } = await signTransfer();
      const { data } = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/balances/transferBalance`,
        {
          account: currentAddress,
          // unsignedMessage: unsignedMessage,
          signedMessage: signedMessage,
          walletTo: transferTo,
          amount: transferAmount,
        }
      );
    } catch (error) {}
    const newUserBalance = fetchUserBalance(walletAddress);
    setUserBalance(newUserBalance);
  };

  const signTransfer = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const currentAddress = await provider
      .getSigner()
      .getAddress()
      .catch((e) => {
        if (e.code === 4001) {
          console.log("Rejected");
        }
      });

    const unsignedMessage = import.meta.env.VITE_SECRET_SIGN_STRING;
    const payload = ethers.utils.defaultAbiCoder.encode(
      // [import.meta.env.VITE_SECRET_SIGN_STRING],
      ["string"],
      [unsignedMessage]
    );
    const payloadHash = ethers.utils.keccak256(payload);

    const signedMessage = await signer
      .signMessage(ethers.utils.arrayify(payloadHash))
      .catch((e) => {
        if (e.code === 4001) {
          console.log("Rejected");
        }
      });

    if (!signedMessage) {
      return;
    }
    // const fullyExpandedSig = ethers.utils.splitSignature(signedMessage);

    // const signingAddress = ethers.utils.verifyMessage(
    //   ethers.utils.arrayify(payloadHash),
    //   fullyExpandedSig
    // );
    const data = { currentAddress, signedMessage };
    return data;
  };

  const validateBalanceTo = async (e) => {
    e.preventDefault();

    console.log(import.meta.env.VITE_SERVER_URL);
    if (!transferTo) {
      return;
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/balances/validateBalanceTo`,
        {
          walletTo: transferTo,
        }
      );
    } catch (error) {}
  };

  function changeAmount(e) {
    setTransferAmount(e.target.value);
  }
  function changetransferTo(e) {
    settransferTo(String(e.target.value));
  }

  return (
    <div className="mx-auto p-4">
      <div className="min-w-96">
        <div className=" p-6 shadow-2xl bg-primary">
          <div className="flex items-baseline space-x-2">
            You are transferring:
          </div>
          <NumberInput value={transferAmount} onChange={changeAmount} />
          <label htmlFor="toAddress" className="block text-gray-400 mb-2 mt-6">
            To
          </label>
          <TextInput value={transferTo} onChange={changetransferTo} />
          <div className="flex justify-between items-center mt-4">
            <Button
              type="button"
              className="cardButton"
              onClick={transferBalance}
            >
              Claim
            </Button>
            <Button type="button" onClick={validateBalanceTo}>
              Not Sure?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
