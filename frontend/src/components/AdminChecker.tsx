import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import * as SorobanClient from '@stellar/stellar-sdk'
import { server, CONTRACT_ID, NETWORK_PASSPHRASE } from '../lib/stellar'

export default function AdminChecker() {
  const { publicKey, isConnected } = useWallet()
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<string>('')

  // Test accounts to check
  const testAccounts = [
    { name: 'Account 1 (Current)', address: publicKey || '' },
    { name: 'acc1 (CLI)', address: 'GCIAYLJSJJQE5NPRFUCWPHLCV5VJTDFH4YO2DIO5TUISCBULEO2GMXJF' },
    { name: 'alice (CLI)', address: 'GCB7X43X4H4AWOVEJXT5LGOIJ27GZVOQG73XDW7GVUBBCCNZCF7CQO6S' },
  ]

  const checkAdmin = async () => {
    if (!isConnected || !publicKey) {
      alert('Please connect your wallet first')
      return
    }

    setIsChecking(true)
    setResult('Checking who can call admin functions...\n\n')

    try {
      // We'll try to simulate add_verifier with each account
      // The one that doesn't fail auth is the admin
      
      const contract = new SorobanClient.Contract(CONTRACT_ID)
      const dummyVerifier = 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF' // Dummy address
      
      for (const account of testAccounts) {
        if (!account.address) continue
        
        setResult(prev => prev + `Testing ${account.name}...\n`)
        
        try {
          // Try to get account (this will fail if account doesn't exist on testnet)
          const sourceAccount = await server.getAccount(account.address)
          
          // Build transaction to add verifier
          const tx = new SorobanClient.TransactionBuilder(sourceAccount, {
            fee: SorobanClient.BASE_FEE,
            networkPassphrase: NETWORK_PASSPHRASE,
          })
            .addOperation(
              contract.call(
                'add_verifier',
                SorobanClient.nativeToScVal(new SorobanClient.Address(dummyVerifier), { type: 'address' })
              )
            )
            .setTimeout(30)
            .build()
          
          // Simulate (don't actually send)
          const simulated = await server.simulateTransaction(tx)
          
          if (SorobanClient.SorobanRpc.Api.isSimulationSuccess(simulated)) {
            setResult(prev => prev + `✅ ${account.name} appears to be THE ADMIN!\n\n`)
          } else if (SorobanClient.SorobanRpc.Api.isSimulationError(simulated)) {
            const errorMsg = simulated.error || 'Unknown error'
            if (errorMsg.includes('admin') || errorMsg.includes('auth')) {
              setResult(prev => prev + `❌ ${account.name} is NOT the admin (auth failed)\n\n`)
            } else {
              setResult(prev => prev + `⚠️ ${account.name} - Error: ${errorMsg}\n\n`)
            }
          }
        } catch (error: any) {
          setResult(prev => prev + `⚠️ ${account.name} - ${error.message}\n\n`)
        }
      }
      
      setResult(prev => prev + '\n=== CHECK COMPLETE ===\n')
      
    } catch (error: any) {
      console.error('Check failed:', error)
      setResult(prev => prev + `\nError: ${error.message}\n`)
    } finally {
      setIsChecking(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-xl text-gray-300">
          Please connect your wallet to check admin status
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">🔍 Admin Checker</h2>

      <div className="bg-slate-800/50 p-8 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Find Who Is The Admin</h3>
        
        <p className="text-sm text-gray-300 mb-6">
          This will test which account can successfully call admin functions.
          The contract will be simulated (not actually executed) with each account.
        </p>

        <button
          onClick={checkAdmin}
          disabled={isChecking}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition disabled:opacity-50 mb-4"
        >
          {isChecking ? 'Checking...' : '🔍 Check Who Is Admin'}
        </button>

        {result && (
          <div className="bg-slate-900 p-4 rounded-lg">
            <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono">
              {result}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-600/20 border border-blue-600 rounded-lg p-6">
        <p className="text-sm">
          💡 <strong>Tip:</strong> The account that shows ✅ is the admin. 
          Import that account's secret key into Freighter to manage verifiers.
        </p>
      </div>
    </div>
  )
}
