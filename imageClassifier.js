let mobilenet;
mobilenet = ml5.imageClassifier("MobileNet");
let ball;
let pictureChoices = [];
let pictures = [];
let framePositions = [];

function preload() {
  for (let i = 0; i < 4; i++) {
    pictures[i] = loadImage(`images/${i}.jpg`);
  }
}

function setup() {
  let myCanvas = createCanvas(800, 800);
  myCanvas.parent("app");
  background(0);
  framePositions = [
    [0, 0],
    [width / 2, 0],
    [0, height / 2],
    [width / 2, height / 2],
  ];

  framePositions = {
    positionX: [0, width / 2, 0, width / 2],
    positionY: [0, 0, height / 2, height / 2],
  };

  for (let i = 0; i < 4; i++) {
    let x = framePositions.positionX[i];
    let y = framePositions.positionY[i];
    let r = 400;
    let pic = pictures[i];
    let choice = new Picture(x, y, r, pic);
    pictureChoices.push(choice);
  }
}

function draw() {
  for (let i = 0; i < pictureChoices.length; i++) {
    pictureChoices[i].show();
  }
}

function mouseClicked() {
  for (let i = 0; i < pictureChoices.length; i++) {
    pictureChoices[i].clicked(mouseX, mouseY);
  }
}
class Picture {
  constructor(x, y, r, pic) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.pictureItem = pic;
    this.isSelected = false;
  }

  clicked(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
      if (px > this.x && px < this.x + this.r && py > this.y && py < this.y + this.r) {
        this.isSelected = true;
        predictPicture(this.pictureItem, gotResults);
      } else {
        this.isSelected = false;
      }
    }
  }

  show() {
    image(this.pictureItem, this.x, this.y, this.r, this.r);
  }
}

function predictPicture(item) {
  mobilenet.predict(item, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    let conf;
    let niceConf;
    let label;
    conf = results[0].confidence;
    niceConf = " = Match: " + Math.floor(conf * 100) + "%";
    label = results[0].label;
    newP(label, niceConf);
  }
}

function newP(label, conf) {
  if (document.getElementsByTagName("p").length != 0) {
    delP();
  }
  let appnode = document.createElement("p");
  let t = label + conf;
  appnode.append(t);
  document.body.append(appnode);
}

function delP() {
  let p = document.getElementsByTagName("p");
  p[0].remove();
}
