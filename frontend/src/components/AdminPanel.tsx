import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { initContract, addVerifier } from '../lib/contract'

export default function AdminPanel() {
  const { publicKey, isConnected } = useWallet()
  const [verifierAddress, setVerifierAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [initSuccess, setInitSuccess] = useState(false)

  const handleInitContract = async () => {
    if (!isConnected || !publicKey) {
      alert('Please connect your wallet first')
      return
    }

    const confirmed = window.confirm(
      `Initialize contract with ${publicKey} as admin?\n\nThis can only be done once!`
    )
    
    if (!confirmed) return

    setIsInitializing(true)
    setInitSuccess(false)

    try {
      await initContract(publicKey)
      alert('✅ Contract initialized successfully! You are now the admin.')
      setInitSuccess(true)
    } catch (error: any) {
      console.error('Failed to initialize contract:', error)
      const errorMsg = error?.message || ''
      
      // Check for already initialized error
      if (errorMsg.includes('already-initialized') || errorMsg.includes('UnreachableCodeReached')) {
        alert('⚠️ Contract is already initialized!\n\nThe contract already has an admin set. If you are not the admin, you cannot add verifiers.')
        setInitSuccess(true) // Mark as success to hide the button
      } else if (errorMsg.includes('Simulation failed')) {
        alert('❌ Contract is already initialized!\n\nSomeone else has already set up this contract as admin.')
        setInitSuccess(true)
      } else {
        alert('Failed to initialize contract. Check console for details.')
      }
    } finally {
      setIsInitializing(false)
    }
  }

  const handleAddVerifier = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !publicKey) {
      alert('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)

    try {
      await addVerifier(publicKey, verifierAddress)
      alert('Verifier added successfully!')
      setVerifierAddress('')
    } catch (error) {
      console.error('Failed to add verifier:', error)
      alert('Failed to add verifier. Make sure you are the admin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <p className="text-xl text-gray-300">
          Please connect your wallet to access admin panel
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Admin Panel</h2>

      {/* Contract Initialization Section */}
      <div className="bg-slate-800/50 p-8 rounded-xl mb-6">
        <h3 className="text-xl font-semibold mb-4">🔧 Contract Initialization</h3>
        
        {!initSuccess ? (
          <>
            <p className="text-sm text-gray-300 mb-4">
              If this is the first time using the contract, you need to initialize it with an admin address.
              This can only be done once!
            </p>
            
            <div className="bg-slate-700/50 p-4 rounded-lg mb-4">
              <p className="text-sm mb-2">
                <strong>Your Address:</strong>
              </p>
              <p className="text-xs font-mono bg-slate-900/50 p-2 rounded break-all">
                {publicKey}
              </p>
            </div>

            <button
              onClick={handleInitContract}
              disabled={isInitializing}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInitializing ? 'Initializing...' : '🚀 Initialize Contract as Admin'}
            </button>

            <p className="text-xs text-gray-400 mt-2">
              ⚠️ Only click this if the contract has never been initialized before!
            </p>
          </>
        ) : (
          <div className="p-4 bg-green-600/20 border border-green-600 rounded-lg">
            <p className="font-semibold mb-2">✅ Contract Already Initialized</p>
            <p className="text-sm text-gray-300">
              This contract has been initialized. You can now add verifiers below if you are the admin.
            </p>
          </div>
        )}
      </div>

      {/* Add Verifier Section */}
      <div className="bg-slate-800/50 p-8 rounded-xl">
        <h3 className="text-xl font-semibold mb-6">Add Verifier</h3>
        
        <form onSubmit={handleAddVerifier} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Verifier Stellar Address
            </label>
            <input
              type="text"
              value={verifierAddress}
              onChange={(e) => setVerifierAddress(e.target.value)}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="G..."
            />
            <p className="text-sm text-gray-400 mt-2">
              This address will be authorized to verify achievements
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Verifier'}
          </button>
        </form>
      </div>

      <div className="mt-8 bg-yellow-600/20 border border-yellow-600 rounded-lg p-6">
        <p className="text-sm">
          ⚠️ <strong>Admin Only:</strong> Only the contract admin can add or remove verifiers.
          Make sure your connected wallet is the admin address.
        </p>
      </div>
    </div>
  )
}
