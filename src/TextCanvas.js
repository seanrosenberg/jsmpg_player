/* parOptions = { */
// textcanvas: obj_for_render_text,
// width: src_video_width,
// height: src_video_height
// divcanvas_size: html_div_size
/* } */

function TextCanvas(parOptions) {

    parOptions = parOptions || {};
    this.textcanvasElement = parOptions.textcanvas || document.createElement("canvas");
    this.width = parOptions.width || 640;
    this.height = parOptions.height || 320;
	this.divcanvas_size = parOptions.divcanvas_size;
    this.init2DCanvas();
    this.drawText("Hello PI-view!");
}

TextCanvas.prototype.init2DCanvas = function() {
    var textcanvas = this.textcanvasElement;
    this.context2D = textcanvas.getContext("2d");
};

TextCanvas.prototype.drawText = function(word) {
    var ctx = this.context2D;
    if (ctx) {
        ctx.font = "50px Verdana";
        //Create gradient
        var gradient = ctx.createLinearGradient(0, 0, this.width, 0);
        gradient.addColorStop("0", "yellow");
        gradient.addColorStop("0.5", "white");
        gradient.addColorStop("1.0", "yellow");
        // Fill with gradient

		ctx.clearRect(0,0, this.width, this.height);
        ctx.fillStyle = gradient;
		if (word) {
			ctx.fillText(word, this.width/2, this.height/2);
		}
   }
};
