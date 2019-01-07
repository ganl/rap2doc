const files = require('./files');
const mkdirp = require('mkdirp');
const json2md = require('json2md');
import Tree from './Tree'

const toMd = (mode, json, target) => {
  return new Promise((resolve, reject) => {
    // console.log(files.getCurrentDirectoryBase())
    files.readJsonFile(json).then(response => {
      let obj = JSON.parse(response || {});
      parseModules(obj.data.modules, target);
      resolve()
    }).catch(err => {
      // new Error(client.statusText)
      reject(err)
    })
  })
}

const parseModules = (modules, target) => {
  modules.forEach(item => {
    let markdownModel = [];
    mkdirp(`${target}/${item.name}`, function (err) {
      if (err) {
        console.error(err)
        return false;
      }
      // modules name , description
      markdownModel.push(
        { h1: item.name || "" }
      )
      markdownModel.push(
        { p: item.description || "" }
      );
      
      item.interfaces.forEach(itf => {
        renderItfDoc(itf, markdownModel);
      })

      let mdFile = `${target}/${item.name}/index.md`;
      files.writeMdFile(mdFile, json2md(markdownModel))
    });
  })
  return true;
}

const renderItfDoc = (itf, markdownModel) => {
  markdownModel.push({ h2: itf.name || "" })
  markdownModel.push({ p: itf.description || "" })
  markdownModel.push({ h3: "URL" })
  markdownModel.push({ code: { "language": "txt", "content": `/${itf.url}` || "" } })
  markdownModel.push({ h3: "Method" })
  markdownModel.push({ code: { "language": "txt", "content": itf.method || "" } })
  renderReqDoc(itf.properties, markdownModel);
  renderResDoc(itf.properties, markdownModel);
}

const renderReqDoc = (properties, markdownModel) => {
  const request = processRequestProp(properties);
  // console.log(request, Tree.treeToJson(Tree.arrayToTree(request)))
  markdownModel.push({ h3: "Request" });
  renderTable(request, markdownModel);
}

const renderResDoc = (properties, markdownModel) => {
  const response = processResponseProp(properties);
  markdownModel.push({ h3: "Response" });
  renderTable(response, markdownModel);
}

const renderTable = (properties, markdownModel) => {
  const propTree = Tree.arrayToTree(properties);
  console.log();
  console.log();
  // console.log(Tree.treeToJson(propTree));
  console.log();
  console.log();
  let table = {
    headers: ['名称', '类型', 'Mock规则', '初始值', '简介']
  }
  let rows = []
  renderTableRow(propTree, rows)
  table.rows = rows;
  // console.log(table);
  markdownModel.push({table})
}

const renderTableRow = (element, rows) => {
  element.children && element.children.sort((a, b) => a.priority - b.priority).map(item => {
    let row = [
      item.name,
      item.type || 'String',
      item.rule || '',
      item.value || '',
      item.description || '',
    ]
    rows.push(row);
    if (item.children && item.children.length) {
      renderTableRow(item, rows)
    }
  })
}

const processProp = (properties, scope, pos = -1) => {
  let scopedProperties = properties.map(property => (Object.assign({}, property))).filter(property => property.scope === scope);
  if (scope === 'request' && pos > 0) {
    scopedProperties = scopedProperties.filter(s => s.pos === pos);
  }
  return scopedProperties;
}

const processRequestProp = (properties) => {
  return processProp(properties, 'request')
}

const processResponseProp = (properties) => {
  return processProp(properties, 'response')
}


// let obj = JSON.parse(data);
// let res = parseItems(obj);
// let dirName = obj.info.name;
// res.forEach(element => {
//   let outputPath = path.resolve(`${__dirname}/${dirName}/${element.path.replaceAll(" ", "_").toLowerCase()}.md`);
//   mkDirByPathSync(path.dirname(outputPath));
//   fs.writeFileSync(outputPath, element.data);
// });


module.exports = {
  toMd
}