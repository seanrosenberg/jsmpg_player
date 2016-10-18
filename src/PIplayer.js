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

    /* var btnPlay = document.getElementById("btnPlayVideo"); */
    // btnPlay.onclick = function(e) {
    //     PlayOrPauseVideo();
    /* }; */

}



function PlayOrPauseVideo() {
    if (!piplayer.playing) {
        piplayer.play();
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

}

function initPlayButton() {
    $("#btnPlayVideo").button({});
    $("#btnPlayVideo").click(PlayOrPauseVideo);
}
