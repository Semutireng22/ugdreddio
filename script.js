document.getElementById('checkin-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const textarea = document.getElementById('wallet-addresses');
    const addresses = textarea.value.split(',').map(addr => addr.trim());

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    for (let address of addresses) {
        if (address) {
            try {
                const response = await fetch(`https://points-mainnet.reddio.com/v1/daily_checkin?wallet_address=${encodeURIComponent(address)}`, {
                    method: 'POST',
                });

                if (response.ok) {
                    const data = await response.json();
                    resultDiv.innerHTML += `<p>Success for wallet: ${address}</p>`;
                } else {
                    resultDiv.innerHTML += `<p>Failed for wallet: ${address}</p>`;
                }
            } catch (error) {
                resultDiv.innerHTML += `<p>Error for wallet: ${address} - ${error.message}</p>`;
            }
        }
    }
});
