import { FC, ReactElement, ChangeEvent, useContext, useEffect, useState } from 'react'
import { Network, JsonRpcSigner, Contract, formatEther, formatUnits, parseEther } from 'ethers'
import { Alert, TextField, Box, Container, Select, Typography, MenuItem, Button } from '@mui/material'
import { MetamaskContext } from '../components/MetamaskProvider'
import { CHAINS } from '../constants/chains'
import { abi } from '../abi'

type Alert = {
    state: string | null,
    message: string | null
}

type Transaction = {
    to: string,
    value: bigint
}

const Metamask: FC = (): ReactElement => {
    const { web3, chainId, accounts, switchChain } = useContext(MetamaskContext)
    const [userChain, setUserChain] = useState<Network | null>(null)
    const [userAccount, setUserAccount] = useState<JsonRpcSigner | null>(null)
    const [, setUserAccounts] = useState<JsonRpcSigner[] | null>([])
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
    const [balance, setBalance] = useState<string>('')
    const [currentChain, setCurrentChain] = useState<string>(CHAINS[0].chainName)
    const [alert, setAlert] = useState<Alert | null>(null)
    const [addressTo, setAddressTo] = useState<string>('')
    const [amountTo, setAmountTo] = useState<string>('')

    const CONTRACT_ADDRESS = '0x5eBBDFa0936CA66814F195B8c504C420292E0B0e'

    const getContractBalance = async () => {
        const contract = new Contract(CONTRACT_ADDRESS, abi, web3)

        try {
            const balance = await contract.balanceOf(userAccount?.address)

            const balanceNumber = formatUnits(balance.toString(), 18)
            console.log(balanceNumber)
        } catch (err){
            console.warn(err)
        }
    }

    const getInfo = async (): Promise<void> => {
        try {
            if(!web3) return

            const [chain, accounts, signer] = await Promise.all([
                web3?.getNetwork(),
                web3?.listAccounts(),
                web3.getSigner()
            ])

            const balance = await web3?.getBalance(signer)

            setUserChain(chain)
            setUserAccount(accounts[0])
            setUserAccounts(accounts)
            setSigner(signer)
            setBalance(formatEther(balance))
        } catch (e) {
            if (e.code === "NETWORK_ERROR") {
                setAlert({ state: 'info', message: 'Network changed' })
            } else {
                console.error(e)
            }
        }
    }

    const sendTransaction = async (): Promise<void> => {
        if (!addressTo || !amountTo) {
            setAlert({ state: 'error', message: 'Fill in address and amount' })
            return
        }

        try {
            const transaction: Transaction = {
                to: addressTo,
                value: parseEther(amountTo)
            }

            await signer?.sendTransaction(transaction)
            setAlert({ state: 'success', message: 'Transaction confirmed' })
            const balance = await web3?.getBalance(signer)
            setBalance(formatEther(balance))
            setAddressTo('')
            setAmountTo('')
        } catch (err) {
            setAlert({ state: 'error', message: 'Error' })
            setAddressTo('')
            setAmountTo('')
        }
    }

    const handleChange = (e): void => {
        const chainId = CHAINS.find(chain => chain.chainName === e.target.value).chainId
        switchChain(chainId)
    }

    const handleAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAddressTo(e.target.value)
    }

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAmountTo(e.target.value)
    }

    useEffect(() => {
        web3 && getInfo()
    }, [web3, chainId, accounts])

    useEffect(() => {
        userChain && setCurrentChain(userChain.name)
        userAccount && getContractBalance()
    }, [userChain, userAccount])

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null)
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [alert])

    return (
        <Container maxWidth="sm">
            <Typography sx={{ color: '#3b4f65'}} variant="h4" align="center">
                Welcome to your Ethereum hub
            </Typography>
            <Box component="section"
                 sx={{
                     padding: 3,
                     marginBottom: 3,
                     borderRadius: '5px',
                     background: '#c8ddf4',
                     color: '#4d6a89',
                     boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                 }}>
                <Typography sx={{marginBottom: '15px'}}
                            variant="h6">Current Account: {userAccount?.address}</Typography>
                <Typography sx={{marginBottom: '15px'}} variant="h6">Balance: {balance} ETH</Typography>
                <Typography variant="h6">Network</Typography>
                <Select value={currentChain} onChange={handleChange}>
                    {CHAINS.map(chain => (
                        <MenuItem value={chain.chainName}
                                  key={chain.chainId}>
                            {chain.chainName}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <Box component="section"
                sx={{
                backgroundColor: '#e9eff8',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                margin: '20px auto',
                textAlign: 'center',
                display: 'grid',
                gridDirection: 'column',
                gap: '25px'
            }}>
                <TextField value={addressTo} label="Address" variant="standard" onChange={handleAddressChange}/>
                <TextField value={amountTo} label="Amount" variant="standard" onChange={handleAmountChange} />
                <Button variant="contained" onClick={sendTransaction}>Send</Button>
            </Box>
            {alert &&
                (<Alert severity={alert.state}
                    onClose={() => {setAlert(null)}}>{alert.message}</Alert>)
            }
        </Container>
    )
}

export default Metamask