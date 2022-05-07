const _modal = (() => {

    const _sendTx = async (tx) => {
        let popupClosed = false
        const txHash = await _web3Modal.sendTransaction(tx, () => {
            if (!popupClosed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Transaction mined',
                    html: `<p>Reloading page...</p><br><a href="https://rinkeby.etherscan.io/tx/${txHash}" target="_blank">View in block explorer</a>`,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                })
                setTimeout(() => {
                    location.reload()
                }, 1500)
            }
        })
        if (txHash) {
            Swal.fire({
                icon: 'info',
                title: 'Transaction sent',
                html: `<p><br>Transaction is pending.<br><br>You can keep this window open to autoreload page once transaction included.</p><a href="https://rinkeby.etherscan.io/tx/${txHash}" target="_blank">View in block explorer</a>`,
                allowOutsideClick: false,
                allowEscapeKey: false
            })
            .then(() => {
                popupClosed = true
            })
        }
    }

    const showNoWalletModal = () => {
        Swal.fire({
            title: 'No wallet connected',
            html: ''
            + '<p>Please connect a wallet to use this feature.</p>'
            + '<a id="connectWallet2" style="margin-top: 30px;" onclick="Swal.close(); _web3Modal.connect();" class="button-2 w-button">Connect Wallet</a>',
            confirmButtonText: 'Skip'
        })
    }

    const showCreateListingModal = async (selectedAccount, name, imgUrl, tokenAddress, tokenId) => {
        Swal.fire({
            title: `Create listing`,
            html: ''
            + `<p>${name}</p>`
            + `<div style="height: 300px; width: 100%; background-image: url(${imgUrl}); background-size: cover; background-position-y: center;"></div>`
            + '<p style="margin: 20px 0 0;">Enter rent price per one rental period in ETH:</p>',
            input: 'text',
            confirmButtonText: 'Confirm Listing',
            showDenyButton: true,
            denyButtonText: 'Cancel',
            denyButtonColor: '#6e7881',
            inputValidator: (value) => {
                if (!value) return 'You need to enter a rent price!'
                const rentPrice = parseFloat(value)
                if (isNaN(rentPrice)) return 'Please enter a valid number'
                if (rentPrice < 0) return 'Please enter a number > 0'
            }
        })
        .then(async (swalRes) => {
            if (swalRes.isDenied || swalRes.isDismissed) return
            const rentPrice = parseFloat(swalRes.value)
            
            const tx = _contract.getListTx(selectedAccount, tokenAddress, parseInt(tokenId), rentPrice)
            _sendTx(tx)
        })
    }

    const showEditPriceModal = async (selectedAccount, name, imgUrl, tokenAddress, tokenId) => {
        Swal.fire({
            title: `Edit price`,
            html: ''
            + `<p>${name}</p>`
            + `<div style="height: 300px; width: 100%; background-image: url(${imgUrl}); background-size: cover; background-position-y: center;"></div>`
            + '<p style="margin: 20px 0 0;">Enter new rent price per one rental period in ETH:</p>',
            input: 'text',
            confirmButtonText: 'Confirm new price',
            showDenyButton: true,
            denyButtonText: 'Cancel',
            denyButtonColor: '#6e7881',
            inputValidator: (value) => {
                if (!value) return 'You need to enter a rent price!'
                const rentPrice = parseFloat(value)
                if (isNaN(rentPrice)) return 'Please enter a valid number'
                if (rentPrice < 0) return 'Please enter a number > 0'
            }
        })
        .then(async (swalRes) => {
            if (swalRes.isDenied || swalRes.isDismissed) return
            const rentPrice = parseFloat(swalRes.value)
            
            const tx = _contract.getUpdatePriceTx(selectedAccount, tokenAddress, parseInt(tokenId), rentPrice)
            _sendTx(tx)
        })
    }

    const showEditListingModal = async (selectedAccount, name, imgUrl, tokenAddress, tokenId, paused, rentalExpiration) => {
        Swal.fire({
            title: `Edit Listing`,
            html: ''
            + `<p>${name}</p>`
            + `<div style="height: 300px; width: 100%; background-image: url(${imgUrl}); background-size: cover; background-position-y: center;"></div>`,
            confirmButtonText: `${paused ? 'Allow' : 'Disallow'} future rentals`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            showDenyButton: true,
            denyButtonText: 'Delete listing',
            preDeny: () => {
                if (parseInt(Date.now() / 1000) < Number(rentalExpiration)) {
                    Swal.showValidationMessage('Rental in progress, cannot delete listing')
                    return false
                }
            }
        })
        .then(async (swalRes) => {
            if (swalRes.isDismissed) return
            
            let tx
            if (swalRes.isConfirmed)
                tx = _contract.getPauseListingTx(selectedAccount, tokenAddress, parseInt(tokenId), !paused)
            else if (swalRes.isDenied)
                tx = _contract.getDeleteListingTx(selectedAccount, tokenAddress, parseInt(tokenId))

            _sendTx(tx)
        })
    }

    const showRentModal = (selectedAccount, name, imgUrl, tokenAddress, tokenId, price) => {
        Swal.fire({
            title: `Rent`,
            html: ''
            + `<p>${name}</p>`
            + `<div style="height: 300px; width: 100%; background-image: url(${imgUrl}); background-size: cover; background-position-y: center;"></div>`
            + '<p style="margin: 20px 0 0;">Enter number of rental periods:</p>',
            input: 'text',
            confirmButtonText: 'Confirm rent',
            showDenyButton: true,
            denyButtonText: 'Cancel',
            denyButtonColor: '#6e7881',
            inputValidator: (value) => {
                if (!value) return 'You need to enter a number of rental periods!'
                const nTimeUnits = parseFloat(value)
                if (isNaN(nTimeUnits)) return 'Please enter a valid number'
                if (nTimeUnits < 0) return 'Please enter a number > 0'
                if (parseInt(nTimeUnits) !== nTimeUnits) return 'Please enter a whole number'
            }
        })
        .then(async (swalRes) => {
            if (swalRes.isDenied || swalRes.isDismissed) return
            const nTimeUnits = parseFloat(swalRes.value)
            
            const tx = _contract.getRentTx(selectedAccount, tokenAddress, parseInt(tokenId), price, nTimeUnits)
            _sendTx(tx)
        })
    }

    const showExtendModal = (selectedAccount, name, imgUrl, tokenAddress, tokenId, price) => {
        Swal.fire({
            title: `Extend Rent`,
            html: ''
            + `<p>${name}</p>`
            + `<div style="height: 300px; width: 100%; background-image: url(${imgUrl}); background-size: cover; background-position-y: center;"></div>`
            + '<p style="margin: 20px 0 0;">Enter number of rental periods:</p>',
            input: 'text',
            confirmButtonText: 'Confirm extend rent',
            showDenyButton: true,
            denyButtonText: 'Cancel',
            denyButtonColor: '#6e7881',
            inputValidator: (value) => {
                if (!value) return 'You need to enter a number of rental periods!'
                const nTimeUnits = parseFloat(value)
                if (isNaN(nTimeUnits)) return 'Please enter a valid number'
                if (nTimeUnits < 0) return 'Please enter a number > 0'
                if (parseInt(nTimeUnits) !== nTimeUnits) return 'Please enter a whole number'
            }
        })
        .then(async (swalRes) => {
            if (swalRes.isDenied || swalRes.isDismissed) return
            const nTimeUnits = parseFloat(swalRes.value)
            
            const tx = _contract.getRentTx(selectedAccount, tokenAddress, parseInt(tokenId), price, nTimeUnits)
            _sendTx(tx)
        })
    }

    return {
        showNoWalletModal,
        showCreateListingModal,
        showEditPriceModal,
        showEditListingModal,
        showRentModal,
        showExtendModal,
    }
})();