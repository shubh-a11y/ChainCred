import { create } from 'zustand'
import freighter from '@stellar/freighter-api'

export interface WalletState {
  publicKey: string | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

export const useWallet = create<WalletState>((set) => ({
  publicKey: null,
  isConnected: false,
  isConnecting: false,
  
  connect: async () => {
    set({ isConnecting: true })
    try {
      // Check if Freighter is installed
      const isFreighterInstalled = await freighter.isConnected()
      
      if (!isFreighterInstalled) {
        alert('Please install Freighter wallet extension from https://www.freighter.app/')
        set({ isConnecting: false })
        return
      }

      // Request user approval (this triggers the Freighter popup)
      const response = await freighter.requestAccess()
      
      if (response.error) {
        console.error('Freighter access error:', response.error)
        alert(`Failed to connect to Freighter: ${response.error}`)
        set({ isConnecting: false })
        return
      }

      // Get the public key/address
      const addressResponse = await freighter.getAddress()
      
      if (addressResponse.error || !addressResponse.address) {
        console.error('Failed to get address:', addressResponse.error)
        alert(`Failed to get address from Freighter: ${addressResponse.error || 'Unknown error'}`)
        set({ isConnecting: false })
        return
      }
      
      console.log('Connected to Freighter! Address:', addressResponse.address)
      
      // Log which account this is
      if (addressResponse.address === 'GCIAYLJSJJQE5NPRFUCWPHLCV5VJTDFH4YO2DIO5TUISCBULEO2GMXJF') {
        console.log('✅ This is acc1 (ADMIN account)')
      } else if (addressResponse.address === 'GCB7X43X4H4AWOVEJXT5LGOIJ27GZVOQG73XDW7GVUBBCCNZCF7CQO6S') {
        console.log('✅ This is alice account')
      } else if (addressResponse.address === 'GA3IX5N3FBJUNUMLCETYKOQ26REQKDCBCLEDHPCTKEKZGUQ45ZEZMFEO') {
        console.log('✅ This is Account 1 (YOUR ADMIN ACCOUNT - Freighter)')
      } else {
        console.log('⚠️ This is a different account')
        console.log('Full address:', addressResponse.address)
      }
      
      set({ 
        publicKey: addressResponse.address, 
        isConnected: true, 
        isConnecting: false 
      })
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      if (error?.message?.includes('User declined')) {
        alert('Wallet connection cancelled')
      } else {
        alert(`Failed to connect: ${error?.message || 'Unknown error'}`)
      }
      set({ isConnecting: false })
    }
  },
  
  disconnect: () => {
    set({ publicKey: null, isConnected: false })
  },
}))

// Freighter types
declare global {
  interface Window {
    freighterApi?: {
      getPublicKey: () => Promise<string>
      signTransaction: (xdr: string, networkPassphrase: string) => Promise<string>
      isConnected: () => Promise<boolean>
    }
  }
}
