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
	
	var btnPlay = document.getElementById("btnPlayVideo");
    btnPlay.onclick = function(e) {
        PlayOrPauseVideo();
    };

}



function PlayOrPauseVideo() {
    if (!piplayer.playing) {
        piplayer.play();
    } else {
        piplayer.pause();
    }

}

function PlayerOnLoad() {
	console.log("total duratopn %d s", piplayer.duration);
   }

function DecodeReportProgress() {
	console.log("current time %d s" , piplayer.currentTime);
	console.log("current frame %d / frame count %d" , piplayer.currentFrame, piplayer.frameCount);

}

function FinishDecode() {
	console.log("current time %d s" , piplayer.currentTime);
	console.log("current frame %d / frame count %d" , piplayer.currentFrame, piplayer.frameCount);
}
