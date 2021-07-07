import React, {useCallback, useContext, useState,} from 'react';
import {Keypair} from "@solana/web3.js";

type WalletContextProps = {
  wallet?: Keypair,
  select: () => void
}

const WalletContext = React.createContext<WalletContextProps>({
  select: () => {}
});

export const WalletProvider: React.FC = ({ children = null }) => {
  let [wallet, setWallet] = useState<Keypair>();

  const select = useCallback(() => setWallet(Keypair.generate()), []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        select,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
