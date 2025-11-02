interface Achievement {
  id: number
  owner: string
  title: string
  description: string
  category: string
  evidence_uri: string
  timestamp: number
  status: string
}

interface AchievementCardProps {
  achievement: Achievement
  onMint?: (id: number) => void
  onVerify?: (id: number) => void
}

export default function AchievementCard({ achievement, onMint, onVerify }: AchievementCardProps) {
  const statusColors = {
    draft: 'bg-yellow-600',
    minted: 'bg-blue-600',
    verified: 'bg-green-600',
  }

  const statusColor = statusColors[achievement.status as keyof typeof statusColors] || 'bg-gray-600'

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
          <span className={`${statusColor} px-3 py-1 rounded-full text-sm`}>
            {achievement.status}
          </span>
        </div>
        <span className="text-sm text-gray-400">#{achievement.id}</span>
      </div>

      <p className="text-gray-300 mb-4">{achievement.description}</p>

      <div className="space-y-2 text-sm text-gray-400">
        <div>
          <span className="font-medium">Category:</span> {achievement.category}
        </div>
        <div>
          <span className="font-medium">Evidence:</span>{' '}
          <a 
            href={achievement.evidence_uri} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {achievement.evidence_uri.slice(0, 30)}...
          </a>
        </div>
        <div>
          <span className="font-medium">Created:</span>{' '}
          {new Date(Number(achievement.timestamp) * 1000).toLocaleDateString()}
        </div>
      </div>

      {achievement.status === 'draft' && onMint && (
        <button
          onClick={() => onMint(achievement.id)}
          className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Mint Achievement
        </button>
      )}

      {achievement.status === 'minted' && onVerify && (
        <button
          onClick={() => onVerify(achievement.id)}
          className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
        >
          Verify Achievement
        </button>
      )}
    </div>
  )
}
