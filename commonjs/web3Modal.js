const _web3Modal = (() => {
    const Web3Modal = window.Web3Modal.default
    const WalletConnectProvider = window.WalletConnectProvider.default
    const evmChains = window.evmChains

    const _web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: "8397607a49374de7acb992d7878063cd",
                }
            },
        },
        disableInjectedProvider: false,
    })

    let provider = null
    let selectedAccount = null

    let onAccountCb = () => { }
    let onDisconnectCb = () => { }

    const setOnAccount = (cb) => { onAccountCb = cb }
    const setOnDisconnect = (cb) => { onDisconnectCb = cb }

    const fetchAccountData = async () => {
        const web3 = new Web3(provider)
    
        const chainId = await web3.eth.getChainId()
        const chainData = evmChains.getChain(chainId)
        console.log("Connected chain is", chainData)
    
        const accounts = await web3.eth.getAccounts()

        selectedAccount = accounts[0]
        console.log('Selected account is', selectedAccount)

        if (selectedAccount) {
            onAccountCb(selectedAccount)
        }
    }

    const connect = async () => {
        try {
            provider = await _web3Modal.connect()
        } catch(e) {
            Swal.fire({
                icon: 'error',
                title: 'Could not get a wallet connection',
                text: e,
            })
            return null
        }

        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
            onDisconnectCb()
            fetchAccountData()
        })
    
        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
            onDisconnectCb()
            fetchAccountData()
        })
    
        // Subscribe to networkId change
        provider.on("networkChanged", (networkId) => {
            onDisconnectCb()
            fetchAccountData()
        })

        _storage.set(_storage.keys.AUTHENTICATED, true)
        await fetchAccountData()
    }

    const disconnect = async () => {
        if (provider.close)
            await provider.close()

        await _web3Modal.clearCachedProvider()
        
        provider = null
        selectedAccount = null
        
        _storage.set(_storage.keys.AUTHENTICATED, false)

        onDisconnectCb()
    }

    const sendTransaction = async (tx, onConfirm = () => {}) => {
        const web3ModalProvider = new ethers.providers.Web3Provider(provider)
        const signer = web3ModalProvider.getSigner()

        try {
            const res = await signer.sendTransaction(tx)
            console.log('Transaction sent', res)
            res.wait().then(confirmRes => {
                onConfirm(confirmRes)
            })
            return res.hash
        }
        catch(e) {
            Swal.fire({
                icon: 'error',
                text: e.message,
            })
            console.log('errrr', e.message)
            return false
        }
    }

    const getSelectedAccount = () => {
        return selectedAccount
    }
    
    return {
        setOnAccount,
        setOnDisconnect,
        connect,
        disconnect,
        sendTransaction,
        getSelectedAccount,
    }
})();