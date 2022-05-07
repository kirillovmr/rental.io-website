(() => {

    const setLoading = () => {
        document.getElementById('noNftOverlay').style.display = 'none'
        document.getElementById('disconenctedOverlay').style.display = 'none'
        document.getElementById('conenctedOverlay').style.display = 'block'
        document.getElementById('loadingOverlay').style.display = 'block'
    }

    const retrieveAndRenderData = async (selectedAccount) => {
        const moralisNfts = await _moralis.getERC721s(selectedAccount)
        console.log('moralisNfts', moralisNfts)

        if (moralisNfts.length === 0) {
            document.getElementById('noNftOverlay').style.display = 'flex'
            document.getElementById('conenctedOverlay').style.display = 'block'
            document.getElementById('loadingOverlay').style.display = 'none'
            return
        }
        
        const [ moralisMetadatas, listingNftsData ] = await Promise.all([
            _erc721.retrieveTokenMetadataBatch( moralisNfts.map(v => [v.token_address, parseInt(v.token_id)]) ),
            _contract.getListingDataBatch( moralisNfts.map(v => [v.token_address, parseInt(v.token_id)]) ),
        ])
        console.log('moralisMetadatas', moralisMetadatas)
        console.log('listingNftsData', listingNftsData)

        const rentedByAddress = await _contract.getRentedByAddress(selectedAccount)
        console.log('rentedByAddress', rentedByAddress)
        
        const rentedByAddressMetadatas = await _erc721.retrieveTokenMetadataBatch( rentedByAddress.map(v => [v.tokenAddress, parseInt(v.tokenId)]) )
        console.log('rentedByAddressMetadatas', rentedByAddressMetadatas)

        // Display my nfts
        for (let i = 0; i < moralisNfts.length; i++) {
            if (listingNftsData[i].tokenAddress !== '0x0000000000000000000000000000000000000000') 
                continue

            const imgUrl = moralisMetadatas[i].image ? 
                (moralisMetadatas[i].image.includes('ipfs://') ? `https://gateway.moralisipfs.com/ipfs/${moralisMetadatas[i].image.replace('ipfs://', '')}` : moralisMetadatas[i].image)
                : '/img/placeholder-image.png'

            const div = document.createElement('div')
            div.classList.add('rent-card')
            const img = document.createElement('img')
            img.setAttribute('loading', 'lazy')
            img.setAttribute('width', '262')
            img.classList.add('image-8')
            img.src = imgUrl
            const h4 = document.createElement('h4')
            h4.classList.add('heading-8')
            h4.innerText = `${moralisNfts[i].name} #${moralisNfts[i].token_id}`
            const div2 = document.createElement('div')
            div2.classList.add('text-block-9')
            div2.innerText = moralisMetadatas[i].description
            const a = document.createElement('a')
            a.classList.add('button-2', 'long', 'w-button')
            a.innerText = 'List'
            a.addEventListener('click', () => {
                _modal.showCreateListingModal(_web3Modal.getSelectedAccount(), `${moralisNfts[i].name} #${moralisNfts[i].token_id}`, imgUrl, moralisNfts[i].token_address, moralisNfts[i].token_id)
            })
            div.append(img, h4, div2, a)
            document.getElementById('myNFTs').append(div)
        }

        // Display my listings
        for (let i = 0; i < moralisNfts.length; i++) {
            if (listingNftsData[i].tokenAddress === '0x0000000000000000000000000000000000000000') 
                continue

            const imgUrl = moralisMetadatas[i].image ? 
                (moralisMetadatas[i].image.includes('ipfs://') ? `https://gateway.moralisipfs.com/ipfs/${moralisMetadatas[i].image.replace('ipfs://', '')}` : moralisMetadatas[i].image)
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
            h4.innerText = `${moralisNfts[i].name} #${moralisNfts[i].token_id}`
            const div2 = document.createElement('div')
            div2.classList.add('text-block-9')
            div2.innerText = moralisMetadatas[i].description
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
            div6.classList.add('w-col', 'w-col-6')
            const a1 = document.createElement('a')
            a1.classList.add('button-2', 'long', 'w-button')
            a1.style.margin = '5px 0 20px 10px'
            a1.innerText = 'Edit price'
            a1.addEventListener('click', () => {
                _modal.showEditPriceModal(_web3Modal.getSelectedAccount(), `${moralisNfts[i].name} #${moralisNfts[i].token_id}`, imgUrl, moralisNfts[i].token_address, moralisNfts[i].token_id)
            })
            div6.append(a1)

            const div7 = document.createElement('div')
            div7.classList.add('w-col', 'w-col-6')
            const a2 = document.createElement('a')
            a2.classList.add('button-2', 'long', 'w-button')
            a2.style.margin = '5px 10px 20px 0'
            a2.style.backgroundImage = 'linear-gradient(121deg, #b1d26f, #60b8e7)'
            a2.innerText = 'Edit'
            a2.addEventListener('click', () => {
                _modal.showEditListingModal(_web3Modal.getSelectedAccount(), `${moralisNfts[i].name} #${moralisNfts[i].token_id}`, imgUrl, moralisNfts[i].token_address, moralisNfts[i].token_id, listingNftsData[i].paused, listingNftsData[i].rentalExpiration)
            })
            div7.append(a2)
            div5.append(div6, div7)

            div.append(img, h4, div2, ol, div5)
            document.getElementById('myListings').append(div)
        }

        // Display my rentals
        for (let i = rentedByAddress.length - 1; i >= 0; i--) {
            const imgUrl = rentedByAddressMetadatas[i].image ? 
                (rentedByAddressMetadatas[i].image.includes('ipfs://') ? `https://gateway.moralisipfs.com/ipfs/${rentedByAddressMetadatas[i].image.replace('ipfs://', '')}` : rentedByAddressMetadatas[i].image)
                : '/img/placeholder-image.png'

            const isEnded = parseInt(Date.now() / 1000) > Number(rentedByAddress[i].rentalExpiration)

            const div = document.createElement('div')
            div.classList.add('rent-card')
            const img = document.createElement('img')
            img.setAttribute('loading', 'lazy')
            img.setAttribute('width', '262')
            img.classList.add('image-8')
            img.src = imgUrl
            const h4 = document.createElement('h4')
            h4.classList.add('heading-8')
            h4.innerText = `${rentedByAddressMetadatas[i].name}`
            const div2 = document.createElement('div')
            div2.classList.add('text-block-9')
            div2.innerText = rentedByAddressMetadatas[i].description
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
            div3.append(img2, document.createTextNode(` ${Number(rentedByAddress[i].price) / 10 ** 18}`))
            li1.append(div3)
            const li2 = document.createElement('li')
            li2.classList.add('list-item-4')
            const div4 = document.createElement('div')
            div4.classList.add('text-block-11')
            div4.innerText = `${new Date(Number(rentedByAddress[i].rentalExpiration) * 1000).toLocaleString()}${isEnded ? ' (expired)' : ''}`
            div4.style.color = '#333'
            li2.append(div4)
            ol.append(li1, li2)

            const div5 = document.createElement('div')
            div5.classList.add('w-row')

            const div6 = document.createElement('div')
            div6.classList.add('w-col', 'w-col-12')
            const a1 = document.createElement('a')
            a1.classList.add('button-2', 'long', 'w-button')
            a1.style.margin = '5px 10px 20px 10px'
            a1.innerText = isEnded ? 'Rent again' : 'Extend'
            a1.addEventListener('click', async () => {
                if (isEnded) {
                    if (rentedByAddress[i].paused) {
                        return Swal.fire({
                            title: 'Rent Unavailable',
                            text: 'Rental is paused',
                        })
                    }
                    _modal.showRentModal(_web3Modal.getSelectedAccount(), rentedByAddressMetadatas[i].name, imgUrl, rentedByAddress[i].tokenAddress, rentedByAddress[i].tokenId, rentedByAddress[i].price)
                }
                else {
                    if (rentedByAddress[i].paused) {
                        return Swal.fire({
                            title: 'Extend Unavailable',
                            text: 'Rental is paused',
                        })
                    }
                    _modal.showExtendModal(_web3Modal.getSelectedAccount(), rentedByAddressMetadatas[i].name, imgUrl, rentedByAddress[i].tokenAddress, rentedByAddress[i].tokenId, rentedByAddress[i].price)
                }
            })
            div6.append(a1)
            div5.append(div6)

            div.append(img, h4, div2, ol, div5)
            document.getElementById('myRentals').append(div)
        }


        document.getElementById('conenctedOverlay').style.display = 'block'
        document.getElementById('loadingOverlay').style.display = 'none'
    }

    const onAccount = async (selectedAccount) => {
        setLoading()

        document.getElementById('loadingWallet').style.display = 'none'
        document.getElementById('connectWallet').style.display = 'none'
        document.getElementById('disconnectWallet').style.display = 'inline-block'

        document.getElementById('disconenctedOverlay').style.display = 'none'
        document.getElementById('conenctedOverlay').style.display = 'none'

        document.getElementById('connectedWallet').style.display = 'block'
        document.getElementById('connectedWallet').innerHTML = selectedAccount.slice(0, 6) + ' ... ' + selectedAccount.slice(selectedAccount.length - 4, selectedAccount.length)

        retrieveAndRenderData(selectedAccount)
    }

    const onDisconnect = () => {
        document.getElementById('loadingWallet').style.display = 'none'
        document.getElementById('connectWallet').style.display = 'inline-block'
        document.getElementById('disconnectWallet').style.display = 'none'

        document.getElementById('disconenctedOverlay').style.display = 'flex'
        document.getElementById('conenctedOverlay').style.display = 'none'
        document.getElementById('loadingOverlay').style.display = 'none'

        document.getElementById('connectedWallet').style.display = 'none'

        document.getElementById('myNFTs').innerHTML = ''
        document.getElementById('myListings').innerHTML = ''
        document.getElementById('myRentals').innerHTML = ''
    }

    window.addEventListener('load', async () => {
        _web3Modal.setOnAccount(onAccount.bind(this))
        _web3Modal.setOnDisconnect(onDisconnect.bind(this))

        document.getElementById('connectWallet').addEventListener('click', _web3Modal.connect)
        document.getElementById('connectWallet2').addEventListener('click', _web3Modal.connect)
        document.getElementById('disconnectWallet').addEventListener('click', _web3Modal.disconnect)

        if (_storage.get(_storage.keys.AUTHENTICATED)) {
            _web3Modal.connect()
        }
        else {
            onDisconnect()
        }
    })
})();