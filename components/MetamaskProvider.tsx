import { FC, PropsWithChildren, createContext, useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { CHAINS } from '../constants/chains'
import { Window } from '../globals'

type Context = {
    web3: BrowserProvider | null,
    chainId: string| null,
    accounts: string[] | null
    switchChain: (chainId: string) => Promise<void>
}

export const MetamaskContext = createContext<Context | null>(null)

export const MetamaskProvider: FC = ({ children }: PropsWithChildren) => {
    const [provider, setProvider] = useState<Window | null>(null)
    const [web3, setWeb3] = useState<BrowserProvider | null>(null)
    const [chainId, setChainId] = useState<string | null>(null)
    const [accounts, setAccounts] = useState<string[] | null>(null)


    const init = async (): Promise<void> =>  {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' })

                if (accounts.length > 0) {
                    setAccounts(accounts)
                    setProvider(window.ethereum as Window)
                    await window.ethereum.request({method: 'eth_requestAccounts'})
                }
            } catch (error) {
                if (error.code === 4001) return
            }
        }

        if (provider) {
            const web3Instance = new BrowserProvider(window.ethereum)
            setWeb3(web3Instance)
        }
    }

    const switchChain = async (chainId: string): Promise<void> => {
        try {
            await window.ethereum?.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId:  `0x${chainId.toString(16)}`}]
            })
        } catch (err) {
            if(err?.code === 4902) {
                const chain = CHAINS.find(chain => chain.chainId === chainId)

                await window.ethereum?.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            ...chain,
                            chainId: `0x${chainId.toString(16)}`
                        }
                    ]
                })
            }
            console.log(err)
        }
    }

    const context: Context = {
        web3,
        chainId,
        accounts,
        switchChain
    }

    const handleChainChange = chainId => setChainId(chainId)

    const handleAccountsChange = accounts => setAccounts(accounts)

    useEffect(() => {
        init()

        provider?.on('chainChanged', handleChainChange)

        provider?.on('accountsChanged', handleAccountsChange)

        return () => {
            provider?.removeListener('chainChanged', handleChainChange)
            provider?.removeListener('accountsChanged', handleAccountsChange)
        }
    }, [provider, chainId])

    return (
        <MetamaskContext.Provider value={context}>
            { provider ? children : <h3>Please install Metamask or log in to your account</h3> }
        </MetamaskContext.Provider>
    )
}