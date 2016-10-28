var piplayer;

function PIplayer() {

    this.canvas = document.getElementById("videocanvas");
    this.textcanvas = document.getElementById("textcanvas");
    piplayer = new jsmpeg("./Videos/JHFQ9299.mpg", {
        canvas: this.canvas,
        textcanvas: this.textcanvas,
        autoplay: false,
        loop: false,
        seekable: true,
        onload: PlayerOnLoad,
        ondecodeframe: DecodeReportProgress,
        onfinished: FinishDecode
    });

   
}



function PlayOrPauseVideo() {
    if (!piplayer.playing) {
        //piplayer.play();
		piplayer.VtxArray = new Float32Array(vtx_buffer);
		piplayer.TexCordArray = new Float32Array(txt_buffer);
		piplayer.seekToFrame(150);
				//piplayer.renderFrameGL();
    } else {
        piplayer.pause();
    }

}

function PlayerOnLoad() {
    $("#timeSlider").slider("option", "min", 0);
    $("#timeSlider").slider("option", "max", piplayer.duration);
	SetTimeProgress(0);
    console.log("total duratopn %d s", piplayer.duration);
}

function SetTimeProgress(time_in_second) {
    var time_progress_str;
    if (time_in_second === 0) {
        time_progress_str = "0".toHHMMSS() + "/" + piplayer.duration.toString().toHHMMSS();

    } else if (time_in_second > 0) {
        time_progress_str = time_in_second.toString().toHHMMSS() + "/" + piplayer.duration.toString().toHHMMSS();

    } else {}
    $("#lblTimeProgress").text(time_progress_str);

}

function DecodeReportProgress() {

    $("#timeSlider").slider("option", "value", piplayer.currentTime);
    console.log("current time %d s", piplayer.currentTime);
    console.log("current frame %d / frame count %d", piplayer.currentFrame, piplayer.frameCount);

}

function FinishDecode() {
    console.log("current time %d s", piplayer.currentTime);
    console.log("current frame %d / frame count %d", piplayer.currentFrame, piplayer.frameCount);
}


//
//
//
// Jquery UI
//
//
//

$(document).ready(function() {
    initSlider();
    initPlayButton();
});

function initSlider() {
    $("#timeSlider").slider({
        animate: "fast",
        change: function(event, ui) {
            var target_second = ui.value;
			SetTimeProgress(ui.value);
        }
    });
    $("#xshiftSlider").slider({
        animate: "fast",
		max: 2,
		step: 0.1,
		min: -2,
        change: function(event, ui) {
			MoveX(ui.value);	       
       	}
    });
    $("#yshiftSlider").slider({
        animate: "fast",
		max: 2,
		step: 0.1,
		min: -2,
        change: function(event, ui) {
			MoveY(ui.value);	       
		}
    });
    $("#zshiftSlider").slider({
        animate: "fast",
		value: GetCorrectedZunit(45),
		max: 2.0,
		step: 0.01,
		min: 0.0,
        change: function(event, ui) {
			MoveZ(ui.value);		
		}
    });

}

function MoveX(x_unit) {
	piplayer.mvMatrix = GetTranslateMatrix(x_unit, 0,0);
	$("#lblMoveX").text(x_unit.toString() + " unit");
	piplayer.renderFrameGL();
}

function MoveY(y_unit) {
	piplayer.mvMatrix = GetTranslateMatrix(0,y_unit,0);
	$("#lblMoveY").text(y_unit.toString() + " unit");
	piplayer.renderFrameGL();

}

function MoveZ(z_unit) {
	piplayer.viewMatrix = makeLookAtMatrix(0.5, -0.5, z_unit,
		0.5, -0.5, 0.0,
		0.0, 1.0 ,0.0);
	$("#lblMoveZ").text(z_unit.toString() + " unit");
	piplayer.renderFrameGL();

}

function initPlayButton() {
    $("#btnPlayVideo").button({});
    $("#btnPlayVideo").click(PlayOrPauseVideo);
}

