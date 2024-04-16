import React from "react";
import { useRecoilValue } from "recoil";
import { walletState } from "../state/wallet";


const Merchants = () => {
	const wallet = useRecoilValue(walletState);



	return (
		<div className="max-w-md mx-auto my-10 p-6">
			<div className="mb-4">
				<h1 className="text-lg font-semibold">Comming Soon!</h1>
			</div>
		
		</div>
	);
};

export default Merchants;