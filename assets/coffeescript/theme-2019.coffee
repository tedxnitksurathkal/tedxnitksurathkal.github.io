myp5 = new p5 (p) ->
  p.j = -1
  p.cacheTriangle = ''
  p.img_copy = ''
  p.triangleSize = 350
  p.triangleHeight = p.triangleSize * p.sqrt(3)/2
  p.triangles = []
  p.cache = ''
  p.canvas = {}
  p.cnv = {}
  p.img = ''
  p.doGlitch = false
  p.offset = 0
  p.imgGlitch = ''
  p.doChangeImg = false
  p.offsetChangeImg = 0
  p.changeImgG = ''

  p.preload = ->
    p.img = p.loadImage('https://preview.ibb.co/jenMAH/pexels_photo_300857.jpg')
    return

  p.setup = ->
    p.initSetup()
    setInterval (-> p.setDoGlitch()), 7000

    return

  p.initSetup = ->
    p.cnv = p.createCanvas window.innerWidth, window.innerHeight
    p.cache = new p.Cache()
    p.initTriangles()
    p.img_copy = p.createImage p.triangleSize, p.triangleSize
    p.cacheTriangle = p.createGraphics p.triangleSize, p.triangleSize
    p.cacheTriangle.strokeWeight 0;
    p.cacheTriangle.triangle 0, 0, p.triangleSize, 0, p.triangleSize/2, p.triangleHeight
    p.pixelDensity 1
    p.imgGlitch = p.createImage p.img.width, p.img.height
    return

  p.setDoGlitch = ->
    p.doGlitch = true
    p.imgGlitch.copy p.img, 0, 0, p.img.width, p.img.height, 0, 0, p.imgGlitch.width, p.imgGlitch.height

    return

  p.glitch = ->
    img = p.imgGlitch

    draw = ->
      img.loadPixels()
      y = 0
      while y < img.height
        x = 0
        while x < img.width
          index = (x + y * img.width) * 4
          if img.pixels[index + 4] == undefined || img.pixels[index + 9] == undefined
            img.pixels[index] = 0
            img.pixels[index+1] = 0
            img.pixels[index+2] = 0
            img.pixels[index+3] = 0
          else
            img.pixels[index] = img.pixels[index + 4];
            img.pixels[index+1] = img.pixels[index + 9];
          x++
        y++
      img.updatePixels()

    draw()

    if p.offset == 5
      p.doGlitch = false
      p.offset = 0
    return

  p.draw = ->
    #p.print p.doChangeImg
    img = p.img
    if p.doGlitch
      p.offset += 1
      p.glitch()
      img = p.imgGlitch
    #else
    p.cache.move()
    p.cache.cut(img)

    i = 0
    while i < p.triangles.length
      p.triangles[i].display()
      i++

    p.changeImg()

    return

  p.changeImg = ->
    if (p.doChangeImg)
      p.doGlitch = false
      p.changeImgG.image p.img_c, -p.img_c.width + p.offsetChangeImg, 0
      #p.img.image p.img_c, 0, 0, 100, 100
      p.img = p.changeImgG
      p.offsetChangeImg += 5
      if (p.offsetChangeImg - p.img_c.width) >= 0
        p.doChangeImg = false
    return

  p.kTriangle = (x, y, angle, scaleX, scaleY) ->
    @x = x
    @y = y
    @angle = angle
    @scaleX = scaleX
    @scaleY = scaleY

    @display = ->
      p.push()
      p.translate @x, @y
      p.scale @scaleX, @scaleY
      p.rotate @angle
      p.image p.img_copy, 0, 0
      p.pop()
      return
    return

  p.Cache = ->
    @x = (p.img.width - p.triangleSize)/2
    @y = (p.img.height - p.triangleHeight)/2
    @speedX = 0;
    @speedY = 0;

    @move = ->
      mx = p.mouseX
      my = p.mouseY
      if p.mouseX == 0
        mx = @x
        my = @y
      @speedX = (mx - @x)/20;
      @speedY = (my - @y)/20;
      @x += @speedX;
      @y += @speedY;
      return

    @cut = (img) ->
      mx = p.map @x, 0, p.width, 0, p.img.width - p.triangleSize
      my = p.map @y, 0, p.height, 0, p.img.height - p.triangleHeight
      p.img_copy.copy img, mx, my, p.triangleSize, p.triangleSize, 0, 0, p.triangleSize, p.triangleSize
      p.img_copy.mask p.cacheTriangle
      return

    return

  p.windowResized = ->
    p.resizeCanvas window.innerWidth, window.innerHeight
    p.initSetup()
    return

  p.initTriangles = ->
    h = 0
    while h < p.ceil(p.height/p.triangleHeight/2)
      i = 0
      while i < p.ceil(p.width/p.triangleSize/3)
        p.triangles[++p.j] = new p.kTriangle(0 + 3*p.triangleSize*i, 0 + 2*p.triangleHeight*h, p.PI/3, -1, 1);
        p.triangles[++p.j] = new p.kTriangle(0 + 3*p.triangleSize*i, 0 + 2*p.triangleHeight*h, 0, 1, 1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3/2 + 3*p.triangleSize*i, p.triangleHeight + 2*p.triangleHeight*h, -p.PI/3, -1, 1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3/2 + 3*p.triangleSize*i, p.triangleHeight + 2*p.triangleHeight*h, p.PI/3, -1, -1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3/2 +3*p.triangleSize*i, p.triangleHeight + 2*p.triangleHeight*h, 0, 1, -1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3 + 3*p.triangleSize*i, 0 + 2*p.triangleHeight*h, -p.PI/3, -1, -1);

        p.triangles[++p.j] = new p.kTriangle(3*p.triangleSize + 3*p.triangleSize*i, 0 + 2*p.triangleHeight*h, p.PI/3, -1, 1);

        p.triangles[++p.j] = new p.kTriangle(0 + 3*p.triangleSize*i, p.triangleHeight*2 + 2*p.triangleHeight*h, p.PI/3, -1, -1);
        p.triangles[++p.j] = new p.kTriangle(0 + 3*p.triangleSize*i, p.triangleHeight*2 + 2*p.triangleHeight*h, 0, 1, -1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3/2 + 3*p.triangleSize*i, p.triangleHeight + 2*p.triangleHeight*h, -p.PI/3, -1, -1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3/2 + 3*p.triangleSize*i, p.triangleHeight + 2*p.triangleHeight*h, p.PI/3, -1, 1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3/2 + 3*p.triangleSize*i, p.triangleHeight + 2*p.triangleHeight*h, 0, 1, 1);
        p.triangles[++p.j] = new p.kTriangle(p.triangleSize*3 + 3*p.triangleSize*i, p.triangleHeight*2 + 2*p.triangleHeight*h, -p.PI/3, -1, 1);
        p.triangles[++p.j] = new p.kTriangle(3*p.triangleSize + 3*p.triangleSize*i, p.triangleHeight*2 + 2*p.triangleHeight*h, p.PI/3, -1, -1);
        i++
      h++
    return

  p5.Renderer2D._copyHelper = (srcImage, sx, sy, sw, sh, dx, dy, dw, dh) ->
    if srcImage instanceof p5.Image
      p.canvas = srcImage.canvas
    else if srcImage instanceof p5.Graphics
      srcImage.loadPixels()
      p.canvas = srcImage.elt
    s = p.canvas.width / srcImage.width
    @drawingContext.drawImage p.canvas, s * sx, s * sy, s * sw, s * sh, dx, dy, dw, dh
    return
  return 
return