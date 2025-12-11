document.getElementById('eventForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    try {
        const response = await fetch('/dutyAddInfo',{
            method: 'POST',
            body: formData
        });
        console.log('before alert');
        if (response.ok) {
            window.parent.closeIframe(getFrmId());
            alert('Маьлумотҳо бо муваффақият сабт шуданд.');

        }
        console.log('after alert');
    }
    catch (error) {
        alert('Хатогӣ хангомӣ сабт: ' + error.message);
    }
});