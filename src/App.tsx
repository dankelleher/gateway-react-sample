import React from 'react';
import logo from './logo.png';
import './App.css';
import {GatewayProvider, RequestStatus, useGateway} from "./GatewayContext";
import {useWallet, WalletProvider} from "./wallet";

function GatewayStatus() {
  const { requestStatus, requestGatewayToken, gatewayToken } = useGateway();
  const { select, wallet } = useWallet()

  return <div>
    { wallet && <h4>Wallet: {wallet.publicKey.toBase58()}</h4>}
    <h3>Request Status: { RequestStatus[requestStatus] }</h3>
    { gatewayToken && <h4>GatewayToken: {gatewayToken.publicKey.toBase58()}</h4>}
    <button onClick={select}>Connect Wallet</button>
    <button onClick={requestGatewayToken}>Start</button>
  </div>;
}

const WrappedGatewayProvider:  React.FC = ({children}) => {
  const { wallet } = useWallet();

  return (
    <GatewayProvider walletAddress={wallet?.publicKey}>
      {children}
    </GatewayProvider>);
}

function App() {
  return (
    <WalletProvider>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <WrappedGatewayProvider>
            <GatewayStatus/>
          </WrappedGatewayProvider>
        </header>
      </div>
    </WalletProvider>
  );
}

export default App;
