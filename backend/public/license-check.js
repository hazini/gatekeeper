(function() {
    async function checkLicense() {
        try {
            const domain = window.location.hostname;
            const response = await fetch('http://localhost:3000/license/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ domain })
            });

            if (!response.ok) {
                throw new Error('License validation failed');
            }

            const data = await response.json();
            
            if (data.valid) {
                // Load core.js only if license is valid
                const script = document.createElement('script');
                script.src = 'http://localhost:3000/core.js';
                document.head.appendChild(script);
            } else {
                console.error('Invalid license for this domain');
            }
        } catch (error) {
            console.error('License validation error:', error);
        }
    }

    // Run license check immediately
    checkLicense();
})();
