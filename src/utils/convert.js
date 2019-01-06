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
      // console.log(json2md(markdownModel))
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
  console.log(request, Tree.treeToJson(Tree.arrayToTree(request)))
}

const renderResDoc = (properties, markdownModel) => {

}

const processProp = (properties, scope, pos = -1) => {
  let scopedProperties = properties.map(property => ({ ...property })).filter(property => property.scope === scope);
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

const parseJson = () => {

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