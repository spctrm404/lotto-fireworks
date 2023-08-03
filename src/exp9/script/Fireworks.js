class Fireworks {
  constructor(initX, initY, explosionX, explosionY, speed, [red, green, blue]) {
    this.initX = initX;
    this.initY = initY;
    this.explosionParticles = [];
    this.explosionX = explosionX;
    this.explosionY = explosionY;
    this.explosionInitSpeed = speed;
    this.explosionParticleMass = 10;
    this.explosionParticleRad = 2;
    this.explosionCol = [red, green, blue];
    this.explosionAlphaEasing = [0.9, 0.05, 0.9, 0.05];
    this.explosionParticleNum = 6;
    this.trimLine = new TrimLine(
      this.initX,
      this.initY,
      this.explosionParticleRad,
      this.explosionCol
    );
    this.isExplode = false;
    this.trimLine.setTarPos(this.explosionX, this.explosionY);
  }

  explode = () => {
    for (let cnt = 0; cnt < this.explosionParticleNum; cnt++) {
      const vel = p5.Vector.random2D();
      vel.mult(this.explosionInitSpeed + random(-10, 10));
      this.explosionParticles.push(
        new Particle(
          { x: this.explosionX, y: this.explosionY },
          vel,
          this.explosionParticleMass,
          random(2500, 5000),
          this.explosionParticleRad,
          this.explosionCol,
          this.explosionAlphaEasing
        )
      );
    }
  };

  update(gravity, windMag, frictionC) {
    if (!this.trimLine.isDead()) {
      this.trimLine.update();
    } else {
      if (!this.isExplode) {
        this.explode();
        this.isExplode = true;
      }
      this.updateParticles(gravity, windMag, frictionC);
    }
  }

  updateParticles = (gravity, windMag, frictionC) => {
    for (let idx = this.explosionParticles.length - 1; idx >= 0; idx--) {
      const wind = p5.Vector.random2D();
      wind.mult(windMag);
      this.explosionParticles[idx].applyGravity(gravity);
      this.explosionParticles[idx].applyForce(wind);
      this.explosionParticles[idx].applyFriction(frictionC);
      this.explosionParticles[idx].updateChain();
      this.explosionParticles[idx].update();
      if (this.explosionParticles[idx].isDead())
        this.explosionParticles.splice(idx, 1);
    }
  };

  display() {
    if (!this.isExplode) {
      this.trimLine.display();
    } else {
      this.displayParticles();
    }
  }

  displayParticles = () => {
    this.explosionParticles.forEach((eachParticle) => {
      eachParticle.display();
    });
  };
}
