export const CHAINS = [
  {
    chainName: 'mainnet',
    rpcUrls: ['https://mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://bscscan.com'],
    chainId: 1,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 16,
    }
  },
  {
    chainName: 'linea',
    rpcUrls: ['https://linea-mainnet.infura.io/v3/'],
    blockExplorerUrls: ['https://lineascan.build'],
    chainId: 59144,
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 16,
    }
  },
  {
    chainName: 'goerli',
    rpcUrls: ['https://goerli.infura.io/v3/'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    chainId: 5,
    nativeCurrency: {
      name: 'GoerliETH',
      symbol: 'GoerliETH',
      decimals: 16,
    }
  },
  {
    chainName: 'bnb',
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com'],
    chainId: 56,
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    }
  },
  {
    chainName: 'flare',
    rpcUrls: ['https://coston-api.flare.network/ext/bc/C/rpc'],
    chainId: 16,
    nativeCurrency: {
      name: 'CFLR',
      symbol: 'CFLR',
      decimals: 18,
    }
  },
  {
    chainName: 'bnbt',
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    chainId: 97,
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
  },
]
