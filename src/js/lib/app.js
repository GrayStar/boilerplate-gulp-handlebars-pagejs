window.onload = function () {
    page('/', function () {
        document.body.innerHTML = home();
    });
    page('/secondary', function () {
        document.body.innerHTML = secondary();
    });
    page('*', function () {
        document.body.innerHTML = 'not found';
    });
    page();
};