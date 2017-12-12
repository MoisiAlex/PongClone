let canvas;
let canvasContext;
let ballX =50;
let ballY =50;
let ballSpeedX =10;
let ballSpeedY =4;
let paddle1Y =250;
let paddle2Y =250;
const PADDLE_HEIGHT =100;
const PADDLE_THICKNESS =10;

let player1Score =0;
let player2Score =0;
const WINNING_SCORE =3;

let showingWinScreen = false;

function calculateMousePos(evt){
    let rect =canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX -rect.left - root.scrollLeft;
    let mouseY = evt.clientY -rect.top - root.scrollTop;
    return{
            x:mouseX,
            y:mouseY
    };
    
}

function drawEverything(){
    colorRect(0,0,canvas.width,canvas.height,'black');
    
    if(showingWinScreen) {
        canvasContext.fillStyle ="white";
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won!", 350,200);
        } else if(player2Score >= WINNING_SCORE){
            canvasContext.fillText("Left Player Won!", 350,200);
       }
                
        canvasContext.fillText("Click to continue", 350,500);
        return;
    }
    
    drawNet();
    
    colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
    colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,
              PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
    
    colorCircle(ballX,ballY,10,0,'red');
    
    canvasContext.fillStyle ="white";
    canvasContext.fillText(player1Score, 700, 100);
    canvasContext.fillText(player2Score, 100, 100);
    
}

function ballReset(){
    
    if (player1Score >= WINNING_SCORE ||
       player2Score >= WINNING_SCORE)
        {
            showingWinScreen = true;
        }
    ballSpeedX = -ballSpeedX;
    ballSpeedY = Math.floor(Math.random() *2 - ballSpeedX );
    ballX =canvas.width/2;
    ballY =canvas.height/2;
}

function colorRect(leftX,topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height);
}

function colorCircle(leftX,topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(leftX,topY,width,height,Math.PI*2,true);
    canvasContext.fill(); 
}


function computerMovement(){
    
    const randomNumber = Math.floor(Math.random() *5 +1.3);
    let paddle2YCenter = paddle2Y +(PADDLE_HEIGHT/2);
    
    if (paddle2YCenter < ballY- randomNumber*5) {
        paddle2Y +=randomNumber;
    } else if(paddle2YCenter > ballY + randomNumber*5){
         paddle2Y -=randomNumber;
    }
    
}

function moveEverything(){
    if(showingWinScreen) {
        return;
    }
    
    let paddle = document.querySelector("#pong"); 
    let miss = document.querySelector("#miss"); 
   
    computerMovement()
     ballX += ballSpeedX;
     ballY += ballSpeedY;
    if(ballX > canvas.width-20) {
        if (ballY > paddle2Y &&
            ballY <paddle2Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            paddle.play();
            let deltaY = ballY
                    -(paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.15;
            }
        else{
            miss.play();
            player2Score++;
            ballReset();
            }
    }
    if( ballX < 0){
        if (ballY > paddle1Y &&
            ballY <paddle1Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            paddle.play();
            let deltaY = ballY
                    -(paddle1Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.15;
        
        }
        else{
             miss.play();
            player1Score++;
            ballReset();
            }
    }
    if(ballY > canvas.height-20){
        ballSpeedY = -ballSpeedY;
    }
    if( ballY < 0){
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet(){
    for(var i=0; i<canvas.height; i+=40){
        colorRect(canvas.width/2-1,i,2,20,'white');
    }
}


function handleMouseClick(evt){
    if(showingWinScreen){
            player1Score =0;
            player2Score =0;
            showingWinScreen = false;
    }
}

window.addEventListener("load",function(){
    
    canvas = document.querySelector('#gameCanvas');
    canvasContext =canvas.getContext('2d');
    canvas.addEventListener('mousemove',function(evt){
        let mousePos= calculateMousePos(evt);
        paddle1Y =mousePos.y-(PADDLE_HEIGHT/2);
    }); 
    
    showingWinScreen = true;
    canvas.addEventListener('mousedown',handleMouseClick);
    
    let framesPerSecond = 30;
    setInterval(function(){
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);
}); 