/* eslint-disable */
(function(_0x2f1d, _0x39a8) {
    const _0x4c = function(_0x3d) {
        const _0x2c = '0123456789abcdef';
        let _0x1f = '';
        for (let i = 0; i < _0x3d.length; i++) {
            _0x1f += _0x2c[((_0x3d[i] >>> 4) & 0xF)] + _0x2c[(_0x3d[i] & 0xF)];
        }
        return _0x1f;
    };
    
    const _0x5e = {
        _k: null,
        set: function(v) { this._k = v; },
        get: function() { return this._k; }
    };

    const _0x6f = {
        _0x1: 'http://localhost:3000',
        _0x2: '/public/licenses/check-license',
        _0x3: '/core.js',
        _0x4: 'Invalid license. Theme functionality is disabled.',
        _0x5: 'Content-Type',
        _0x6: 'application/json'
    };

    const _0x7d = function(s) {
        return s.split('').map(c => c.charCodeAt(0) + 1).map(n => String.fromCharCode(n)).join('');
    };

    const _0x8e = function(s) {
        return s.split('').map(c => c.charCodeAt(0) - 1).map(n => String.fromCharCode(n)).join('');
    };

    // Anti-debugging
    const _0x9f = function() {
        const start = Date.now();
        debugger;
        return Date.now() - start > 100;
    };

    // Anti-tampering check
    const _0xa1 = function() {
        const originalFunc = Function.prototype.toString;
        let tampered = false;
        Object.defineProperty(Function.prototype, 'toString', {
            value: function() {
                tampered = true;
                return originalFunc.apply(this, arguments);
            },
            writable: false
        });
        return tampered;
    };

    const _0xb2 = function() {
        if (_0x9f() || _0xa1()) {
            return false;
        }
        return true;
    };

    const _0xc3 = function() {
        const styles = document.createElement('style');
        styles.textContent = '* { display: none !important; }';
        document.head.appendChild(styles);
        document.body.innerHTML = _0x8e(_0x7d(_0x6f._0x4));
    };

    const _0xd4 = function(u) {
        const s = document.createElement('script');
        s.src = u;
        document.head.appendChild(s);
    };

    const _0xe5 = async function() {
        if (!_0xb2()) {
            _0xc3();
            return;
        }

        try {
            const response = await fetch(_0x6f._0x1 + _0x6f._0x2, {
                method: 'POST',
                headers: {
                    [_0x6f._0x5]: _0x6f._0x6
                },
                body: JSON.stringify({
                    domain: _0x2f1d.location.hostname,
                    token: _0x4c(new Uint8Array([Date.now()]))
                })
            });

            if (response.ok) {
                const data = await response.json();
                _0x5e.set(data.valid);
                
                if (data.valid) {
                    _0xd4(_0x6f._0x1 + _0x6f._0x3);
                } else {
                    _0xc3();
                }
            } else {
                _0xc3();
            }
        } catch (e) {
            _0xc3();
        }
    };

    // Initialize with multiple control flows to confuse analysis
    (function() {
        const paths = [_0xe5, _0xc3];
        const index = _0xb2() ? 0 : 1;
        paths[index]();
    })();
})(window, document);
