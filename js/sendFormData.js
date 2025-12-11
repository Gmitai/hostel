document.getElementById('eventForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    try {
        const response = await fetch('/dutyAddInfo',{
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Маьлумотҳо бо муваффақият сабт шуданд.');
        }
    }
    catch (error) {
        alert('Хатогӣ хангомӣ сабт: ' + error.message);
    }
});