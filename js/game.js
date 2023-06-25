var board = document.getElementById('grd');
var ctx = board.getContext("2d");
var a = 18, n = 40, m = 80;
var maxi = a * n, maxj = a * m;
var curGen = Array(n + 2).fill(0);
var iter = 0;
var iterationTime = 100;
for (var i = 0; i < n + 2; i++) {
    curGen[i] = new Array(m + 2).fill(0);
}
//define the 8 directions
var flgs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
var intervalID = 0;
window.onload = function () {
    // alert("Welcome to the Game of Life!\n\n");
    
    
    drawCells();
    drawGrid();
}
board.onclick = function (pos) {
    gridClick(pos);
}

function fstb() {
    mus = document.getElementById("bgmus");
    mus.volume = 0.5;
    mus.play();
    var fst = document.getElementById("fstbut");
    fst.remove();
    clearAll();
    document.querySelector('.myTitle').style.animationPlayState = 'running'
    document.getElementById('grd').style.animationPlayState = 'running'
    document.getElementById('cp').style.animationPlayState = 'running'
    document.querySelector('.appendix').style.animationPlayState = 'running'
}
//handle button click
function start() {
    console.log("start");
    if (intervalID != 0) {
        return;
    }
    refresh();
    intervalID = setInterval(refresh, iterationTime);
    // console.log(intervalID);
}
//handle stop button click
function stop() {
    console.log("stop");
    clearInterval(intervalID);
    intervalID = 0;
}
//handle random init button click
function init() {
    console.log("init");
    stop();
    iter = -1;
    randomInit();
    refresh();
}
//clear all cells
function clearAll() {
    console.log("clear");
    stop();
    iter = 0;
    document.getElementById("iterc").innerHTML = "Iteration: " + iter;
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            curGen[i][j] = 0;
        }
    }
    drawCells();
    drawGrid();
}
//draw the grid
function drawGrid() {
    ctx.strokeStyle = "#b9b9b9";
    for (var i = 0; i <= n; i++) {
        ctx.moveTo(0, i * a);
        ctx.lineTo(maxj, i * a);
        ctx.stroke();
    }
    for (var i = 0; i <= m; i++) {
        ctx.moveTo(i * a, 0);
        ctx.lineTo(i * a, maxi);
        ctx.stroke();
    }
}
//count the number of neighbours of cell (i,j)
function countNeighbours(i, j) {
    var nei = 0;
    for (var k = 0; k < 8; k++) {
        var ni = i + flgs[k][0];
        var nj = j + flgs[k][1];
        //check if ni and nj are valid
        if (ni < 1 || ni > n || nj < 1 || nj > m) {
            continue;
        }
        if (curGen[ni][nj]) {
            nei++;
        }
    }
    return nei;
}
//calculate the next generation
function lifeInteration() {
    //define a 2d array to store the next generation
    var nxtGen = Array(n + 2).fill(0);
    for (var i = 0; i < n + 2; i++) {
        nxtGen[i] = new Array(m + 2).fill(0);
    }
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            nei = countNeighbours(i, j);
            if (curGen[i][j]) {
                if (nei == 2 || nei == 3) {
                    nxtGen[i][j] = 1;
                }
                else {
                    nxtGen[i][j] = 0;
                }
            }
            else {
                if (nei == 3) {
                    nxtGen[i][j] = 1;
                }
                else {
                    nxtGen[i][j] = 0;
                }
            }
        }
    }
    //replace curGen with nxtGen
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            curGen[i][j] = nxtGen[i][j];
        }
    }
    iter++;
    //reclaim the memory of nxtGen
    nxtGen = null;
}
//fill the cell at (i,j) with color c
function fillCell(i, j, c) {
    if (c == 3) {
        ctx.fillStyle = "rgba(46,125,50,1)";
    }
    else if (c == 2) {
        ctx.fillStyle = "rgba(111,255,3,1)";
    }
    else if (c == 1) {
        ctx.fillStyle = "rgba(204,255,144,1)";
    }
    else if (c == 0) {
        ctx.fillStyle = "rgba(55, 71, 79, 0.75)";
    }
    else {
        console.log("error")
    }
    //fill the cell at (i,j)
    ctx.beginPath();
    ctx.rect((j - 1) * a + 1, (i - 1) * a + 1, a - 1, a - 1);
    ctx.closePath();
    ctx.fill()
}
//draw the cells
function drawCells() {
    //clear the canvas
    ctx.clearRect(0, 0, board.width, board.height);
    //define a 2d array to store the map of cells
    var mp = Array(n + 2).fill(0);
    for (var i = 0; i < n + 2; i++) {
        mp[i] = new Array(m + 2).fill(0);
    }
    // console.log(iter);
    // 0: dead cell
    // 1: underpopulated cell
    // 2: healthy cell
    // 3: overpopulated cell
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            if (curGen[i][j]) {
                nei = countNeighbours(i, j);
                // console.log(nei);
                if (nei < 2) {
                    mp[i][j] = 1;
                }
                else if (nei == 2 || nei == 3) {
                    mp[i][j] = 2;
                }
                else if (nei > 3) {
                    mp[i][j] = 3;
                }
                else {
                    console.log("error");
                }
            }
            else {
                mp[i][j] = 0;
            }
        }
    }
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            fillCell(i, j, 0);
            if (curGen[i][j]) {
                fillCell(i, j, mp[i][j]);
            }
        }
    }
    //reclaim the memory
    mp = null;
}
//refresh the canvas
function refresh() {
    lifeInteration();
    drawCells();
    drawGrid();
    document.getElementById("iterc").innerHTML = "Iteration: " + iter;
}
//randomly generate the initial state
function randomInit() {
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            curGen[i][j] = Math.round(Math.random());
        }
    }
}
//sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//handle grid click
function gridClick(pos) {
    var x = pos.offsetX;
    var y = pos.offsetY;
    var i = Math.floor(y / a) + 1;
    var j = Math.floor(x / a) + 1;
    //check if i and j are valid
    if (i < 1 || i > n || j < 1 || j > m) {
        return;
    }
    curGen[i][j] = 1 - curGen[i][j];
    drawCells();
    drawGrid();
}
// change the speed of evolution
function gapChange() {
    var gap = document.getElementById("gap").value;
    iterationTime = gap;
    if (intervalID != 0) {
        stop();
        start();
    }
}
//load a pattern
function loadPattern() {
    var patt = document.getElementById("patt").value;
    console.log("load pattern:" + patt);
    if (patt == "none") {
        return;
    }
    stop();
    iter = 0;
    document.getElementById("iterc").innerHTML = "Iteration: " + iter;
    for (var i = 1; i <= n; i++) {
        for (var j = 1; j <= m; j++) {
            curGen[i][j] = 0;
        }
    }
    if (patt == "glider") {                 //glider
        var pa = 1;
        curGen[1 + (n / 2) - pa][2 + (m / 2) - pa] = 1;
        curGen[2 + (n / 2) - pa][3 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][2 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][3 + (m / 2) - pa] = 1;
    }
    else if (patt == "hwss") {              //heavy-weight spaceship
        var pa = 3;
        curGen[1 + (n / 2) - pa][2 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][3 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][4 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][5 + (m / 2) - pa] = 1;
        curGen[2 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[2 + (n / 2) - pa][5 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][5 + (m / 2) - pa] = 1;
        curGen[4 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[4 + (n / 2) - pa][4 + (m / 2) - pa] = 1;
    }
    else if (patt == "pulsar") {            //pulsar
        var pa = 6;
        curGen[1 + (n / 2) - pa][3 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][4 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][5 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][9 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][10 + (m / 2) - pa] = 1;
        curGen[1 + (n / 2) - pa][11 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][6 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][8 + (m / 2) - pa] = 1;
        curGen[3 + (n / 2) - pa][13 + (m / 2) - pa] = 1;
        curGen[4 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[4 + (n / 2) - pa][6 + (m / 2) - pa] = 1;
        curGen[4 + (n / 2) - pa][8 + (m / 2) - pa] = 1;
        curGen[4 + (n / 2) - pa][13 + (m / 2) - pa] = 1;
        curGen[5 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[5 + (n / 2) - pa][6 + (m / 2) - pa] = 1;
        curGen[5 + (n / 2) - pa][8 + (m / 2) - pa] = 1;
        curGen[5 + (n / 2) - pa][13 + (m / 2) - pa] = 1;
        curGen[6 + (n / 2) - pa][3 + (m / 2) - pa] = 1;
        curGen[6 + (n / 2) - pa][4 + (m / 2) - pa] = 1;
        curGen[6 + (n / 2) - pa][5 + (m / 2) - pa] = 1;
        curGen[6 + (n / 2) - pa][9 + (m / 2) - pa] = 1;
        curGen[6 + (n / 2) - pa][10 + (m / 2) - pa] = 1;
        curGen[6 + (n / 2) - pa][11 + (m / 2) - pa] = 1;
        curGen[8 + (n / 2) - pa][3 + (m / 2) - pa] = 1;
        curGen[8 + (n / 2) - pa][4 + (m / 2) - pa] = 1;
        curGen[8 + (n / 2) - pa][5 + (m / 2) - pa] = 1;
        curGen[8 + (n / 2) - pa][9 + (m / 2) - pa] = 1;
        curGen[8 + (n / 2) - pa][10 + (m / 2) - pa] = 1;
        curGen[8 + (n / 2) - pa][11 + (m / 2) - pa] = 1;
        curGen[9 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[9 + (n / 2) - pa][6 + (m / 2) - pa] = 1;
        curGen[9 + (n / 2) - pa][8 + (m / 2) - pa] = 1;
        curGen[9 + (n / 2) - pa][13 + (m / 2) - pa] = 1;
        curGen[10 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[10 + (n / 2) - pa][6 + (m / 2) - pa] = 1;
        curGen[10 + (n / 2) - pa][8 + (m / 2) - pa] = 1;
        curGen[10 + (n / 2) - pa][13 + (m / 2) - pa] = 1;
        curGen[11 + (n / 2) - pa][1 + (m / 2) - pa] = 1;
        curGen[11 + (n / 2) - pa][6 + (m / 2) - pa] = 1;
        curGen[11 + (n / 2) - pa][8 + (m / 2) - pa] = 1;
        curGen[11 + (n / 2) - pa][13 + (m / 2) - pa] = 1;
        curGen[13 + (n / 2) - pa][3 + (m / 2) - pa] = 1;
        curGen[13 + (n / 2) - pa][4 + (m / 2) - pa] = 1;
        curGen[13 + (n / 2) - pa][5 + (m / 2) - pa] = 1;
        curGen[13 + (n / 2) - pa][9 + (m / 2) - pa] = 1;
        curGen[13 + (n / 2) - pa][10 + (m / 2) - pa] = 1;
        curGen[13 + (n / 2) - pa][11 + (m / 2) - pa] = 1;
    }
    else if (patt == "pd") {            //penta-decathlon
        var pa = 5;
        curGen[2 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
        curGen[3 + (n / 2) - pa][1 + (m / 2) - 1] = 1;
        curGen[3 + (n / 2) - pa][3 + (m / 2) - 1] = 1;
        curGen[4 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
        curGen[1 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
        curGen[5 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
        curGen[6 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
        curGen[7 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
        curGen[8 + (n / 2) - pa][1 + (m / 2) - 1] = 1;
        curGen[8 + (n / 2) - pa][3 + (m / 2) - 1] = 1;
        curGen[9 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
        curGen[10 + (n / 2) - pa][2 + (m / 2) - 1] = 1;
    }
    else if (patt == "gg") {            //gosper glider gun
        var pax = 5, pay = 18;
        curGen[5 + (n / 2) - pax][1 + (m / 2) - pay] = 1;
        curGen[5 + (n / 2) - pax][2 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][1 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][2 + (m / 2) - pay] = 1;
        curGen[3 + (n / 2) - pax][13 + (m / 2) - pay] = 1;
        curGen[3 + (n / 2) - pax][14 + (m / 2) - pay] = 1;
        curGen[4 + (n / 2) - pax][12 + (m / 2) - pay] = 1;
        curGen[4 + (n / 2) - pax][16 + (m / 2) - pay] = 1;
        curGen[5 + (n / 2) - pax][11 + (m / 2) - pay] = 1;
        curGen[5 + (n / 2) - pax][17 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][11 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][15 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][17 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][18 + (m / 2) - pay] = 1;
        curGen[7 + (n / 2) - pax][11 + (m / 2) - pay] = 1;
        curGen[7 + (n / 2) - pax][17 + (m / 2) - pay] = 1;
        curGen[8 + (n / 2) - pax][12 + (m / 2) - pay] = 1;
        curGen[8 + (n / 2) - pax][16 + (m / 2) - pay] = 1;
        curGen[9 + (n / 2) - pax][13 + (m / 2) - pay] = 1;
        curGen[9 + (n / 2) - pax][14 + (m / 2) - pay] = 1;
        curGen[1 + (n / 2) - pax][25 + (m / 2) - pay] = 1;
        curGen[2 + (n / 2) - pax][23 + (m / 2) - pay] = 1;
        curGen[2 + (n / 2) - pax][25 + (m / 2) - pay] = 1;
        curGen[3 + (n / 2) - pax][21 + (m / 2) - pay] = 1;
        curGen[3 + (n / 2) - pax][22 + (m / 2) - pay] = 1;
        curGen[4 + (n / 2) - pax][21 + (m / 2) - pay] = 1;
        curGen[4 + (n / 2) - pax][22 + (m / 2) - pay] = 1;
        curGen[5 + (n / 2) - pax][21 + (m / 2) - pay] = 1;
        curGen[5 + (n / 2) - pax][22 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][23 + (m / 2) - pay] = 1;
        curGen[6 + (n / 2) - pax][25 + (m / 2) - pay] = 1;
        curGen[7 + (n / 2) - pax][25 + (m / 2) - pay] = 1;
        curGen[3 + (n / 2) - pax][35 + (m / 2) - pay] = 1;
        curGen[3 + (n / 2) - pax][36 + (m / 2) - pay] = 1;
        curGen[4 + (n / 2) - pax][35 + (m / 2) - pay] = 1;
        curGen[4 + (n / 2) - pax][36 + (m / 2) - pay] = 1;
    }
    //  Unable to run this pattern because of the size of the canvas
    // else if (patt == "ig") {            //infinite growth
    //     var pay = 40;
    //     curGen[1 + (n / 2)][1 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][2 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][3 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][4 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][5 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][6 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][7 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][8 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][10 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][11 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][12 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][13 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][14 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][18 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][19 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][20 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][27 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][28 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][29 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][30 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][31 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][32 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][33 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][35 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][36 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][37 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][38 + (m / 2) - pay] = 1;
    //     curGen[1 + (n / 2)][39 + (m / 2) - pay] = 1;
    // }
    drawCells();
    drawGrid();
}