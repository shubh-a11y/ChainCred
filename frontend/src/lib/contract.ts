import {
  xdr,
  Address,
  nativeToScVal,
  scValToNative,
  Contract,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  SorobanRpc,
} from '@stellar/stellar-sdk'
import { buildContractCall, sendTransaction, server, CONTRACT_ID } from './stellar'

// Convert JS values to ScVal
export function stringToScVal(str: string): xdr.ScVal {
  return nativeToScVal(str)
}

export function addressToScVal(addr: string): xdr.ScVal {
  return new Address(addr).toScVal()
}

export function u64ToScVal(num: number): xdr.ScVal {
  return nativeToScVal(num, { type: 'u64' })
}

export function optionToScVal(value: string | null): xdr.ScVal {
  if (value === null) {
    return xdr.ScVal.scvVoid()
  }
  return nativeToScVal(value)
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
  
  if (result.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS && result.returnValue) {
    return scValToNative(result.returnValue)
  }
  
  throw new Error('Failed to create achievement')
}

export async function listByOwner(owner: string): Promise<any[]> {
  const account = await server.getAccount(owner)
  const contract = new Contract(CONTRACT_ID)
  
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: import.meta.env.VITE_NETWORK_PASSPHRASE || Networks.TESTNET,
  })
    .addOperation(contract.call('list_by_owner', addressToScVal(owner)))
    .setTimeout(30)
    .build()
  
  const simulated = await server.simulateTransaction(tx)
  
  if (SorobanRpc.Api.isSimulationSuccess(simulated) && simulated.result) {
    return scValToNative(simulated.result.retval)
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
  if (result.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
    return
  }
  
  throw new Error('Failed to add verifier')
}
