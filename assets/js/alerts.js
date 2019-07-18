function errorAlert(msg) {
    return iziToast.show({
        title: 'Ops',
        message: msg,
        theme: 'dark',
        backgroundColor: '#f72a07',
        color: '#fff',
        icon: 'ti-close',
        position: 'bottomCenter',
    });
}

function successAlert(msg) {
    return iziToast.show({
        title: 'OK',
        message: msg,
        theme: 'dark',
        backgroundColor: '#15aa60',
        color: '#fff',
        icon: 'ti-check',
        position: 'topCenter'
    });
}