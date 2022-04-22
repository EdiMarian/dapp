import * as React from 'react';
import { transactionServices } from '@elrondnetwork/dapp-core';

const TxTracking = () => {
  const PendingTx = transactionServices.useGetPendingTransactions();
  const FailedTx = transactionServices.useGetFailedTransactions();
  const SuccessfulTx = transactionServices.useGetSuccessfulTransactions();
  const CompletedTx = transactionServices.useGetCompletedTransactions(); // ==> CompletedTx is for success tx with SmartContract calls

  React.useEffect(() => {
    if (PendingTx.pendingTransactionsArray.length > 0) {
      CheckPending();
    }
  }, [PendingTx.pendingTransactionsArray.length]);

  React.useEffect(() => {
    if (FailedTx.failedTransactionsArray.length > 0) {
      CheckFailed();
    }
  }, [FailedTx.failedTransactionsArray.length]);

  React.useEffect(() => {
    if (SuccessfulTx.successfulTransactionsArray.length > 0) {
      CheckSuccessful();
    }
  }, [SuccessfulTx.successfulTransactionsArray.length]);

  React.useEffect(() => {
    if (CompletedTx.completedTransactionsArray.length > 0) {
      CheckCompletedTx();
    }
  }, [CompletedTx.completedTransactionsArray.length]);

  function CheckPending() {
    //     console.log('>>>>> PendingTx : ', PendingTx);
    const PendingTxArray = PendingTx.pendingTransactionsArray;
    for (let i = 0; i < PendingTxArray.length; i++) {
      const transactionSessionId = PendingTxArray[i][0];
      const transaction = PendingTxArray[i][1].transactions[0]; // ==> transactions[0] because we create only 1 tx by transactionSessionId

      // console.log(
      //   '>>> PendingTxArray[' + i + '] : ' + transactionSessionId + ' : ',
      //   transaction
      // );

      //// TODO : create the tx in the database if the tx don't exist
    }
  }

  function CheckFailed() {
    //     console.log('>>>>> FailedTx : ', FailedTx);
    const FailedTxArray = FailedTx.failedTransactionsArray;
    for (let i = 0; i < FailedTxArray.length; i++) {
      const transactionSessionId = FailedTxArray[i][0];
      const transaction = FailedTxArray[i][1].transactions[0]; // ==> transactions[0] because we create only 1 tx by transactionSessionId

      // console.log(
      //   '>>> FailedTxArray[' + i + '] : ' + transactionSessionId + ' : ',
      //   transaction
      // );

      //// TODO : update the status of the tx in the database

      //// Remove the tx with the corresponding transactionSessionId from failedTransactionsArray
      //// ==> by doing so, the toast with a failed status will not be shown
      //transactionServices.removeSignedTransaction(transactionSessionId);
    }
  }

  function CheckSuccessful() {
    //     console.log('>>>>> SuccessfulTx : ', SuccessfulTx);
    const SuccessfulTxArray = SuccessfulTx.successfulTransactionsArray;
    for (let i = 0; i < SuccessfulTxArray.length; i++) {
      const transactionSessionId = SuccessfulTxArray[i][0];
      const transaction = SuccessfulTxArray[i][1].transactions[0]; // ==> transactions[0] because we create only 1 tx by transactionSessionId

      // console.log(
      //   '>>> SuccessfulTxArray[' + i + '] : ' + transactionSessionId + ' : ',
      //   transaction
      // );

      //// TODO : update the status of the tx in the database

      //// Remove the tx with the corresponding transactionSessionId from successfulTransactionsArray
      //// ==> by doing so, the toast with a successful status will not be shown
      //transactionServices.removeSignedTransaction(transactionSessionId);
    }
  }

  function CheckCompletedTx() {
    //  console.log('>>>>> CompletedTx : ', CompletedTx);
    const CompletedTxTxArray = CompletedTx.completedTransactionsArray;
    for (let i = 0; i < CompletedTxTxArray.length; i++) {
      const transactionSessionId = CompletedTxTxArray[i][0];
      const transaction = CompletedTxTxArray[i][1].transactions[0]; // ==> transactions[0] because we create only 1 tx by transactionSessionId

      // console.log(
      //   '>>> CompletedTxTxArray[' + i + '] : ' + transactionSessionId + ' : ',
      //   transaction
      // );

      //// TODO : update the status of the tx in the database

      //// Remove the tx with the corresponding transactionSessionId from completedTransactionsArray
      //// ==> by doing so, the toast with a successful status will not be shown
      //transactionServices.removeSignedTransaction(transactionSessionId);
    }
  }
  return SuccessfulTx;
};

export default TxTracking;
