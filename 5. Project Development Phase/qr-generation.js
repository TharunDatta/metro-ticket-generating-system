var metroQrDone = false;
function onSubmit() {
    var sysId = g_form.getUniqueValue();
    var dummyURL = 'https://example.com/ticket?id=' + sysId;
    var qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(dummyURL);
    spModal.open({
        title: "Your Metro QR Ticket — click Checkout once more to confirm",
        widget: "metro_qr_widget",
        widgetInput: { qr_url: qrImageUrl }
    }).then(function() {
        metroQrDone = true;
    });
    return false; // block only the first Checkout click
}
