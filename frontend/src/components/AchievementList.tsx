import { useEffect, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { listByOwner, mintAchievement } from '../lib/contract'
import AchievementCard from './AchievementCard'

export default function AchievementList() {
  const { publicKey, isConnected } = useWallet()
  const [achievements, setAchievements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const loadAchievements = async () => {
    if (!publicKey) return
    
    setIsLoading(true)
    try {
      const data = await listByOwner(publicKey)
      setAchievements(data)
    } catch (error) {
      console.error('Failed to load achievements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && publicKey) {
      loadAchievements()
    }
  }, [isConnected, publicKey])

  const handleMint = async (id: number) => {
    if (!publicKey) return
    
    try {
      await mintAchievement(publicKey, id)
      alert('Achievement minted successfully!')
      loadAchievements()
    } catch (error) {
      console.error('Failed to mint achievement:', error)
      alert('Failed to mint achievement')
    }
  }

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-300">
          Please connect your wallet to view your achievements
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-300">Loading achievements...</p>
      </div>
    )
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-300 mb-4">
          You don't have any achievements yet
        </p>
        <a 
          href="/create" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition"
        >
          Create Your First Achievement
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">My Achievements</h2>
        <button
          onClick={loadAchievements}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onMint={handleMint}
          />
        ))}
      </div>
    </div>
  )
}
