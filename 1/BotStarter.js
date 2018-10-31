// Copyright 2017 Riddles.io

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

let readline = require('readline');
let Field = require('./Field');

/**
 * Main class
 * Initializes a map instance and an empty settings object
 */
let Bot = function () {

    if (false === (this instanceof Bot)) {
        return new Bot();
    }

    // initialize options object
    this.options = {
        timebank: '0',
    };
    this.field = null;
    this.previousMove = null;
    this.once = true;
};

function write(string) {
    process.stderr.write(string);
}


Bot.prototype.init = function () {

    const io = readline.createInterface(process.stdin, process.stdout);

    io.on('line', function (data) {

        if (data.length === 0) {
            return;
        }

        const lines = data.trim().split('\n');

        while (0 < lines.length) {

            const line = lines.shift().trim();
            const lineParts = line.split(" ");

            if (lineParts.length === 0) {
                return;
            }

            const command = lineParts.shift().toCamelCase();

            if (command in bot) {
                const response = bot[command](lineParts);

                if (response && 0 < response.length) {
                    process.stdout.write(response + '\n');
                }
            } else {
                write('Unable to execute command: ' + command + ', with data: ' + lineParts + '\n');
            }
        }
    });

    io.on('close', function () {
        process.exit(0);
    });
};

/**
 * Respond to settings command
 * @param Array data
 */
Bot.prototype.settings = function (data) {
    const key = data[0];
    const value = data[1];

    this.options[key] = isNaN(parseInt(value)) ? value : parseInt(value);
};

Bot.prototype.action = function (data) {

    let botId = this.getBotId();
    let enemyBotId = this.getEnemyBotId();
    let startDirection = botId === 1 ? "right" : "left";

    console.error('right : ' + this.field.getDistance(botId, enemyBotId).right);
    console.error('left : ' + this.field.getDistance(botId, enemyBotId).left);
    console.error('down : ' + this.field.getDistance(botId, enemyBotId).down);
    console.error('up : ' + this.field.getDistance(botId, enemyBotId).up);

    // console.error('currentPos X : ' + this.field.getCurrentPosition(botId).x);
    // console.error('currentPos Y : ' + this.field.getCurrentPosition(botId).y);
    // console.error('Enemy currentPos X : ' + this.field.getCurrentPosition(botId).x);
    // console.error('Enemy currentPos Y : ' + this.field.getCurrentPosition(botId).y);

    if (data[0] === 'move') {
        // const moves = this.field.getAvailableMoves(this.previousMove);
        // const move = moves[Math.floor(Math.random() * moves.length)];

        if (this.once) {
            console.error("startDirection : " + startDirection);
            console.error("remain distance : " + this.field.getDistance(botId, enemyBotId)[startDirection]);
            if (this.field.getDistance(botId, enemyBotId)[startDirection] == 0) {
                this.once = false;
                console.error("once : " + this.once);

            } else {
                return startDirection;
            }
        }

        const move = this.field.defineDirection(botId, enemyBotId, this.previousMove);
        console.error(move);

        this.previousMove = move;

        return move;
    }
};

Bot.prototype.update = function (data) {
    if (this.field === null) {
        const width = this.options.field_width;
        const height = this.options.field_height;
        
        this.field = new Field(width, height);
    }

    if (data[0] === 'game') {
        this.field.parseGameData(data[1], data[2]);
    }
};

Bot.prototype.getBotId = function () {
    return this.options.your_botid;
};

Bot.prototype.getEnemyBotId = function () {
    return 1 - this.getBotId()
}

String.prototype.toCamelCase = function () {
    return this.replace('/', '_').replace(/_[a-z]/g, function (match) {
        return match.toUpperCase().replace('_', '');
    });
};

/**
 * Initialize bot
 * __main__
 */
let bot = new Bot();
bot.init();
