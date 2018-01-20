class CarpetDrawer {

  /* PUBLIC METHODS */

  constructor(glContext, backgroundColor) {
    this.glContext = glContext;
    this.backgroundColor = backgroundColor;
  }

  setPeturbationLevel(peturbationLevel) {
    this.peturbationLevel = peturbationLevel;
  }

  setMaxDepth(maxDepth) {
    this.maxDepth = maxDepth;
  }

  renderCarpet(topLeftCorner, sideLength) {
    this._renderCarpet(0, topLeftCorner, sideLength)
    this.glContext.flush();
  }

  /* PRIVATE METHODS */

  /** Returns random [0,1) float */
  _rand() {
    return Math.random();
  }

  /** Returns random [min, max] float */
  _boundedRand(min, max) {
    return Math.random() * (max - min) + min;
  }

  /** Returns random perturbation */
  _randomPerturbation(initialSideLength) {
	   return (this._rand() > 0.5 ? 1 : (-1)) * initialSideLength * this._boundedRand(0, this.peturbationLevel);
  }

  /** Renders square for given topLeftCorner, sideLength. It has random color if randomColor is set true, backgoundColor otherwise */
  _renderSquare(topLeftCorner, sideLength, randomColor) {
    var _rand = this._rand;
    var glContext = this.glContext;
    var backgroundColor = this.backgroundColor;

    if(randomColor) {
      var squareVerticles = [
        topLeftCorner.x, topLeftCorner.y,
        _rand(), _rand(), _rand(),
        topLeftCorner.x + sideLength, topLeftCorner.y,
        _rand(), _rand(), _rand(),
        topLeftCorner.x + sideLength, topLeftCorner.y - sideLength,
        _rand(), _rand(), _rand(),
        topLeftCorner.x, topLeftCorner.y - sideLength,
        _rand(), _rand(), _rand()
      ];
    } else {
      var squareVerticles = [
        topLeftCorner.x, topLeftCorner.y,
        backgroundColor.r, backgroundColor.g, backgroundColor.b,
        topLeftCorner.x + sideLength, topLeftCorner.y,
        backgroundColor.r, backgroundColor.g, backgroundColor.b,
        topLeftCorner.x + sideLength, topLeftCorner.y - sideLength,
        backgroundColor.r, backgroundColor.g, backgroundColor.b,
        topLeftCorner.x, topLeftCorner.y - sideLength,
        backgroundColor.r, backgroundColor.g, backgroundColor.b,
      ];
    }

    var squareVertexBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, squareVertexBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(squareVerticles), glContext.STATIC_DRAW);

    var squareFaces = [
      0, 1, 2,
      0, 2, 3
    ];

    var squareFacesBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, squareFacesBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(squareFaces), glContext.STATIC_DRAW);

    gl_ctx.vertexAttribPointer(_position, 2, gl_ctx.FLOAT, false, 4*(2+3), 0);
    gl_ctx.vertexAttribPointer(_color, 3, gl_ctx.FLOAT, false, 4*(2+3), 2*4);

    glContext.drawElements(glContext.TRIANGLES, 2*3, glContext.UNSIGNED_SHORT, 0);
  }

  _renderCarpet(depth, topLeftCorner, sideLength) {
	  if (depth >= this.maxDepth) return;

    var subSquareSideLength = sideLength / 3;

  	// Draw empty square
  	var emptySquareTopLeftCorner = {
  		x: topLeftCorner.x + subSquareSideLength,
  		y: topLeftCorner.y - subSquareSideLength
  	};
    this._renderSquare({x: topLeftCorner.x + subSquareSideLength, y: topLeftCorner.y - subSquareSideLength}, subSquareSideLength, false);

  	// Draw remaining (randomly filled) squares
  	for (var i = 0; i < 3; i++) {
  		for (var j = 0; j < 3; j++) {
  			if (!(i == 1 && i == j)) { // skip one which should be empty
				  var deformation = this._randomPerturbation(subSquareSideLength);
  				var subSquareTopLeftCorner = {
  					x: topLeftCorner.x + (i * subSquareSideLength) + deformation,
  					y: topLeftCorner.y - (j * subSquareSideLength) + deformation
  				};

  				this._renderSquare(subSquareTopLeftCorner, subSquareSideLength, true);
  				// render carpet recursive call
  				this._renderCarpet(depth + 1, subSquareTopLeftCorner, subSquareSideLength);
  			}
  		}
  	}
  }

}
