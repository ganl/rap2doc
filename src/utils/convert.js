const files = require('./files');
const mkdirp = require('fs-extra');
const json2md = require('json2md');
import Tree from './Tree'

String.prototype.replaceAll = function (search, replacement) {
  return this.split(search).join(replacement);
}

const toMd = async (mode, json, target) => {
  await files.readJsonFile(json).then(async response => {
    let obj = JSON.parse(response || {});
    await parseModules(obj.data.modules, `${target}/${obj.data.name}`);
    Promise.resolve();
  }).catch(err => {
    // new Error(client.statusText)
    Promise.reject(err);
  })
}

const parseModules = async (modules, target) => {
  const dirOptions = {
    mode: 0o2775
  }
  mkdirp.emptyDirSync(target)
  // modules.forEach(async item => {
  for (let index = 0; index < modules.length; index++) {
    let markdownModel = [];
    let item = modules[index];
    let outputPath = `${target}`
    try {
      console.log();
      await mkdirp.ensureDir(outputPath, dirOptions)
      console.log(`convert module: ${item.name} ...`);
      // modules name , description
      markdownModel.push(
        { h1: item.name || "" }
      )
      markdownModel.push(
        { blockquote: item.description || "" }
      );

      item.interfaces.forEach(itf => {
        renderItfDoc(itf, markdownModel);
      })

      let mdFile = `${outputPath}/${item.name.replaceAll(' ', '_')}.md`;
      files.writeMdFile(mdFile, json2md(markdownModel));
      console.log('success!')
    } catch (err) {
      console.error(err)
      return false;
    }
  }
  // })
}

const renderItfDoc = (itf, markdownModel) => {
  markdownModel.push({ h2: itf.name || "" })
  markdownModel.push({ p: itf.description || "" })
  markdownModel.push({ h3: "URL" })
  itf.url && markdownModel.push({ code: { "language": "html", "content": itf.url.trim().substr(0, 1) !== '/' ? `/${itf.url}` : itf.url } })
  markdownModel.push({ h3: "Method" })
  markdownModel.push({ code: { "language": "html", "content": itf.method || "" } })
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
  let table = {
    headers: ['名称', '类型', '必选', '简介', 'Mock初始值', 'Mock规则']
  }
  let rows = []
  renderTableRow(propTree, rows, '')
  table.rows = rows;
  // console.log(table);
  markdownModel.push({table})
}

const renderTableRow = (element, rows, indent = '') => {
  element.children && element.children.sort((a, b) => a.priority - b.priority).map(item => {
    let requireLabel = (item.required === null || item.required === undefined) ? '' : (item.required === true ? '是' : '否')
    let row = [
      `${indent}${item.name}`,
      item.type || 'String',
      requireLabel,
      (item.description || '').replaceAll('\n', ' <br> '),
      (item.value || '').replaceAll('\n', ' <br> '),
      item.rule || ''
    ]
    rows.push(row);
    if (item.children && item.children.length) {
      renderTableRow(item, rows, `&nbsp;&nbsp;${indent}`)
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

module.exports = {
  toMd
}
