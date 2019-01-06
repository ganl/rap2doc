const inquirer = require('inquirer');

module.exports = {
  askSourceEndpoint: () => {
    const questions = [
      {
        name: 'url_path',
        type: 'input',
        message: 'Enter rap2\'s json schema file or url:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter rap2\'s json schema file or url.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
}
