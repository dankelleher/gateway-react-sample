import {GatewayToken, State} from "@identity.com/solana-gateway-ts";
import {Keypair, PublicKey} from "@solana/web3.js";
import React, {useCallback, useContext, useEffect, useState} from "react";

export enum RequestStatus {
  NOT_REQUESTED,
  IN_PROGRESS,
  SUCCESS,
  FAILED
}

type GatewayProps = {
  setWalletAddress: (walletAddress: PublicKey) => void,
  requestGatewayToken: () => Promise<void>,
  gatewayToken?: GatewayToken,
  requestStatus: RequestStatus
}

const GatewayContext = React.createContext<GatewayProps>({
  setWalletAddress: async () => {},
  requestGatewayToken: async () => {},
  requestStatus: RequestStatus.NOT_REQUESTED
});

const pubkey = () => Keypair.generate().publicKey;

type GatewayProviderProps = {
  walletAddress?: PublicKey
}
export const GatewayProvider: React.FC<GatewayProviderProps> = ({ children = null, walletAddress }) => {
  const requestGatewayToken = async () => {
    if (!walletAddressState) throw new Error("No WalletAddress");

    setRequestStatus(RequestStatus.IN_PROGRESS)
    setTimeout(() => {
      setRequestStatus(RequestStatus.SUCCESS);
      setGatewayToken(new GatewayToken(
        pubkey(),
        pubkey(),
        walletAddressState,
        State.ACTIVE,
        pubkey(),
        pubkey(),
        100000
      ))
    }, 5000)
  }
  const [ requestStatus, setRequestStatus ] = useState<RequestStatus>(RequestStatus.NOT_REQUESTED)
  const [ gatewayToken, setGatewayToken ] = useState<GatewayToken>()
  const [ walletAddressState, setWalletAddressState ] = useState<PublicKey>()

  const updateWalletAddress = useCallback((newWalletAddress: PublicKey) => {
    setGatewayToken(undefined);
    setRequestStatus(RequestStatus.NOT_REQUESTED);
    setWalletAddressState(newWalletAddress)
  }, [setWalletAddressState, setGatewayToken, setRequestStatus]);

  useEffect(() => walletAddress && updateWalletAddress(walletAddress), [walletAddress, updateWalletAddress]);

  return (
    <GatewayContext.Provider value={{
      setWalletAddress: updateWalletAddress,
      requestGatewayToken,
      requestStatus,
      gatewayToken
    }}>
      {children}
    </GatewayContext.Provider>
  );
}

export const useGateway = (): GatewayProps => useContext(GatewayContext);
