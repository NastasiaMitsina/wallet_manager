import { FC } from 'react'
import { MetamaskProvider } from '../components/MetamaskProvider'
import Metamask from './metamask'

const Index: FC = () => {

    return (
        <MetamaskProvider>
            <Metamask />
        </MetamaskProvider>
    )
}

export default Index