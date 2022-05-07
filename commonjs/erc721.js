const _erc721 = (() => {
    const _abi = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
    const ethersProvider = new ethers.providers.JsonRpcProvider('https://speedy-nodes-nyc.moralis.io/a7646c8b1c86ed27127cbb73/eth/rinkeby')

    const getTokenURI = async (tokenAddress, tokenId) => {
        const contract = new ethers.Contract(tokenAddress, _abi, ethersProvider)
        const res = await contract.tokenURI(tokenId)
        return res
    }

    const getTokenURIBatch = async (data) => {
        const res = await Promise.all(data.map(d => getTokenURI(d[0], d[1])))
        return res
    }

    const retriveTokenURIData = async (url, options = {}) => {
        const { timeout = 3000 } = options
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), timeout)
        let res = {
            description: 'Lorem ipsum dolor'
        }

        if (url.includes('ipfs://')) {
            url = `https://gateway.moralisipfs.com/ipfs/${url.replace('ipfs://', '')}`
        }
        try {
            res = await fetch(url, {
                ...options,
                signal: controller.signal,
            })
            .then(response => response.json())
            clearTimeout(id)
        }
        catch(e) {}

        return {
            url,
            ...res,
        }
    }

    const retriveTokenURIDataBatch = async (data) => {
        const res = await Promise.all(data.map(d => retriveTokenURIData(d)))
        return res
    }

    const retrieveTokenMetadata = async (tokenAddress, tokenId) => {
        const res1 = await getTokenURI(tokenAddress, tokenId)
        const res2 = await retriveTokenURIData(res1)
        return res2
    }

    const retrieveTokenMetadataBatch = async (data) => {
        const res1 = await getTokenURIBatch(data)
        const res2 = await retriveTokenURIDataBatch(res1)
        return res2
    }

    return {
        getTokenURI,
        getTokenURIBatch,
        retriveTokenURIData,
        retriveTokenURIDataBatch,
        retrieveTokenMetadata,
        retrieveTokenMetadataBatch,
    }
})();