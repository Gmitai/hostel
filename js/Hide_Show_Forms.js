const forms = [
    "#mIframe0",
    "#mIframe1",
    "#mIframe2",
    "#mIframe3",
    "#mIframe4"
];
let frmId = 0;
let hostel_form_layer = document.querySelector(forms[frmId]);

function showForm(fId) {
    if (fId >= 0) {
        hostel_form_layer = document.querySelector(forms[fId]);
        if(hostel_form_layer){
            hostel_form_layer.style.display = "block";
            frmId = fId;
        }
    }
}

function closeIframe(fId){
    const frame = document.querySelector(forms[frmId]);
    if (frame) frame.style.display='none';
}

