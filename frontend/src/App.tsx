import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useWallet } from './hooks/useWallet'
import WalletConnect from './components/WalletConnect'
import CreateAchievement from './components/CreateAchievement'
import AchievementList from './components/AchievementList'
import AdminPanel from './components/AdminPanel'
import AdminChecker from './components/AdminChecker'

function App() {
  const { publicKey, isConnected } = useWallet()
  
  // Check if connected account is acc1 or alice
  const isAcc1 = publicKey === 'GCIAYLJSJJQE5NPRFUCWPHLCV5VJTDFH4YO2DIO5TUISCBULEO2GMXJF'
  const isAlice = publicKey === 'GCB7X43X4H4AWOVEJXT5LGOIJ27GZVOQG73XDW7GVUBBCCNZCF7CQO6S'
  const isAccount1 = publicKey === 'GA3IX5N3FBJUNUMLCETYKOQ26REQKDCBCLEDHPCTKEKZGUQ45ZEZMFEO'
  const isUnknownAccount = isConnected && !isAcc1 && !isAlice && !isAccount1
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-orange-600 via-pink-600 to-violet-600 animate-gradient-x text-white">
        {/* Broader Navbar with Bigger Text */}
        <nav className="bg-slate-800/80 backdrop-blur-md border-b-2 border-slate-700/50 shadow-xl">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                  🏆 ChainCred
                </h1>
                <div className="flex space-x-8 text-lg">
                  <Link to="/" className="hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105">
                    My Achievements
                  </Link>
                  <Link to="/create" className="hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105">
                    Create New
                  </Link>
                  <Link to="/admin" className="hover:text-blue-400 transition-all duration-300 font-medium hover:scale-105">
                    Admin
                  </Link>
                  <Link to="/check-admin" className="hover:text-orange-400 transition-all duration-300 font-medium hover:scale-105">
                    🔍 Check Admin
                  </Link>
                </div>
              </div>
              <WalletConnect />
            </div>
          </div>
        </nav>

        {/* Warning banner for unknown accounts */}
        {isUnknownAccount && (
          <div className="bg-yellow-600/20 border-b border-yellow-600">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-yellow-400">Different Account Detected</p>
                    <p className="text-sm text-gray-300">
                      You're not using acc1 (admin) or alice. Full address: <span className="font-mono text-xs">{publicKey}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey || '')
                    alert('Address copied to clipboard!')
                  }}
                  className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                >
                  Copy Address
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<AchievementList />} />
            <Route path="/create" element={<CreateAchievement />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/check-admin" element={<AdminChecker />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
