
drawRectangles();

function drawRectangles() {
  var canvas = $('canvas#view');
  var context = canvas.get(0).getContext("2d");

  context.fillStyle = "#EE7070";
  context.fillRect(50, 50, 160, 80);
  context.fillStyle = "#70CB55";
  context.fillRect(90, 80, 140, 70);
  context.fillStyle = "#5C79AB";
  context.fillRect(130, 110, 120, 60);
}
