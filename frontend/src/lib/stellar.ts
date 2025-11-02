import * as SorobanClient from '@stellar/stellar-sdk'
import freighter from '@stellar/freighter-api'

// Environment variables
export const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID || ''
export const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || SorobanClient.Networks.TESTNET
export const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org'

// Initialize Soroban server
export const server = new SorobanClient.SorobanRpc.Server(RPC_URL)

// Helper to build contract call
export async function buildContractCall(
  method: string,
  params: SorobanClient.xdr.ScVal[],
  publicKey: string
): Promise<SorobanClient.Transaction> {
  const account = await server.getAccount(publicKey)
  
  const contract = new SorobanClient.Contract(CONTRACT_ID)
  
  const operation = contract.call(method, ...params)
  
  const tx = new SorobanClient.TransactionBuilder(account, {
    fee: SorobanClient.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build()
  
  return tx
}

// Helper to simulate and send transaction
export async function sendTransaction(
  tx: SorobanClient.Transaction,
  publicKey: string
): Promise<SorobanClient.SorobanRpc.Api.GetTransactionResponse> {
  // Simulate first
  const simulated = await server.simulateTransaction(tx)
  
  if (SorobanClient.SorobanRpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation failed: ${simulated.error}`)
  }
  
  // Prepare transaction
  const prepared = SorobanClient.SorobanRpc.assembleTransaction(tx, simulated).build()
  
  // Sign with Freighter
  const signedResponse = await freighter.signTransaction(
    prepared.toXDR(),
    { networkPassphrase: NETWORK_PASSPHRASE }
  )
  
  if (signedResponse.error || !signedResponse.signedTxXdr) {
    throw new Error(`Failed to sign transaction: ${signedResponse.error || 'Unknown error'}`)
  }
  
  const signedTx = SorobanClient.TransactionBuilder.fromXDR(
    signedResponse.signedTxXdr,
    NETWORK_PASSPHRASE
  ) as SorobanClient.Transaction
  
  // Send
  const result = await server.sendTransaction(signedTx)
  
  // Wait for confirmation
  let status = await server.getTransaction(result.hash)
  while (status.status === SorobanClient.SorobanRpc.Api.GetTransactionStatus.NOT_FOUND) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    status = await server.getTransaction(result.hash)
  }
  
  // Check for errors
  if (status.status === SorobanClient.SorobanRpc.Api.GetTransactionStatus.FAILED) {
    console.error('Transaction failed:', status)
    throw new Error('Transaction failed on chain')
  }
  
  return status
}
