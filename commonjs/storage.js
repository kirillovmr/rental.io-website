const _storage = (() => {

    const prefix = '_storage_'
    
    const keys = {
        AUTHENTICATED: 'authenticated',
    }

    const types = {
        [keys.AUTHENTICATED]: 'boolean',
    }

    const get = (key) => {
        if (!(key in types)) return null

        const val = localStorage.getItem(prefix + key)
        
        if (types[key] === 'boolean') {
            return val === 'true'
        }
    }

    const set = (key, val) => {
        if (!(key in types)) return

        localStorage.setItem(prefix + key, val)
    }

    return {
        keys,
        get,
        set,
    }
})();