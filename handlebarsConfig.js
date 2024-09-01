const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const viewsPath = path.join(__dirname, 'views');

function compileTemplate(templateName) {
    const filePath = path.join(viewsPath, `${templateName}.hbs`);
    const templateSource = fs.readFileSync(filePath, 'utf8');
    return handlebars.compile(templateSource);
}

module.exports = {
    compileTemplate
};
