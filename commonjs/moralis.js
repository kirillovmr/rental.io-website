const _moralis = (() => {
    const serverUrl = "https://phstpq7u03l8.usemoralis.com:2053/server"
    const appId = "RszX0fKzO5hRppWVhwIb5WJAy0Hj2uV3RS861zfh"
    Moralis.start({ serverUrl, appId })

    const getNfts = async (address) => {
        const res = await Moralis.Web3API.account.getNFTs({ address, chain: "rinkeby" })
        return res.result
    }

    const getERC721s = async (address) => {
        const nfts = await getNfts(address)
        return nfts.filter(nft => nft.contract_type === "ERC721")
    }

    return {
        getNfts,
        getERC721s,
    }
})();