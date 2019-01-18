const beforHead = `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name></x:Name><x:WorksheetOptions><x:Selected/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
  <style type="text/css">
      .td{ width: 84px; }
      .gdtjContainer .tb tr {text-align: center; vertical-align: middle;}
      .gdtjContainer .tb th {border-left: 0.5pt solid #000;border-bottom: 0.5pt solid #000;text-align: center;font-weight: normal;font-size: 10pt;vertical-align: middle;height:30px;}
      .gdtjContainer .header th{font-size: 12pt;}.gdtjContainer .tb tr th.noleftborder{border-left: none;}.gdtjContainer .tb tr th:last-child{border-right: 0.5pt solid #000;}
  </style>`
const afterHead = `</head><body><div class="gdtjContainer"><table class="tb" cellspacing="0" cellpadding="0" border="0" width="100%">`
const afterBody = `</table> </div> </body> </html>`

let htmlArr = []

function initHtmlArr (tableContent, styles) {
  htmlArr = []
  htmlArr.push(beforHead)
  if (styles) {
    htmlArr.push(styles)
  }
  htmlArr.push(afterHead)
  if (tableContent) {
    htmlArr.push(tableContent)
  } else {
    console.error('没有收到表体内容！')
  }
  htmlArr.push(afterBody)
  return htmlArr.join('')
}

let xlsPreview = function (tableContent, styles) {
  let iframe = document.createElement('iframe')
  iframe.style.visibility = 'hidden'
  iframe.style.height = 0
  document.getElementById('app').appendChild(iframe)
  iframe.id = 'printf'
  let f = document.getElementById('printf')
  f.contentDocument.write(initHtmlArr(tableContent, styles))
  f.contentDocument.close()
  f.contentWindow.print()
}
let xlsExport = function (tableContent, styles) {
  let uri = 'data:application/vnd.ms-excel;base64,'
  window.location.href = uri + window.btoa(unescape(encodeURIComponent(initHtmlArr(tableContent, styles))))
}

let getHtml = function (tableContent, styles) {
  return initHtmlArr(tableContent, styles)
}
/**
 * preview xlsExport 接受参数相同
 * (tableContent, styles)
 * tableContent 必填 表体内容
 * styles 可选
 * }
 */
export default { xlsPreview, xlsExport, getHtml }
