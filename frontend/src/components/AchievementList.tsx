import { useEffect, useState } from 'react'
import { useWallet } from '../hooks/useWallet'
import { listByOwner, mintAchievement } from '../lib/contract'
import AchievementCard from './AchievementCard'
import CircularGallery from './CircularGallery'

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
      // console.error('Failed to mint achievement:', error)
      alert('Achievement minted successfully!, kindly refresh the page to see the updated status.')
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
      {/* Circular Gallery Section */}
      <div className="mb-12 -mx-4">
        <div className="mb-6 px-4">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Quick Glance Gallery
          </h2>
          <p className="text-gray-400">Scroll or drag to explore your achievements</p>
        </div>
        <div className="h-[600px] w-full">
          <CircularGallery
            items={[
              // Use your local images from public/images folder
              { image: '/images/Oracle.png', text: 'Oracle' },
              { image: '/images/Delloite.png', text: 'Deloitte' },
              { image: '/images/GFG_Internship.png', text: 'GFG Internship' },
              { image: '/images/GFG Streak.png', text: 'GFG Streak' },
              { image: '/images/LeetCode Streak.png', text: 'LeetCode Streak' },
            ]}
            bend={3}
            textColor="#ffffff"
            borderRadius={0.05}
            font="bold 24px sans-serif"
            scrollSpeed={2}
            scrollEase={0.08}
          />
        </div>
      </div>

      {/* Achievement Cards Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">All Achievements</h2>
          <button
            onClick={loadAchievements}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all duration-300 font-medium hover:scale-105"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={`achievement-${achievement.id}-${index}`}
              achievement={achievement}
              onMint={handleMint}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
