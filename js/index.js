(() => {
    
    const onAccount = () => {
        location.href = "/dashboard.html";
    }

    window.addEventListener('load', async () => {
        _web3Modal.setOnAccount(onAccount.bind(this))

        document.getElementById('connectWallet').addEventListener('click', _web3Modal.connect)
    
        // if (_storage.get(_storage.keys.AUTHENTICATED)) {
        //     _web3Modal.connect()
        // }
        // else {
        //     onDisconnect()
        // }
    })
})();