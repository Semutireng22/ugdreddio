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

    addressArray.forEach(address => {
        if (!isValidEthereumAddress(address)) {
            displayResult(`Alamat wallet tidak valid: ${address}`, 'error');
            return;
        }
    });

    addressArray.forEach(address => {
        checkInAddress(address)
            .then(response => {
                displayResult(`Check-in berhasil untuk ${address}.`, 'success');
            })
            .catch(error => {
                displayResult(`Gagal melakukan check-in untuk ${address}: ${error.message}`, 'error');
            });
    });
});

function isValidEthereumAddress(address) {
    // Basic validation for Ethereum address (starts with '0x' and has 42 characters)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function checkInAddress(address) {
    const url = `https://points-mainnet.reddio.com/v1/daily_checkin?wallet_address=${encodeURIComponent(address)}`;
    return fetch(url, {
        method: 'GET',
    }).then(response => response.json());
}

function displayResult(message, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = message;
    resultDiv.style.color = type === 'success' ? '#00ff00' : '#ff0000'; // Green for success, red for error
}
