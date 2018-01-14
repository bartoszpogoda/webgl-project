var gl_canvas;
var gl_ctx;

var _position;
var _color;

initUI();

function initUI() {
    var depthLevelAlertShowedOnce = false;

    var perturbationPreview = $( "#perturbationPreview" );
    $( "#perturbationSlider" ).slider({range: "min",
      min: 0,
      max: 150,
      value: 1,
      create: function() {
        perturbationPreview.text( $( this ).slider( "value" ) / 100 );
      },
      slide: function( event, ui ) {
        perturbationPreview.text( ui.value / 100 );
      }
    });

    var depthPreview = $( "#depthPreview" );
    $( "#depthSlider" ).slider({range: "min",
      min: 1,
      max: 10,
      value: 3,
      create: function() {
        depthPreview.text( $( this ).slider( "value" ) );
      },
      slide: function( event, ui ) {
        depthPreview.text( ui.value);

        if(ui.value > 5) {
          if(!depthLevelAlertShowedOnce) {
            $.notify({
               message: 'Caution! Fractal for depth level bigger than 5 may take super long to compute.'
             },{
               type: 'danger',
               placement : {
                 from: 'bottom',
                 align: 'center'
               },
               delay: 3000
             });
           }
           depthLevelAlertShowedOnce = true;
          }

      }
    });
}

function runWebGL () {
   gl_canvas = document.getElementById("view");
   gl_ctx = gl_getContext(gl_canvas);
   gl_initShaders();
   gl_draw();
}

function gl_getContext (canvas) {
  try {
      var ctx = canvas.getContext("webgl");
      ctx.viewportWidth = canvas.width;
      ctx.viewportHeight = canvas.height;
   } catch (e) {}

   if (!ctx) {
      document.write('Unable to initialize WebGL context.')
   }
   return ctx;
}

function gl_initShaders () {
   var vertexShader = `\n
      attribute vec2 position;\n\
      attribute vec3 color;\n\
      varying vec3 vColor;\n\
      void main(void) {\n\
        gl_Position = vec4(position, 0., 1.);\n\
        vColor = color;\n\
      }`;

    var fragmentShader = `\n\
      precision mediump float;\n\
      varying vec3 vColor;\n\
      void main(void) {\n\
         gl_FragColor = vec4(vColor, 1.);\n\
      }`;

    var getShader = function(source, type, typeString) {
      var shader = gl_ctx.createShader(type);
      gl_ctx.shaderSource(shader, source);
      gl_ctx.compileShader(shader);

       if (!gl_ctx.getShaderParameter(shader, gl_ctx.COMPILE_STATUS)) {
         alert('error in' + typeString);
         return false;

      }
      return shader;
   };

   var shaderVertex = getShader(vertexShader, gl_ctx.VERTEX_SHADER, "VERTEX");
   var shaderFragment = getShader(fragmentShader, gl_ctx.FRAGMENT_SHADER, "FRAGMENT");

   var shaderProgram = gl_ctx.createProgram();
   gl_ctx.attachShader(shaderProgram, shaderVertex);
   gl_ctx.attachShader(shaderProgram, shaderFragment);
   gl_ctx.linkProgram(shaderProgram);

   _position = gl_ctx.getAttribLocation(shaderProgram, "position");
   _color = gl_ctx.getAttribLocation(shaderProgram, "color");
   gl_ctx.enableVertexAttribArray(_position);
   gl_ctx.enableVertexAttribArray(_color);
   gl_ctx.useProgram(shaderProgram);
}

function gl_draw() {
    var backgroundColor = {r: 0.984, g: 0.980, b: 0.980};
    //var backgroundColor = {r: 0, g: 0, b: 0};

    gl_ctx.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);

    let carpetDrawer = new CarpetDrawer(gl_ctx, backgroundColor);
    carpetDrawer.setPeturbationLevel($("#perturbationPreview").text());
    carpetDrawer.setMaxDepth($("#depthPreview").text());

    carpetDrawer.renderCarpet({x: -1, y: 1}, 2);
}
