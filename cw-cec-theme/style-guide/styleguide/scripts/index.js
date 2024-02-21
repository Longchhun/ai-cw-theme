
let btnQuickPost = document.getElementById('quickPost');
if (btnQuickPost) {
    btnQuickPost.classList.add('d-none');
}
function showPopup() {
    document.getElementById('quickPost').classList.remove('d-none');
}

function hidePopup() {
    document.getElementById('quickPost').classList.add('d-none');
}

jQuery('#btnAlert').on('click', function() {
    jQuery('.alert').addClass('alert-fade-in-out');
});