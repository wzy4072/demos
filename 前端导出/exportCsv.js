
function csvExport(str) {
    var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = "export.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
export default csvExport
