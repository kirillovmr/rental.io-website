(() => {
    const retrieveAndRenderData = async () => {

        const listingNftsData = await _contract.getListings()
        console.log('listingNftsData', listingNftsData)

        const metadatas = await _erc721.retrieveTokenMetadataBatch(listingNftsData.map(v => [v.tokenAddress, v.tokenId]))
        console.log('metadatas', metadatas)

        for (let i = 0; i < listingNftsData.length; i++) {
            const imgUrl = metadatas[i].image ? 
                (metadatas[i].image.includes('ipfs://') ? `https://gateway.moralisipfs.com/ipfs/${metadatas[i].image.replace('ipfs://', '')}` : metadatas[i].image)
                : '/img/placeholder-image.png'

            const activeState = listingNftsData[i].paused ? 'PAUSED' : parseInt(Date.now() / 1000) < Number(listingNftsData[i].rentalExpiration) ? 'INRENT' : 'AVAILABLE'

            const div = document.createElement('div')
            div.classList.add('rent-card')
            const img = document.createElement('img')
            img.setAttribute('loading', 'lazy')
            img.setAttribute('width', '262')
            img.classList.add('image-8')
            img.src = imgUrl
            const h4 = document.createElement('h4')
            h4.classList.add('heading-8')
            const a = document.createElement('a')
            a.href = `/view.html?tokenAddress=${listingNftsData[i].tokenAddress}&tokenId=${listingNftsData[i].tokenId}&prev=${location.href}`
            a.style.margin = '0'
            a.setAttribute('target', '_blank')
            a.innerHTML = metadatas[i].name
            h4.append(a)
            const div2 = document.createElement('div')
            div2.classList.add('text-block-9')
            div2.innerText = metadatas[i].description
            const ol = document.createElement('ol')
            ol.setAttribute('role', 'list')
            ol.classList.add('list-3', 'w-list-unstyled')
            const li1 = document.createElement('li')
            const div3 = document.createElement('div')
            div3.classList.add('text-block-10')
            const img2 = document.createElement('img')
            img2.style.paddingBottom = '3px'
            img2.style.width = '8px'
            img2.src = '/img/eth.svg'
            div3.append(img2, document.createTextNode(` ${Number(listingNftsData[i].price) / 10 ** 18}`))
            li1.append(div3)
            const li2 = document.createElement('li')
            li2.classList.add('list-item-4')
            const div4 = document.createElement('div')
            div4.classList.add('text-block-11')
            div4.innerText = `${activeState === 'AVAILABLE' ? 'Available' : activeState === 'INRENT' ? new Date(Number(listingNftsData[i].rentalExpiration) * 1000).toLocaleString() : 'Paused'}`
            div4.style.color = activeState === 'AVAILABLE' ? 'green' : activeState === 'INRENT' ? '#333' : 'red'
            li2.append(div4)
            ol.append(li1, li2)

            const div5 = document.createElement('div')
            div5.classList.add('w-row')

            const div6 = document.createElement('div')
            div6.classList.add('w-col', 'w-col-12')
            const a1 = document.createElement('a')
            a1.classList.add('button-2', 'long', 'w-button')
            a1.style.margin = '5px 10px 20px 10px'
            a1.innerText = activeState !== 'AVAILABLE' ? 'View' : 'Rent'
            a1.addEventListener('click', async () => {
                if (activeState === 'AVAILABLE') {
                    const selectedAccount = _web3Modal.getSelectedAccount()
                    if (!selectedAccount) {
                        return _modal.showNoWalletModal()
                    }

                    _modal.showRentModal(selectedAccount, metadatas[i].name, imgUrl, listingNftsData[i].tokenAddress, listingNftsData[i].tokenId, listingNftsData[i].price)
                }
                else {
                    location.href = `/view.html?tokenAddress=${listingNftsData[i].tokenAddress}&tokenId=${listingNftsData[i].tokenId}&prev=${location.href}`
                }
            })
            div6.append(a1)
            div5.append(div6)

            div.append(img, h4, div2, ol, div5)
            document.getElementById('data').append(div)
        }

        document.getElementById('conenctedOverlay').style.display = 'block'
        document.getElementById('loadingOverlay').style.display = 'none'
    }
    
    const onAccount = async (selectedAccount, chainData) => {
        document.getElementById('wrongNetworkBlock').style.display = 'none'
        if (chainData.chainId !== 4) {
            document.getElementById('wrongNetworkBlock').style.display = 'block'
        }

        document.getElementById('loadingWallet').style.display = 'none'
        document.getElementById('connectWallet').style.display = 'none'
        document.getElementById('disconnectWallet').style.display = 'inline-block'

        document.getElementById('connectedWallet').style.display = 'block'
        document.getElementById('connectedWallet').innerHTML = selectedAccount.slice(0, 6) + ' ... ' + selectedAccount.slice(selectedAccount.length - 4, selectedAccount.length)
    }

    const onDisconnect = async () => {
        document.getElementById('loadingWallet').style.display = 'none'
        document.getElementById('connectWallet').style.display = 'inline-block'
        document.getElementById('disconnectWallet').style.display = 'none'

        document.getElementById('connectedWallet').style.display = 'none'
    }

    window.addEventListener('load', async () => {
        _web3Modal.setOnAccount(onAccount.bind(this))
        _web3Modal.setOnDisconnect(onDisconnect.bind(this))

        document.getElementById('connectWallet').addEventListener('click', _web3Modal.connect)
        document.getElementById('disconnectWallet').addEventListener('click', _web3Modal.disconnect)
        document.getElementById('wrongNetworkBlock').addEventListener('click', _web3Modal.switchNetwork)

        retrieveAndRenderData()
    
        if (_storage.get(_storage.keys.AUTHENTICATED)) {
            _web3Modal.connect()
        }
        else {
            onDisconnect()
        }
    })
})();