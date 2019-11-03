// triangulation using https://github.com/ironwallaby/delaunay

var kaliedo = document.getElementById("kaliedo")
if(kaliedo)
{
  kaliedo.addEventListener("click", glassbreak);
}
var shatterse = document.getElementById("shattersection");
window.onload= function()
{
  this.shatterse.style.display='none';
}
function glassbreak(event) {
  console.log("CLICK!");
  // alert(event.clientX + ',' + event.clientY)
  // click_image(event.clientX, event.clientY);
  
  if(shatterse)
  {
    console.log(shatterse);
    kaliedo.remove();
    shatterse.style.display='block';
    click_image(event.clientX, event.clientY);
    triangulate();
    shatter();
  }
}

// triangulation using https://github.com/ironwallaby/delaunay

const TWO_PI = Math.PI * 2;

var images = [],
  imageIndex = 0;   

var image,
  imageWidth = 360,
  imageHeight = 640;

var vertices = [],
  indices = [],
  fragments = [];

var container = document.getElementById('container');

var clickPosition = [imageWidth * 0.5, imageHeight * 0.5];


window.onload = function () {
  $("#shtrtext").fadeOut();
  TweenMax.set(container, { perspective: 500 });

  var v_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var v_height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  imageWidth = v_width;
  imageHeight = v_height;

  var url = 'assets/img/diamonds/diamond_m_640p.png';
  if (v_width > 1600 && v_height > 900) {
    url = 'assets/img/diamonds/diamond_1080p.png';
  }
  else if (v_width > 1366 && v_height > 768) {
    url = 'assets/img/diamonds/diamond_900p.png';
  }
  else if (v_width > 411 && v_height > 731) {
    url = 'assets/img/diamonds/diamond_768p.png';
  }
  else if (v_width > 360 && v_height > 640) {
    url = 'assets/img/diamonds/diamond_m_731p.png';
  }

  // images from reddit/r/wallpapers
  var urls = [
    // 'assets/img/2019_gem_still_1080p.png'
    url
  ],
    image,
    loaded = 0;
  // very quick and dirty hack to load and display the first image asap
  images[0] = image = new Image();
  image.onload = function () {
    if (++loaded === 1) {
      // imagesLoaded();
      placeImage(false);

      images[0] = image = new Image();

      image.src = urls[0];

    }
  };
  image.src = urls[0];
};

// function imagesLoaded() {
//   placeImage(false);

// }

function placeImage(transitionIn) {
  image = images[imageIndex];

  if (++imageIndex === images.length) imageIndex = 0;

  // image.addEventListener('click', imageClickHandler);
  image.classList.add('sh');
  image.id='shatterimg';
  container.appendChild(image);


  if (transitionIn !== false) {
    TweenMax.fromTo(image, 0.75, { y: -1000 }, { y: 0, ease: Back.easeOut });
  }

  
}

function click_image(click_x, click_y) {
  var box = image.getBoundingClientRect(),
    top = box.top,
    left = box.left;

  clickPosition[0] = click_x - left;
  clickPosition[1] = click_y - top;
  console.log("TRIANGULATE");
  triangulate();
  console.log("SHATTER");
  var shatmsg = document.getElementById('shattermesg');
  shatmsg.style.display = 'block';
  shatter();

}

// function imageClickHandler(event) {
//   var box = image.getBoundingClientRect(),
//     top = box.top,
//     left = box.left;

//   clickPosition[0] = event.clientX - left;
//   clickPosition[1] = event.clientY - top;
//   console.log("TRIANGULATE");
//   triangulate();
//   console.log("SHATTER");
//   var shatmsg = document.getElementById('shattermesg');
//   shatmsg.style.display = 'block';
//   shatter();
  
// }

function triangulate() {
  console.log("TRIANGLE!");
  var rings = [
    { r: 50, c: 12 },
    { r: 150, c: 12 },
    // { r: 300, c: 12 },
    { r: 700, c: 12 },
    { r: 1200, c: 12 },
    { r: 2000, c: 12 } // very large in case of corner clicks
  ],
    x,
    y,
    centerX = clickPosition[0],
    centerY = clickPosition[1];

  vertices.push([centerX, centerY]);

  rings.forEach(function (ring) {
    var radius = ring.r,
      count = ring.c,
      variance = radius * 0.25;

    for (var i = 0; i < count; i++) {
      x = Math.cos((i / count) * TWO_PI) * radius + centerX + randomRange(-variance, variance);
      y = Math.sin((i / count) * TWO_PI) * radius + centerY + randomRange(-variance, variance);
      vertices.push([x, y]);
    }
  });

  vertices.forEach(function (v) {
    v[0] = clamp(v[0], 0, imageWidth);
    v[1] = clamp(v[1], 0, imageHeight);
  });

  indices = Delaunay.triangulate(vertices);
}

function shatter() {
  container.removeChild(image);
  var p0, p1, p2,
    fragment;

  var tl0 = new TimelineMax({ onComplete: shatterCompleteHandler });

  for (var i = 0; i < indices.length; i += 3) {
    p0 = vertices[indices[i + 0]];
    p1 = vertices[indices[i + 1]];
    p2 = vertices[indices[i + 2]];

    fragment = new Fragment(p0, p1, p2);

    var dx = fragment.centroid[0] - clickPosition[0],
      dy = fragment.centroid[1] - clickPosition[1],
      d = Math.sqrt(dx * dx + dy * dy),
      rx = 30 * sign(dy),
      ry = 90 * -sign(dx),
      delay = d * 0.003 * randomRange(0.9, 1.1);
    fragment.canvas.style.zIndex = Math.floor(d).toString();

    var tl1 = new TimelineMax();


    tl1.to(fragment.canvas, 1, {
      z: -500,
      rotationX: rx,
      rotationY: ry,
      ease: Cubic.easeIn
    });
    tl1.to(fragment.canvas, 0.4, { alpha: 0 }, 0.6);

    tl0.insert(tl1, delay);

    fragments.push(fragment);
    container.appendChild(fragment.canvas);
  }

  // 
  // image.removeEventListener('click', imageClickHandler);
}

function shatterCompleteHandler() {
  // add pooling?
  fragments.forEach(function (f) {
    container.removeChild(f.canvas);
  });
  fragments.length = 0;
  vertices.length = 0;
  indices.length = 0;
  console.log("SHATTER COMPLETE");
  var shtrtext = document.getElementById('shtrtext');
  setTimeout(function () {
    $("#shtrtext").fadeIn();
    // shtrtext.style.animation = 'fadeIn ease 5s';
  },0);

}

//////////////
// MATH UTILS
//////////////

function randomRange(min, max) {
  return min + (max - min) * Math.random();
}

function clamp(x, min, max) {
  return x < min ? min : (x > max ? max : x);
}

function sign(x) {
  return x < 0 ? -1 : 1;
}

//////////////
// FRAGMENT
//////////////

Fragment = function (v0, v1, v2) {
  this.v0 = v0;
  this.v1 = v1;
  this.v2 = v2;

  this.computeBoundingBox();
  this.computeCentroid();
  this.createCanvas();

  this.clip();
};
Fragment.prototype = {
  computeBoundingBox: function () {
    var xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]),
      xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]),
      yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]),
      yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);

    this.box = {
      x: xMin,
      y: yMin,
      w: xMax - xMin,
      h: yMax - yMin
    };
  },
  computeCentroid: function () {
    var x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3,
      y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;

    this.centroid = [x, y];
  },
  createCanvas: function () {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.box.w;
    this.canvas.id="shattercanv"
    this.canvas.height = this.box.h;
    this.canvas.style.width = this.box.w + 'px';
    this.canvas.style.height = this.box.h + 'px';
    console.log(this.canvas.style.width + "W" + this.canvas.style.height + "H");

    this.canvas.style.left = this.box.x + 'px';
    this.canvas.style.top = this.box.y + 'px';
    this.ctx = this.canvas.getContext('2d');
  },
  clip: function () {
    this.ctx.translate(-this.box.x, -this.box.y);
    this.ctx.beginPath();
    this.ctx.moveTo(this.v0[0], this.v0[1]);
    this.ctx.lineTo(this.v1[0], this.v1[1]);
    this.ctx.lineTo(this.v2[0], this.v2[1]);
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(image, 0, 0);
  }
};