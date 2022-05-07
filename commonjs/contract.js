const _contract = (() => {
    const contractAddress = "0x5dFe838D05FC3bD7e37DCED8C509Bb15a639Fc53"
    const ethersProvider = ethers.providers.getDefaultProvider('rinkeby')
    const contract = new ethers.Contract(contractAddress, ABI, ethersProvider)

    // data: [tokenAddress, tokenId][]
    const getListingDataBatch = async (data) => {
        const res = await contract.getListingDataBatch(data)
        return res
    }

    const getListings = async () => {
        const res = await contract.getERC721Listings()
        return res
    }

    const getRentedByAddress = async (address) => {
        const res = await contract.getERC721RentedByAddress(address)
        return res
    }

    const getListing = async (tokenAddress, tokenId) => {
        const res = await contract.getERC721Listing([tokenAddress, tokenId])
        return res
    }

    const getRentalHistory = async (tokenAddress, tokenId) => {
        const res = await contract.getRentalHistory([tokenAddress, tokenId])
        return res
    }

    const getListTx = (walletAddress, tokenAddress, tokenId, rentPrice) => {
        const data = contract.interface.encodeFunctionData('createERC721Listing', [[tokenAddress, tokenId], ethers.BigNumber.from((rentPrice * 10 ** 18).toString())])
        return {
            "from": walletAddress,
            "to": contractAddress,
            "value": "0x0",
            "data": data,
        }
    }

    const getRentTx = (walletAddress, tokenAddress, tokenId, price, nTimeUnits) => {
        const data = contract.interface.encodeFunctionData('rentERC721', [[tokenAddress, tokenId], nTimeUnits])
        return {
            "from": walletAddress,
            "to": contractAddress,
            "value": price.mul(nTimeUnits),
            "data": data,
        }
    }

    const getUpdatePriceTx = (walletAddress, tokenAddress, tokenId, rentPrice) => {
        const data = contract.interface.encodeFunctionData('setERC721ListingPrice', [[tokenAddress, tokenId], ethers.BigNumber.from((rentPrice * 10 ** 18).toString())])
        return {
            "from": walletAddress,
            "to": contractAddress,
            "value": "0x0",
            "data": data,
        }
    }

    const getPauseListingTx = (walletAddress, tokenAddress, tokenId, newState) => {
        const data = contract.interface.encodeFunctionData('pauseERC721Listing', [[tokenAddress, tokenId], newState])
        return {
            "from": walletAddress,
            "to": contractAddress,
            "value": "0x0",
            "data": data,
        }
    }

    const getDeleteListingTx = (walletAddress, tokenAddress, tokenId) => {
        const data = contract.interface.encodeFunctionData('removeERC721Listing', [[tokenAddress, tokenId]])
        return {
            "from": walletAddress,
            "to": contractAddress,
            "value": "0x0",
            "data": data,
        }
    }

    return {
        getListingDataBatch,
        getListings,
        getRentedByAddress,
        getListing,
        getRentalHistory,
        getListTx,
        getRentTx,
        getUpdatePriceTx,
        getPauseListingTx,
        getDeleteListingTx,
    }
})();