var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')

//============================== 开发设置 =================================================//
let baseSet = {
  staticDirPathName: 'F:\\CMPP2019001_dev_instai-manage-console\\webapp\\',
  apiHost: 'instai.instai.test', apiPort: 80,  // 测试环境
  // apiHost: '192.168.1.139', apiPort: '8080',  // 彭勇镇
  // apiHost: '192.168.1.132', apiPort: '8080',  // 黄威
  serverPort: 8090, // 无限制
  serverHost: '192.168.1.183', // 无限制
  defaultHomPage: 'main.html',
  serverStatic: [] // 服务端静态文件位置
}
//======================================================================================//
// 使用：该文件目录下 打开命令窗口 执行> node dev_server.js 即可
// 调试：vscode打开文件 F5 打开断点即可调试
// 最新修改日期：20190118
//======================================================================================//


var server = http.createServer(function (brReq, brRes) {
  var brResBody = ''
  brReq.on("data", function (data) { brResBody += data })
  brReq.on('end', function () {
    // 肯定是ajax call api // 否则 先按照静态文件查找 如果404 再 call api
    if (brReq.headers['x-requested-with'] == "XMLHttpRequest") {
      corsRequest(brReq, brRes, brResBody)
    } else {
      staticRoot(brReq, brRes, brResBody)
    }
  });
})
server.listen(baseSet.serverPort, baseSet.serverHost)
console.log(`Server running at ${baseSet.serverHost + ':' + baseSet.serverPort}`)

/**
 * 响应api接口
 * @param {*} preq 
 * @param {*} pres 
 * @param {*} pbody 
 */
function corsRequest(preq, pres, pbody) {
  let requestHaders = Object.assign({}, preq.headers)
  delete requestHaders.connection
  delete requestHaders['content-length']
  delete requestHaders.host
  let path = checkPath(preq)
  console.log(path)
  var options = {
    host: baseSet.apiHost,
    port: baseSet.apiPort,
    path: path,
    method: preq.method,
    headers: requestHaders
  };
  var req = http.request(options, (res) => {
    console.error(`request statusCode:${res.statusCode}`);
    var childBody = '';
    res.on('data', (cont) => { childBody += cont; });
    res.on('end', () => {
      pres.writeHead(res.statusCode, res.headers);
      pres.write(childBody);
      pres.end();
    })
    res.on('error', (e) => {
      console.log(`返回错误: ${e.message}`);
    });
  });
  req.on('error', (e) => { console.log(`请求错误: ${e.message}`); });
  pbody && (req.write(pbody))
  req.end();
}

/**
 * 查找静态资源
 * @param {*} req 
 * @param {*} res 
 */
function staticRoot(req, res, brResBody) {
  let relativePath = checkPath(req)
  var filePath = null
  filePath = path.join(baseSet.staticDirPathName, relativePath)
  fs.readFile(filePath, 'binary', function (err, fileContent) {
    if (err) {
      corsRequest(req, res, brResBody)
    } else {
      res.writeHead(200, 'okay')
      res.write(fileContent, 'binary')
      res.end()
    }
  })
}

/**
 * 
 * @param {*} req 处理请求接口
 * 
 *  baseSet.serverHost 决定了api接口路径，去除规则根据webapp\Main\js\main.js 决定
 * 前端本地环境"//server"
 *  "../phpport/index.php/Index/one?"; "../phpport/index.php/Index/two?";
 * 207测试环境 "//192.168.1.207") 
 *  "../";
 * 测试环境 "//192" 
 *  "../instai-manage-console/";
 * 后端本地环境 '//localhost'
 * "../instai-manage-console/";
 * 生产环境  "../";
 * 
 */
function checkPath(req) {
  var oPath = url.parse(req.url, true).pathname;
  let cIdx = -1
  let nPath = oPath
  const a = oPath.indexOf('/instai-manage-console') // 192 开头 或 localhost 
  const b = oPath.indexOf('/phpport/index.php/Index/one') //  server开头
  const c = oPath.indexOf('/phpport/index.php/Index/two') //  server开头
  if (a !== -1) {
    nPath = oPath.slice(a + ('/instai-manage-console').length)
  }
  if (c !== -1 || b !== -1) {
    nPath = '/' + req.url.slice(req.url.indexOf('?') + 1)
  }
  return nPath
}
