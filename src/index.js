import {
  Engine,
  World,
  Bodies,
  Constraint,
  Render,
  Mouse,
  MouseConstraint,
  Events,
  Vector,
  Composites,
  Vertices,
  Body,
} from "matter-js";

document.body.style.margin = 0;
document.body.style.padding = 0;

// create an engine
let engine = Engine.create(),
  world = engine.world,
  // create a renderer
  render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: window.innerWidth * 0.9,
      height: window.innerHeight * 0.9,
      background: "#000",
      // showBroadphase: true,
      showAxes: true,
      // showCollisions: true,
      // showConvexHulls: true,
      // showVelocity: true,
      wireframes: false, // <-- important
    },
  });

const bridge = Bodies.rectangle(3800, 200, 100, 1300, { isStatic: false });
// add bodies
World.add(world, [
  // walls
  Bodies.rectangle(2000, 1000, 4000, 100, { isStatic: true }),
  Bodies.rectangle(7000, 1000, 4000, 100, { isStatic: true }),
  Bodies.rectangle(11500, 1000, 4000, 100, { isStatic: true }),
  Bodies.rectangle(0, 0, 100, 2000, { isStatic: true }),
  bridge,
  Constraint.create({
    bodyB: bridge,
    pointB: { x: 0, y: 600 },
    pointA: { x: bridge.position.x, y: bridge.position.y + 600 },
    stiffness: 0.5,
  }),
]);

// add bodies
var group = Body.nextGroup(true);

const ballOptions = {
  density: 0.01,
  restitution: 0,
  friction: 3,
  frictionAir: 0.001,
  slop: 1,
  render: {
    sprite: {
      texture: "https://2fan.ru/upload/000/u1/9/2/cfca4bbf.png",
      xScale: 0.51,
      yScale: 0.51,
    },
  },
};

let ball = Bodies.circle(560, 100, 48, ballOptions);
// console.log(circle)
World.add(world, [ball]);

var size = 100;

var stack = Composites.stack(1200, -600, 10, 10, 0, 0, function (x, y) {
  var partA = Bodies.rectangle(x, y, size, size / 5),
    partB = Bodies.rectangle(x, y, size / 5, size, { render: partA.render });

  return Body.create({
    parts: [partA, partB],
  });
});

var stackSecond = Composites.stack(7000, -600, 10, 10, 0, 0, function (x, y) {
  var partA = Bodies.rectangle(x, y, size, size / 5),
    partB = Bodies.rectangle(x, y, size / 5, size, { render: partA.render });

  return Body.create({
    parts: [partA, partB],
  });
});

const cross = (x, y, size) => {
  const partA = Bodies.rectangle(x, y, size, size / 5),
    partB = Bodies.rectangle(x, y, size / 5, size, { render: partA.render });

  return Body.create({
    parts: [partA, partB],
  });
};

const firstCross = cross(2900, 350, 1000);

World.add(world, [
  stack,
  stackSecond,
  firstCross,
  Constraint.create({
    bodyB: firstCross,
    pointB: { x: 0, y: 0 },
    pointA: { x: firstCross.position.x, y: firstCross.position.y },
    stiffness: 0.5,
  }),
]);

var box = Bodies.rectangle(990, 890, 400, 190, { isStatic: false });
var box2 = Bodies.rectangle(190, 890, 170, 190, { isStatic: false });
var item = Bodies.circle(6190, 190, 300, {
  isStatic: false,
  render: {
    sprite: {
      texture:
        "https://cs8.pikabu.ru/post_img/big/2017/04/22/11/1492888050140348172.png",
      xScale: 0.65,
      yScale: 0.65,
    },
  },
});
World.add(world, box);
// World.add(world, box2);
World.add(world, item);
let ballIsCollision = false;
let go = false,
  back = false;

window.addEventListener("keypress", (e) => {
  if (e.keyCode === 32) {
    // Body.setPosition(platform,);
    ballIsCollision && Body.setVelocity(ball, { x: ball.velocity.x, y: -15 });
  }
});

let speed = 0;
window.addEventListener("keydown", (e) => {
  // console.log(e);
  if (e.code === "KeyD") {
    go = true;
  }

  if (e.code === "KeyA") {
    back = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyD") {
    go = false;
    speed = 0;
  }

  if (e.code === "KeyA") {
    back = false;
    speed = 0;
  }
});

Events.on(engine, "beforeTick", function () {
  Render.lookAt(
    render,
    { x: ball.position.x, y: ball.position.y },
    {
      x: 360,
      y: 580,
    },
    true
  );

  if (go) {
    if (speed <= 0.2) {
      speed += 0.005;
    }
    Body.setAngularVelocity(ball, speed);
  }

  if (back) {
    if (speed <= 0.2) {
      speed += 0.005;
    }
    Body.setAngularVelocity(ball, -speed);
  }
  console.log(ballIsCollision);

  Body.setAngularVelocity(firstCross, 0.2);
});

Events.on(engine, "collisionStart", function (event) {
  // console.log(ball)
  var pairs = event.pairs;
  pairs.forEach((item) => {
    if (item.bodyB.id === ball.id || item.bodyA.id === ball.id) {
      ballIsCollision = true;
    }
  });
});

Events.on(engine, "collisionEnd", function (event) {
  // console.log(ball)
  var pairs = event.pairs;
  pairs.forEach((item) => {
    if (item.bodyB.id === ball.id || item.bodyA.id === ball.id) {
      ballIsCollision = false;
    }
  });
});

// Events.on(engine, "collisionActive", function (event) {
//   // console.log(ball)
//   var pairs = event.pairs;
//   pairs.forEach((item) => {
//     if (item.bodyB.id === ball.id || item.bodyA.id === ball.id ) {
//       ballIsCollision = true;
//     }
//   });
// });
// // make the world bounds a little bigger than the render bounds
// world.bounds.min.x = -300;
// world.bounds.min.y = -300;
// world.bounds.max.x = 1100;
// world.bounds.max.y = 900;

var boundsScaleTarget = 1,
  boundsScale = {
    x: 1,
    y: 1,
  };

// add mouse control
let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);
