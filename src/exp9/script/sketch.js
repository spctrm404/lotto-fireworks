const fireworks = [];

let initSpeed = 50;
let gravity;
let gravityMag = 0.05;
let windMag = 1;
let frictionC = 0.5;

function setup() {
  setSketchContainer(3 / 2, 'canvas');

  gravity = createVector(0, gravityMag);

  background(0);
}

function draw() {
  fireworks.forEach((eachFireworks) => {
    eachFireworks.update(gravity, windMag, frictionC);
    // eachFireworks.updateParticles(gravity, windMag, frictionC);
  });

  background(0, 32);

  fireworks.forEach((eachFireworks) => {
    eachFireworks.display();
    // eachFireworks.displayParticles();
  });
  // console.log(frameRate());
  // fireworks.forEach((eachFireworks) => {
  //   console.log(eachFireworks.explosionParticles.length);
  // });
}

function mousePressed() {
  const newFireworks = new Fireworks(
    mouseX,
    height,
    mouseX,
    mouseY,
    initSpeed,
    [255, 0, 0]
  );
  fireworks.push(newFireworks);
  // newFireworks.explode();
  console.log(newFireworks);
}
