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

(function () {

    let Field = function (width, height) {

        this.grid = [];
        this.roundNo = 0;
        this.moveNo = 0;
        this.width = width;
        this.height = height;

        this.constructGrid();
    };


    Field.prototype.constructGrid = function () {

        this.grid = new Array(this.height);

        for (let i = 0; i < this.height; i++) {
            this.grid[i] = Array.from({ length: this.width }).map(() => '0');
        }

    };

    Field.prototype.parseGameData = function (key, value) {

        if (key === 'round') {
            this.roundNo = Number(value);
        }

        if (key === 'field') {
            this.parseFromString(value);
        }
    };

    Field.prototype.parseFromString = function (s) {

        let r = s.split(',');
        let counter = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[x][y] = r[counter] === 'x' ? r[counter] : Number(r[counter]);
                counter++;
            }
        }
    };

    Field.prototype.getAvailableMoves = function (previousMove) {

        // Starterbot: Don't return previous move
        const allMoves = ['up', 'down', 'left', 'right'];

        return allMoves.filter(move => move !== getOpposingMove(previousMove));
    };

    Field.prototype.defineDirection = function (pos, enemyBotId, previousMove) {
        // let currentPos = this.getCurrentPosition(botId);
        let distance = this.getDistance(pos, enemyBotId);

        let max = 0;
        let maxKey;
        let directions = [];
        this.getAvailableMoves(previousMove).map((k) => {
            if (distance[k] >= max) {
                maxKey = k;
                max = distance[k];
                directions.push(k);
            }
            // max = distance[k] > max ? distance[k] : max;
        });

        if (directions.length > 1) {
            this.checkAvailableMoveNextStep(pos, directions);
        }

        return maxKey;
    };

    Field.prototype.checkAvailableMoveNextStep = function (pos, directions) {
        let currentPos = this.getPosition(botId);



        return maxKey;
    };
    
    Field.prototype.getCurrentPosition = function (botId) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[x][y] === botId)
                    return {
                        x: x,
                        y: y
                    };
            }
        }
    };

    // Field.prototype.getDistance = function (botId, enemyBotId) {
    //     let currentPos = this.getCurrentPosition(botId);
    //     return {
    //         right:  this.getRightDistance(currentPos, enemyBotId),
    //         left:  this.getLeftDistance(currentPos, enemyBotId),
    //         down: this.getDownDistance(currentPos, enemyBotId),
    //         up: this.getUpDistance(currentPos, enemyBotId)
    //     }
    // };

    Field.prototype.getDistance = function (pos, enemyBotId) {
        // let currentPos = this.getCurrentPosition(botId);
        return {
            right:  this.getRightDistance(pos, enemyBotId),
            left:  this.getLeftDistance(pos, enemyBotId),
            down: this.getDownDistance(pos, enemyBotId),
            up: this.getUpDistance(pos, enemyBotId)
        }
    };

    Field.prototype.getRightDistance = function (pos, enemyBotId) {
        // let currentPos = this.getCurrentPosition(botId);
        let distance = 0

        for (let x = pos.x + 1; x < this.width; x++) {
            let gridValue = this.grid[x][pos.y];
            
            if (gridValue === enemyBotId || gridValue === 'x') {
                break;
            }

            distance++;
        }

        return distance
    };

    Field.prototype.getLeftDistance = function (pos, enemyBotId) {
        // let currentPos = this.getCurrentPosition(botId);
        let distance = 0

        for (let x = pos.x - 1; x > 0; x--) {
            let gridValue = this.grid[x][pos.y];
            if (gridValue === enemyBotId || gridValue === 'x') {
                break;
            }

            distance++;

        }

        return distance
    };

    Field.prototype.getDownDistance = function (pos, enemyBotId) {
        // let pos = this.getCurrentPosition(botId);
        let distance = 0

        for (let y = pos.y + 1; y < this.height; y++) {
            let gridValue = this.grid[pos.x][y];
            if (gridValue === enemyBotId || gridValue === 'x') {
                break;
            }
 
            distance++;
        }

        return distance
    };

    Field.prototype.getUpDistance = function (pos, enemyBotId) {
        // let currentPos = this.getCurrentPosition(botId);
        let distance = 0

        for (let y = pos.y - 1; y > 0; y--) {
            let gridValue = this.grid[pos.x][y];
            if (gridValue === enemyBotId || gridValue === 'x') {
                break;
            }

            distance++;
        }

        return distance
    };
    
    module.exports = Field;

})();


function getOpposingMove(move) {
    switch (move) {
        case 'up':
            return 'down';
        case 'down':
            return 'up';
        case 'left':
            return 'right';
        case 'right':
            return 'left';
        default:
            return null;
    }
}