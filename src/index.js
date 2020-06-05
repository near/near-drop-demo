import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import getConfig from './config.js';
import { getCurrentUser } from './util/near-util';
import * as nearApi from 'near-api-js';

// Initializing contract
async function initContract() {
    window.nearConfig = getConfig(process.env.NODE_ENV || 'development')
    console.log("nearConfig", window.nearConfig);

    window.keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:')
    console.log(window.keyStore)
    // console.log(window.keyStore)
    window.near = await nearApi.connect(Object.assign({ deps: { keyStore: window.keyStore } }, window.nearConfig));

    window.contractAccount = new nearApi.Account(window.near.connection, window.nearConfig.contractName)

    window.getCurrentUser = async () => {
      // Needed to access wallet
      window.walletConnection = new nearApi.WalletConnection(window.near)
      window.walletAccount = new nearApi.WalletAccount(window.near)
      if (walletConnection.getAccountId()) {
        const accountId = walletConnection.getAccountId()
        window.currentUser = {
          accountId, account_id: accountId,
          balance: (await walletConnection.account().state()).amount
        }
      }
    }
    await window.getCurrentUser()

    if (window.currentUser) {
      const account = window.account = window.walletConnection.account()
      window.contract = await new nearApi.Contract(account, window.nearConfig.contractName, {
          // Change methods can modify the state. But you don't receive the returned value when called.
          changeMethods: ['send', 'send_limited'],
          // Sender is the account ID to initialize transactions.
          sender: window.currentUser.accountId
      });
      // console.log(contract)
    }
}

window.nearInitPromise = initContract().then(() => {
  ReactDOM.render(<App
      contract={window.contract}
      wallet={window.walletAccount} 
    />,
    document.getElementById('root')
  );
}).catch(console.error)