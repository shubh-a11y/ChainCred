import { useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { createAchievement } from '../lib/contract'

export default function CreateAchievement() {
  const { publicKey, isConnected } = useWallet()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('coding')
  const [evidenceUri, setEvidenceUri] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !publicKey) {
      alert('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)
    setSuccess(false)

    try {
      const id = await createAchievement(
        publicKey,
        title,
        description,
        category,
        evidenceUri
      )
      console.log('Achievement created with ID:', id)
      setSuccess(true)
      
      // Reset form
      setTitle('')
      setDescription('')
      setCategory('coding')
      setEvidenceUri('')
    } catch (error) {
      console.error('Failed to create achievement:', error)
      alert('Failed to create achievement. Check console for details.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-xl text-gray-300">
          Please connect your wallet to create achievements
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Create New Achievement</h2>
      
      {success && (
        <div className="mb-6 p-4 bg-green-600/20 border border-green-600 rounded-lg">
          ✅ Achievement created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/50 p-8 rounded-xl">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="100-day coding streak"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Solved 750+ problems and maintained daily practice"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="coding">Coding</option>
            <option value="certification">Certification</option>
            <option value="poetry">Poetry</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Evidence URI (IPFS CID or URL)</label>
          <input
            type="text"
            value={evidenceUri}
            onChange={(e) => setEvidenceUri(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ipfs://QmXxx... or https://..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Achievement'}
        </button>
      </form>
    </div>
  )
}
