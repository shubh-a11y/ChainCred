import { useWallet } from '../hooks/useWallet'

// Known accounts for display
const KNOWN_ACCOUNTS: Record<string, { name: string; role: string }> = {
  'GCIAYLJSJJQE5NPRFUCWPHLCV5VJTDFH4YO2DIO5TUISCBULEO2GMXJF': { name: 'acc1', role: 'Admin' },
  'GCB7X43X4H4AWOVEJXT5LGOIJ27GZVOQG73XDW7GVUBBCCNZCF7CQO6S': { name: 'alice', role: 'User' },
  'GA3IX5N3FBJUNUMLCETYKOQ26REQKDCBCLEDHPCTKEKZGUQ45ZEZMFEO': { name: 'Account 1', role: 'Admin' },
}

export default function WalletConnect() {
  const { publicKey, isConnected, isConnecting, connect, disconnect } = useWallet()

  if (isConnected && publicKey) {
    const knownAccount = KNOWN_ACCOUNTS[publicKey]
    const accountLabel = knownAccount?.name || 'Other Account'
    const isAdmin = publicKey === 'GCIAYLJSJJQE5NPRFUCWPHLCV5VJTDFH4YO2DIO5TUISCBULEO2GMXJF' 
                 || publicKey === 'GA3IX5N3FBJUNUMLCETYKOQ26REQKDCBCLEDHPCTKEKZGUQ45ZEZMFEO'
    
    return (
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className={`text-sm font-semibold ${knownAccount ? 'text-blue-400' : 'text-yellow-400'}`}>
              {accountLabel}
            </span>
            {isAdmin && (
              <span className="text-xs bg-green-600 px-2 py-0.5 rounded">
                ⭐ ADMIN
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
          </div>
          {!knownAccount && (
            <div className="text-xs text-yellow-400 mt-1">
              ⚠️ Not acc1 or alice
            </div>
          )}
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition disabled:opacity-50"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
