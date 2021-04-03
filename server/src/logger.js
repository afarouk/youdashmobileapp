const colors = require('colors/safe');

module.exports = {
  log: (msg, level = 0, color_over) => {
    // level 1: debug, 2: info, 3: warn, 4: error
    if (!msg) {
      return;
    }

    let color;
    let extra;
    let concmd = 'log';
    switch (level) {
      case 0:
        color = 'white';
        break;
      case 1:
        color = 'green';
        break;
      case 2:
        color = 'cyan';
        // extra = 'underline';
        break;
      case 3:
        color = 'yellow';
        extra = 'bold';
        break;
      case 4:
      default:
        color = 'bgBrightRed';
        // extra = 'bold';
        concmd = 'error';
        break;
    }

    let command = colors[color];

    if (extra) {
      command = command[extra];
    }

    if (level > 0) console.log('\n');
    console[concmd](command(msg));

  }
}
