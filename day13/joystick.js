const readline = require('readline');

class Joystick {
    constructor(opts) {
        this.handleKeypress = this.handleKeypress.bind(this);
        this.initKeys();
        this.initEvents();
        this.initListeners();

        this.options = {
            onKeypress() {},
            ...opts,
        };
    }

    initEvents() {
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
    }

    initKeys() {
        this.keys = {
            left: -1,
            right: 1,
            up: 0,
        };
    }

    initListeners() {
        process.stdin.on('keypress', this.handleKeypress);
    }

    handleKeypress(str, key) {
        if (key.ctrl && key.name === 'c') {
            process.kill(process.pid, 'SIGINT');
        }
        const value = this.keys[key.name];
        if (value !== undefined) {
            this.options.onKeypress(value, key);
        }
    }
}

module.exports = Joystick;
