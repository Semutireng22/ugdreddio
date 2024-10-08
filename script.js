document.getElementById('checkin-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const textarea = document.getElementById('wallet-addresses');
    const addresses = textarea.value.trim();

    if (addresses === '') {
        displayResult('Alamat wallet tidak boleh kosong.', 'error');
        return;
    }

    const addressArray = addresses.split(',').map(addr => addr.trim());

    if (addressArray.length === 0) {
        displayResult('Tidak ada alamat wallet yang valid.', 'error');
        return;
    }

    // Clear previous results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    addressArray.forEach(address => {
        if (!isValidEthereumAddress(address)) {
            displayResult(`Alamat wallet tidak valid: ${address}`, 'error');
            return;
        }

        checkInAddress(address)
            .then(response => {
                if (response.status === 'OK') {
                    const message = response.data && response.data.message ? response.data.message : 'Tidak ada pesan dari server';
                    displayResult(`Alamat wallet ${address}: ${message}`, 'success');
                } else {
                    displayResult(`Alamat wallet ${address}: ${response.error}`, 'error');
                }
            })
            .catch(error => {
                displayResult(`Alamat Wallet ${address} Melakukan Checkin`, 'error');
            });
    });
});

function isValidEthereumAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function checkInAddress(address) {
    const url = `https://points-mainnet.reddio.com/v1/daily_checkin?wallet_address=${encodeURIComponent(address)}`;
    return fetch(url, {
        method: 'GET', // Ganti menjadi 'GET' jika server tidak mendukung 'POST'
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error ${response.status}: ${text}`);
            });
        }
        return response.json();
    });
}

function displayResult(message, type) {
    const resultDiv = document.getElementById('result');
    const resultItem = document.createElement('p');
    resultItem.textContent = message;
    resultItem.style.color = type === 'success' ? '#00ff00' : '#ff0000'; // Green for success, red for error
    resultDiv.appendChild(resultItem);
}
