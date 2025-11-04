import {
  Networks,
  SorobanRpc,
  Transaction,
  xdr,
  Contract,
  TransactionBuilder,
  BASE_FEE,
} from '@stellar/stellar-sdk'
import freighter from '@stellar/freighter-api'

// Environment variables
export const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || ''
export const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || Networks.TESTNET
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org'

// Initialize Soroban server
export const server = new SorobanRpc.Server(RPC_URL, { allowHttp: true })
// Helper to build contract call
export async function buildContractCall(
  method: string,
  params: xdr.ScVal[],
  publicKey: string
): Promise<Transaction> {
  const account = await server.getAccount(publicKey)
  
  const contract = new Contract(CONTRACT_ID)
  
  const operation = contract.call(method, ...params)
  
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build()
  
  return tx
}

// Helper to simulate and send transaction
export async function sendTransaction(
  tx: Transaction,
  publicKey: string
): Promise<SorobanRpc.Api.GetTransactionResponse> {
  // Simulate first
  const simulated = await server.simulateTransaction(tx)
  
  if (SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`)
  }
  
  // Prepare transaction
  const prepared = SorobanRpc.assembleTransaction(tx, simulated).build()
  
  // Sign with Freighter
  const signedResponse = await freighter.signTransaction(
    prepared.toXDR(),
    { networkPassphrase: NETWORK_PASSPHRASE }
  )
  
  if (signedResponse.error || !signedResponse.signedTxXdr) {
    throw new Error(`Failed to sign transaction: ${signedResponse.error || 'Unknown error'}`)
  }
  
  const signedTx = TransactionBuilder.fromXDR(
    signedResponse.signedTxXdr,
    NETWORK_PASSPHRASE
  ) as Transaction
  
  // Send
  const result = await server.sendTransaction(signedTx)
  
  // Wait for confirmation
  let status = await server.getTransaction(result.hash)
  while (status.status === SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    status = await server.getTransaction(result.hash)
  }
  
  // Check for errors
  if (status.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
    console.error('Transaction failed:', status)
    throw new Error('Transaction failed on chain')
  }
  
  return status
}
