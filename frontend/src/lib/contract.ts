import * as SorobanClient from '@stellar/stellar-sdk'
import { buildContractCall, sendTransaction, server, CONTRACT_ID } from './stellar'

// Convert JS values to ScVal
export function stringToScVal(str: string): SorobanClient.xdr.ScVal {
  return SorobanClient.nativeToScVal(str)
}

export function addressToScVal(addr: string): SorobanClient.xdr.ScVal {
  return SorobanClient.nativeToScVal(new SorobanClient.Address(addr), { type: 'address' })
}

export function u64ToScVal(num: number): SorobanClient.xdr.ScVal {
  return SorobanClient.nativeToScVal(num, { type: 'u64' })
}

export function optionToScVal(value: string | null): SorobanClient.xdr.ScVal {
  if (value === null) {
    return SorobanClient.xdr.ScVal.scvVoid()
  }
  return SorobanClient.nativeToScVal(value)
}

// Contract methods
export async function createAchievement(
  owner: string,
  title: string,
  description: string,
  category: string,
  evidenceUri: string
): Promise<number> {
  const params = [
    addressToScVal(owner),
    stringToScVal(title),
    stringToScVal(description),
    stringToScVal(category),
    stringToScVal(evidenceUri),
  ]
  
  const tx = await buildContractCall('create_achievement', params, owner)
  const result = await sendTransaction(tx, owner)
  
  if (result.status === SorobanClient.SorobanRpc.Api.GetTransactionStatus.SUCCESS && result.returnValue) {
    return SorobanClient.scValToNative(result.returnValue)
  }
  
  throw new Error('Failed to create achievement')
}

export async function listByOwner(owner: string): Promise<any[]> {
  const account = await server.getAccount(owner)
  const contract = new SorobanClient.Contract(CONTRACT_ID)
  
  const tx = new SorobanClient.TransactionBuilder(account, {
    fee: SorobanClient.BASE_FEE,
    networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE || SorobanClient.Networks.TESTNET,
  })
    .addOperation(contract.call('list_by_owner', addressToScVal(owner)))
    .setTimeout(30)
    .build()
  
  const simulated = await server.simulateTransaction(tx)
  
  if (SorobanClient.SorobanRpc.Api.isSimulationSuccess(simulated) && simulated.result) {
    return SorobanClient.scValToNative(simulated.result.retval)
  }
  
  return []
}

export async function mintAchievement(owner: string, id: number): Promise<void> {
  const params = [u64ToScVal(id)]
  const tx = await buildContractCall('mint_achievement', params, owner)
  await sendTransaction(tx, owner)
}

export async function verifyAchievement(verifier: string, id: number): Promise<void> {
  const params = [u64ToScVal(id), addressToScVal(verifier)]
  const tx = await buildContractCall('verify_achievement', params, verifier)
  await sendTransaction(tx, verifier)
}

export async function initContract(admin: string): Promise<void> {
  const params = [addressToScVal(admin)]
  const tx = await buildContractCall('init', params, admin)
  await sendTransaction(tx, admin)
}

export async function addVerifier(admin: string, verifier: string): Promise<void> {
  const params = [addressToScVal(verifier)]
  const tx = await buildContractCall('add_verifier', params, admin)
  const result = await sendTransaction(tx, admin)
  
  // Check if transaction was successful
  if (result.status === SorobanClient.SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
    return
  }
  
  throw new Error('Failed to add verifier')
}
