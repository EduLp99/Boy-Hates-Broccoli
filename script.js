window.onload = () => {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let id = null;
    let start = false;

     let gameoverSound = new Audio();
     gameoverSound.src = "./sounds/lose.mp3";
  
    class Player {
      constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width + 50;
        this.height = height + 40;
        this.speedX = 0;
        this.direction = "l";
        this.boyImg = new Image();
        this.boyImg.src = "./images/left.png";
        this.boyImgRight = new Image();
        this.boyImgRight.src = "./images/right.png";
        this.boyFail = new Image();
        this.boyFail.src = "./images/dead.png";
      }
  
      createPlayer() {
        if (this.direction === "l") {
          context.drawImage(
            this.boyImg,
            this.x,
            this.y,
            this.width,
            this.height
          );
        } else {
          context.drawImage(
            this.boyImgRight,
            this.x,
            this.y,
            this.width,
            this.height
          );
        }
      }
  
      newPos() {
        if (this.x >= 0 && this.x <= canvas.width - this.width) {
          this.x += this.speedX;
        } else if (this.x < 0) {
          this.x = 1;
        } else if (this.x > canvas.width - this.width) {
          this.x -= 10;
        }
      }
  
      left() {
        return this.x;
      }
      right() {
        return this.x + this.width;
      }
      top() {
        return this.y + 60;
      }
  
      crashWith(obstacle) {
        return (
          this.top() === obstacle.bottom() &&
          this.right() >= obstacle.left() &&
          this.left() <= obstacle.right()
        );
      }
    }
    let obstaclesImages = [
      "./images/broccoli.png",
      "./images/broccoli.png",
      "./images/broccoli.png"
    ];
  
    let obstaclesMeatsImages = [
      "./images/ham.png",
      "./images/french_fries.png",
      "./images/hot_dog_01.png"
    ];
  
    class Obstacle {
      constructor(x, image) {
        this.x = x;
        this.y = 0;
        this.width = 30;
        this.height = 30;
        this.image = image;
      }
  
      createObstacle() {
        this.broccoliImg = new Image();
        this.broccoliImg.src = this.image;
        
        context.drawImage(
          this.broccoliImg,
          this.x,
          this.y,
          this.width + 10,
          this.height + 10
        );
      }
  
      createMeat() {
        this.hamImg = new Image();
        this.hamImg.src = this.image;
        
        context.drawImage(
          this.hamImg,
          this.x,
          this.y,
          this.width + 10,
          this.height + 10
        );
      }
  
      moveObstacle() {
        this.y += 5;
      }
  
      left() {
        return this.x;
      }
      right() {
        return this.x + this.width;
      }
      top() {
        return this.y;
      }
      bottom() {
        return this.y + this.height;
      }
    }
  
    let player = new Player(canvas.width / 2, canvas.height - 150, 40, 60);
    let frames = 0;
    let veg = [];
    let lifes = 0;
    let meats = [];
  
    function createObstaclesFunction() {
      frames += 1;
      if (lifes < 5) {
        //15
        if (frames % 50 === 0) {
          veg.push(
            new Obstacle(
              Math.floor(Math.random() * (canvas.width - 25)),
              obstaclesImages[Math.floor(Math.random() * obstaclesImages.length)]
            )
          );
        }
      } else if (lifes >= 5) {
        //15
        if (frames % 35 === 0) {
          veg.push(
            new Obstacle(
              Math.floor(Math.random() * (canvas.width - 25)),
              obstaclesImages[Math.floor(Math.random() * obstaclesImages.length)]
            )
          );
        }
      }
      if (frames % 150 === 0) {
        setTimeout(function () {
          meats.push(
            new Obstacle(
              Math.floor(Math.random() * (canvas.width - 25)),
              obstaclesMeatsImages[
                Math.floor(Math.random() * obstaclesMeatsImages.length)
              ]
            )
          );
        }, 2000);
      }
    }
  
    function moveObstaclesFunction() {
      veg.forEach((elem, index) => {
        elem.createObstacle();
        elem.moveObstacle();
        if (elem.y >= canvas.height) {
          veg.splice(index, 1);
        }
      });
      meats.forEach((elem, index) => {
        elem.createMeat();
        elem.moveObstacle();
        if (elem.y >= canvas.height) {
          meats.splice(index, 1);
        }
      });
    }
  
    function checkCrash() {
      let crashed = veg.some(function (veg) {
        return player.crashWith(veg);
      });
  
      if (crashed) {
        if (lifes > 0) {
          veg.forEach((element, index) => {
            veg.splice(index, 1);
            lifes -= 1;
          });
  
          // GAME OVER
        } else {
          gameoverSound.play();
          cancelAnimationFrame(id);
          veg.forEach((element, index) => {
            veg.splice(index, 1);
          });
        }
      }
    }
  
    function checkCatch() {
      let catched = meats.some(function (meats) {
        return player.crashWith(meats);
      });
  
      if (catched) {
        if (lifes >= 0) {
          meats.forEach((element, index) => {
            meats.splice(index, 1);
            lifes += 1;
          });
        }
      }
    }
  
    function lifeScore(points) {
      context.beginPath();
      context.fillStyle = "#051850";
      context.rect(220, 0, 80, 25);
      context.fill();
      context.font = "18px phosphate"; 
      context.fillStyle = "#fff";
      context.fillText("Score: " + points, 225, 17);
    }
  
    function gameUpdate() {
      context.clearRect(0, 0, 700, 700);
  
      player.createPlayer(); 
      player.newPos(); 
  
      createObstaclesFunction(); 
      moveObstaclesFunction(); 
  
      id = requestAnimationFrame(gameUpdate);
  
      checkCatch(); 
      checkCrash(); 
      lifeScore(lifes); 
    }
  
    document.onkeydown = function (e) {
      switch (e.key) {
        case 'ArrowLeft': //  left
          player.speedX = -4;
          player.direction = "l";
          break;
        case 'ArrowRight': // right
          player.speedX = 4;
          player.direction = "r";
          break;
        case 'Enter': // enter
          if (!start) {
            gameUpdate();
            start = true;
          } else {
            window.location.reload();
          }
      }
    };
  
    document.onkeyup = function (e) {
      player.speedX = 0;
      player.speedY = 0;
    };
  };