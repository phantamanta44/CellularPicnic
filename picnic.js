$(document).ready(function() {
    
    // <SETTINGS>
    
    var gW = 128, gH = 128; // Grid dimensions
    var iaX = 64, iaY = 64, iaF = 0; // Ant position and rotation
    var delay = 1; // Minimum delay between iterations (in ms)
    var cnt = 11000; // Number of iterations
    
    // </SETTINGS>
    
    var DrawAction = { WHITE: 0, BLACK: 1, ANT_ON: 2, ANT_OFF: 3 };
    var mainTable = $('#mainTable'), counter = $('#counter');
    var facingDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    
    var grid = [];
    var drawing = [];
    var aX, aY, aF;
    var iter = 0;
    
    var init = function() {for (var i = 0; i < gH; i++) {
            var tr = $('<div>', {class: 'row'});
            var gRow = [];
            var dRow = [];
            for (var j = 0; j < gW; j++) {
                gRow.push(false);
                var td = $('<td>', {class: 'data'});
                tr.append(td);
                dRow.push(td);
            }
            grid.push(gRow);
            drawing.push(dRow);
            mainTable.append(tr);
        }
        
        aX = iaX;
        aY = iaY;
        aF = iaF;
        
        draw([{action: DrawAction.ANT_ON, x: aX, y: aY}], tick);
    };
    
    var tick = function() {
        if (iter++ >= cnt)
            return;
        window.setTimeout(function() {
            var changes = [];
            
            var cs = !getCell(aX, aY);
            setCell(aX, aY, cs);
            changes.push({action: cs ? DrawAction.BLACK : DrawAction.WHITE, x: aX, y: aY});
            
            changes.push({action: DrawAction.ANT_OFF, x: aX, y: aY});
            var dir = facingDirs[aF];
            aX = (aX + dir[0]) % gW;
            aY = (aY + dir[1]) % gH;
            if (aX < 0) aX = gW - 1;
            if (aY < 0) aY = gH - 1;
            
            if (!getCell(aX, aY))
                aF = (aF + 1) % 4;
            else {
                aF -= 1;
                if (aF < 0) aF = 3;
            }
            changes.push({action: DrawAction.ANT_ON, x: aX, y: aY});
            
            draw(changes, tick);
        }, delay);
    };
    
    var draw = function(a, cb) {
        $.each(a, function(i, obj) {
            var x = obj.x, y = obj.y;
            switch (obj.action) {
                case DrawAction.WHITE:
                    getDCell(x, y).removeClass('sqOn');
                    break;
                case DrawAction.BLACK:
                    getDCell(x, y).addClass('sqOn');
                    break;
                case DrawAction.ANT_ON:
                    getDCell(x, y).addClass('ant');
                    break;
                case DrawAction.ANT_OFF:
                    getDCell(x, y).removeClass('ant');
                    break;
            }
        });
        counter.html('Step ' + iter + '<br>PosX ' + aX + '<br>PosY ' + aY + '<br>Face ' + aF);
        cb.call();
    };
    
    var getCell = function(x, y) {
        return grid[y][x];
    };
    
    var setCell = function(x, y, state) {
        grid[y][x] = state;
    };
    
    var getDCell = function(x, y) {
        return drawing[y][x];
    };
    
    init();
    
});