(() => {
    const retrieveAndRenderData = async (tokenAddress, tokenId) => {
        let [listing, rentalHistory, metadata] = await Promise.all([
            _contract.getListing(tokenAddress, tokenId),
            _contract.getRentalHistory(tokenAddress, tokenId),
            _erc721.retrieveTokenMetadata(tokenAddress, tokenId),
        ])

        console.log('listing', listing)
        console.log('rentalHistory', rentalHistory)
        console.log('metadata', metadata)

        const imgUrl = metadata.image ? 
            (metadata.image.includes('ipfs://') ? `https://gateway.moralisipfs.com/ipfs/${metadata.image.replace('ipfs://', '')}` : metadata.image)
            : '/img/placeholder-image.png'

        const activeState = listing.paused ? 'PAUSED' : parseInt(Date.now() / 1000) < Number(listing.rentalExpiration) ? 'INRENT' : 'AVAILABLE'

        document.getElementById('nftImage').src = imgUrl

        document.getElementById('nftName').innerHTML = metadata.name
        document.getElementById('nftDescription').innerHTML = metadata.description
        document.getElementById('nftPrice').innerHTML = Number(listing.price / 10 ** 18)

        document.getElementById('nftAvailability').innerHTML = `${activeState === 'AVAILABLE' ? 'Now' : activeState === 'INRENT' ? new Date(Number(listing.rentalExpiration) * 1000).toLocaleString() : 'Unknown (paused)'}`

        // TODO
        if (activeState === 'AVAILABLE') {
            document.getElementById('nftRentBtn').innerHTML = 'Rent'
        }
        else if (activeState === 'INRENT' && listing.rentedBy === _web3Modal.getSelectedAccount()) {
            document.getElementById('nftRentBtn').innerHTML = 'Extend'
        } else {
            document.getElementById('nftRentBtn').innerHTML = 'Unavailable'
        }

        document.getElementById('nftRentBtn').onclick = () => {
            const selectedAccount = _web3Modal.getSelectedAccount()
            if (!selectedAccount) {
                _modal.showNoWalletModal()
            }

            if (activeState === 'AVAILABLE') {
                _modal.showRentModal(selectedAccount, metadata.name, imgUrl, tokenAddress, tokenId, listing.price)
            }

            if (activeState === 'INRENT' && listing.rentedBy === _web3Modal.getSelectedAccount()) {
                _modal.showExtendModal(selectedAccount, metadata.name, imgUrl, tokenAddress, tokenId, listing.price)
            }
        }

        document.getElementById('nftContractAddress').innerHTML = tokenAddress.slice(0, 12) + ' ... ' + tokenAddress.slice(-8)
        document.getElementById('nftContractAddress').href = `https://rinkeby.etherscan.io/address/${tokenAddress}`
        document.getElementById('nftTokenId').innerHTML = tokenId
        document.getElementById('nftTokenStandard').innerHTML = 'ERC-721'
        document.getElementById('nftBlockchain').innerHTML = 'Ethereum'
        document.getElementById('nftMetdata').innerHTML = 'View on IPFS'
        document.getElementById('nftMetdata').href = metadata.url
        
        document.getElementById('nftPHevent').innerHTML = ''
        document.getElementById('nftPHprice').innerHTML = ''
        document.getElementById('nftPHfrom').innerHTML = ''
        document.getElementById('nftPHto').innerHTML = ''
        document.getElementById('nftPHduration').innerHTML = ''

        for (let i = rentalHistory.length - 1; i >= 0; i--) {
            const div1 = document.createElement('div')
            const div2 = document.createElement('div')
            const a3 = document.createElement('a')
            const a4 = document.createElement('a')
            const div5 = document.createElement('div')
            div1.classList.add('text-block-15')
            div2.classList.add('text-block-15')
            a3.classList.add('text-block-15')
            a4.classList.add('text-block-15')
            div5.classList.add('text-block-15')

            div1.innerHTML = 'Rent'
            div2.innerHTML = Number(rentalHistory[i].price / 10 ** 18) + ' ETH'
            a3.innerHTML = rentalHistory[i].rentedFrom.slice(0, 10) + ' ... ' + rentalHistory[i].rentedFrom.slice(-8)
            a3.href = `https://rinkeby.etherscan.io/address/${rentalHistory[i].rentedFrom}`
            a3.setAttribute('target', '_blank')
            a3.style.display = 'block'
            a4.innerHTML = rentalHistory[i].rentedBy.slice(0, 10) + ' ... ' + rentalHistory[i].rentedBy.slice(-8)
            a4.href = `https://rinkeby.etherscan.io/address/${rentalHistory[i].rentedBy}`
            a4.setAttribute('target', '_blank')
            a4.style.display = 'block'
            div5.innerHTML = new Date(rentalHistory[i].timestamp * 1000).toLocaleString()

            document.getElementById('nftPHevent').appendChild(div1)
            document.getElementById('nftPHprice').appendChild(div2)
            document.getElementById('nftPHfrom').appendChild(a3)
            document.getElementById('nftPHto').appendChild(a4)
            document.getElementById('nftPHduration').appendChild(div5)
        }

        document.getElementById('listingLoadingBlock').style.display = 'none'
        if (listing.tokenAddress === '0x0000000000000000000000000000000000000000') {
            document.getElementById('listingDoesNotExistBlock').style.display = 'block'
        }
        else {
            document.getElementById('listingExistsBlock').style.display = 'block'
        }

        const ctx = document.getElementById('nftPriceHistoryChart').getContext('2d')
        const historyChart = new Chart(ctx, {
            type: 'line',
            // data: rentalHistory.map(v => Number(v.price)),
            data: {
                labels: rentalHistory.map(v => new Date(v.timestamp * 1000).toLocaleString()),
                datasets: [{
                    data: rentalHistory.map(v => Number(v.price / 10 ** 18)),
                    borderColor: '#37d937',
                    fill: false,
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4
                }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                    display: false
                }
              },
              interaction: {
                intersect: false,
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true
                  }
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'ETH Price'
                  },
                }
              }
            },
        });
    }

    const onAccount = async (selectedAccount) => {
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

        document.getElementById('nftPriceHistoryBlock').style.height = document.getElementById('nftDetailsBlock').offsetHeight + 'px'
        document.getElementById('nftPriceHistoryChart').setAttribute('height', parseInt(document.getElementById('nftDetailsBlock').offsetHeight) - 20)
        document.getElementById('nftPriceHistoryChart').setAttribute('width', parseInt(document.getElementById('nftPriceHistoryBlock').offsetWidth) - 40)

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        })
        const tokenAddress = params.tokenAddress
        const tokenId = params.tokenId
        const prev = params.prev

        if (prev) {
            document.getElementById('backLink').href = prev
        }

        retrieveAndRenderData(tokenAddress, tokenId)

        if (_storage.get(_storage.keys.AUTHENTICATED)) {
            _web3Modal.connect()
        }
        else {
            onDisconnect()
        }
    })
})();
