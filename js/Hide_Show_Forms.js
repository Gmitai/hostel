const forms = [
    "#mIframe0",
    "#mIframe1",
    "#mIframe2",
    "#mIframe3",
    "#mIframe4",
    "#mIframe5",
    "#mIframe6"
];
let frmId = 0;
let article_form_layer = document.querySelector(forms[0]);

function showForm(fId) {
    if (fId >= 0) {
        article_form_layer = document.querySelector(forms[fId]);
        if(article_form_layer){
            article_form_layer.style.display = "block";
            frmId = fId;
        }
    }
}

function closeIframe(fId)
{
    const frame = document.querySelector(forms[0]);
    if (frame) frame.style.display='none';
}

