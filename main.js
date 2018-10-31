
'use strict'
function main(){

    //declares images
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var walkingSpriteSheetRight = new Image();
    var walkingSpriteSheetLeft = new Image();
    var danglingSpriteSheet = new Image();
    var fallingSpriteSheet = new Image();
    var dyingSpriteSheet = new Image();
    walkingSpriteSheetRight.src = './images/walkingRight.png';
    walkingSpriteSheetLeft.src = "./images/walkingLeft.png";
    danglingSpriteSheet.src = "./images/dangling.png";
    fallingSpriteSheet.src = "./images/falling.png";
    dyingSpriteSheet.src = "./images/death.png";
    
    //defines the size of the canvas
    canvas.height = window.innerHeight/1.3;
    canvas.width = window.innerWidth/1.3;

    //declares some global variables
    var x = 0;
    var y = 0;
    var i = 0;
    var mouseX = 0;
    var mouseY = 0;
    var initialY = 0;
    var walkingDirection = "right";
    var stickStatus = "walking";


    //the sprite object constructor
    function sprite (options) {
				
        var that = {};
            
        //asigns variales to the object
        that.context = options.context;
        that.dwidth = options.dwidth;
        that.dheight = options.dheight;
        that.swidth = options.swidth;
        that.sheigth = options.sheigth;
        that.image = options.image;
        that.frameIndex = 0;
        var tickCount = 0;
        that.ticksPerFrame = options.ticksPerFrame;
        that.numberOfFrames = options.numberOfFrames;

        that.render = function () {
            //clears last drawing and draws new one
            that.context.clearRect(0, 0, canvas.width, canvas.height)
            that.context.drawImage(
               that.image,
               that.frameIndex * that.dwidth,
               0,
               that.dwidth,
               that.dheight,
                x,
               y,
               that.swidth,
               that.sheigth);
        };

        that.update = function () {
            //handles the frames
            tickCount += 1;
            if (tickCount > that.ticksPerFrame) {
                tickCount = 0;
                if (that.frameIndex < that.numberOfFrames - 1) {	
                    // Go to the next frame
                    that.frameIndex += 1;
                }else{
                    //if at last frame go back to the first
                    that.frameIndex = 0;
                }
            }
        }; 

        return that;
    }


    //A function for each object that draws and moves it
    function stickMovement (){
        //walks from one side of the screen to the other
        y = window.innerHeight/1.3-85;
        if(x > canvas.width-55){
            walkingDirection = "left";
            walking.image = walkingSpriteSheetLeft;
        }else if(x < -45){
            walkingDirection = "right"
           walking.image = walkingSpriteSheetRight;
        }
        if(walkingDirection === "right"){
            x += 0.33;
        }else{
            x -= 0.33;
        }
        walking.update();
        walking.render();
        //used in every animation to redraw the floor (shouldn't be necessary, this is bad code, i should fix it)
        ctx.fillRect(0,window.innerHeight/1.3,window.innerWidth/1.3, -25);
    }

    function stickDangling (){
        //follows the mouse around
        y = mouseY-25;
        x = mouseX-50;
        dangling.update();
        dangling.render();
        ctx.fillRect(0,window.innerHeight/1.3,window.innerWidth/1.3, -25);
    }

    function stickFalling(){
        //falls and tests if drop height is lethal
        if(y < window.innerHeight/1.3-85){
            y += 15;
        }else{
            if(initialY < canvas.height/2-150){
                stickStatus = "dying";
            }else{
                stickStatus = "walking";
            }
        }
        falling.update();
        falling.render();
        ctx.fillRect(0,window.innerHeight/1.3,window.innerWidth/1.3, -25);
    }

    function stickDying(){
        //places the animation in the right place
        y = window.innerHeight/1.3-85;
        //makes sure animation only plays once
        if(dying.frameIndex < dying.numberOfFrames-1){
            dying.update();
            dying.render();
            ctx.fillRect(0,window.innerHeight/1.3,window.innerWidth/1.3, -25);
        }
    }

    //an object for each animation
    var walking = sprite({
        context: canvas.getContext("2d"),
        //sets width and height of the individual sprite in the original image
        dwidth: 500,
        dheight: 400,
        //sets width and height of the individual sprite in the displayed image
        swidth: 100,
        sheigth: 80,
        //speed of the animation
        ticksPerFrame: 4,
        //frames of the animation
        numberOfFrames: 8,
        //sprite sheet of the animation
        image: walkingSpriteSheetRight
    });

    var dangling = sprite({
        context: canvas.getContext("2d"),
        dwidth: 500,
        dheight: 400,
        swidth: 100,
        sheigth: 80,
        ticksPerFrame: 4,
        numberOfFrames: 8,
        image: danglingSpriteSheet
    })

    var falling = sprite({
        context: canvas.getContext("2d"),
        dwidth: 500,
        dheight: 400,
        swidth: 100,
        sheigth: 80,
        ticksPerFrame: 6,
        numberOfFrames: 4,
        image: fallingSpriteSheet
    })

    var dying = sprite({
        context: canvas.getContext("2d"),
        dwidth: 500,
        dheight: 400,
        swidth: 100,
        sheigth: 80,
        ticksPerFrame: 3,
        numberOfFrames: 7,
        image: dyingSpriteSheet
    })


    //here it runs the loop of the object
    function gameLoop () {
        window.requestAnimationFrame(gameLoop);
        switch(stickStatus){
            case "walking":
                stickMovement();
                break;
            case "dangling":
                stickDangling();
                break;
            case "falling":
                stickFalling();
                break;
            case "dying":
                stickDying();
                break;
        }   
    }
    
    //functions made to change the object if interacted with
    var mouseDown = function(event){
        if((event.offsetX > x+35 && event.offsetX < x+60) && (event.offsetY > y+10 && event.offsetY < y+50) && (stickStatus === "walking")){
            stickStatus = "dangling";
            ctx.clearRect(x,y,walking.dwidth,walking.dheight);
            ctx.fillRect(0,window.innerHeight/1.3,window.innerWidth/1.3, -25);
        }
    }

    var mouseUp = function(){
        initialY = y;
        if(stickStatus === "dangling"){
            stickStatus = "falling";
        }
    }

    //funtion made to keep track of the mouse
    var mousePosition = function(event){
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    }
    
    //listens for mouse movement
    canvas.addEventListener("mousemove", mousePosition)
    //listens for mouse click
    canvas.addEventListener("mousedown", mouseDown);
    //listens for mouse release
    canvas.addEventListener("mouseup", mouseUp);
    //waits for the default animation image to load to start the animation loop
    walkingSpriteSheetRight.addEventListener("load", gameLoop);
}

window.addEventListener('load', main)