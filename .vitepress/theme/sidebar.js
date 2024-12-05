const fs = require('fs');
const path = require('path');

const { generateVersions } = require('./versions.js')
const { defaultVersion, versions } = generateVersions()

const langs = ['zh', 'en']

 // 所有版本和语言的指南结构
let sidebar = {};

// 从外部 json 导入数据
const rawData = fs.readFileSync(path.resolve(__dirname, 'sidebar.json'));
// 定义每个类别及其子项的映射
const categoryMappings = JSON.parse(rawData);

// 函数来生成特定语言和版本的指南结构
function generateSidebar(pathPrefix, language, version) {
    lst = [];

    // 如果传入的 version 为空字符串，显示默认版本
    if (version == '') {
        version = defaultVersion
    }

    for (const category in categoryMappings[language][version]) {
        const items = [];
        Object.entries(categoryMappings[language][version][category]).forEach(([itemName, link]) => {
            // 检测 md 文件是否存在。
            const fullFilePath = path.join(path.dirname(path.dirname(__dirname)), `${pathPrefix}${link}`);
            if (fs.existsSync(fullFilePath)) {
                items.push({
                    text: itemName,
                    link: `${pathPrefix}${link}`
                });
            }
        });

        lst.push({
            collapsible: true,
            text: category,
            items: items
        });
    }
    return lst;
}


versions.forEach(version => {
    langs.forEach(language => {
        const versionPrefix = version ? `${version}/` : '';
        const pathPrefix = language === 'zh'
            ? `/${versionPrefix}guide`
            : `/${versionPrefix}${language}/guide`;

        sidebar[pathPrefix] = generateSidebar(pathPrefix, language, version);
    });

});

exports.sidebar = sidebar
