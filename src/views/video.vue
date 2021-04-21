<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <div style="display:flex; margin-bottom: 10px; flex-direction: column;">
            <!-- 原生播放 -->
            <video id="video" width="300" height="180" class="centeredVideo" controls autoplay>
                Your browser is too old which doesn't support HTML5 video.
                <source
                    src='https://movies-ds.jiaffei.com/movies/20190710/f0e8023223e39bfb3534217b950ac020?sign=c3f68c7cfccb148b7a44114dfffc3102&t=5d26f23b'>
            </video>
            <!-- flv.js播放mp4 -->
            <video id="video1" width="300" height="180" class="centeredVideo" controls autoplay>
                Your browser is too old which doesn't support HTML5 video.
            </video>
            <!-- flv.js播放flv -->
            <video id="video2" width="300" height="180" class="centeredVideo" controls autoplay>
                Your browser is too old which doesn't support HTML5 video.
            </video>
            <!-- video.js播放mp4 -->
            <video id="video3" class="video-js">
                Your browser is too old which doesn't support HTML5 video.
            </video>
            <!-- video.js播放mp4 -->
            <video id='video4' class='video-js' controls width='300' height='180' data-setup='{}'>
                <source
                    src='https://movies-ds.jiaffei.com/movies/20190710/f0e8023223e39bfb3534217b950ac020?sign=c3f68c7cfccb148b7a44114dfffc3102&t=5d26f23b'
                    type='video/mp4'>
            </video>
        </div>
    </div>
</template>

<script>
import flvjs from "flv.js";
const img = require("@/assets/1000.jpg");

export default {
	name: "HelloWorld",
	data() {
		const item = {
			date: "2016-05-02",
			name: "王小虎_" + parseInt(Math.random() * 10000),
			address: this.$route.meta.title,
		};
		return {
			tableData: Array(20).fill(item),
		};
	},
	computed: {
		msg: function () {
			return "Welcome to Your Vue.js App" + this.$route.meta.title;
		},
	},
	mounted() {
		var videoElement = document.getElementById("video1");
		var flvPlayer = flvjs.createPlayer({
			type: "mp4",
			url:
				"https://movies-ds.jiaffei.com/movies/20190710/f0e8023223e39bfb3534217b950ac020?sign=c3f68c7cfccb148b7a44114dfffc3102&t=5d26f23b",
		});

		flvPlayer.attachMediaElement(videoElement);
		flvPlayer.load();
		flvPlayer.play();

		var videoElement2 = document.getElementById("video2");
		var flvPlayer = flvjs.createPlayer({
			type: "flv",
			url:
				"https://movies-ds.jiaffei.com/movies/20190707/98e2d9a64a34f552cf08a2ed8106b125?sign=8fd32a9a51c39be02703fc375cf75cb4&t=5d26f26a",
		});

		flvPlayer.attachMediaElement(videoElement2);
		flvPlayer.load();
		flvPlayer.play();

		var options = {
			controls: true,
			height: 180,
			width: 300,
			poster: img,
			preload: "none",
			loop: true,
			liveui: true,
			autoplay: true,
			sources: [
				{
					src:
						"https://movies-ds.jiaffei.com/movies/20190710/f0e8023223e39bfb3534217b950ac020?sign=c3f68c7cfccb148b7a44114dfffc3102&t=5d26f23b",
					type: "video/mp4",
				},
			],
		};

		var player = videojs("video3", options, function onPlayerReady() {
			this.play();
			this.on("ended", function () {
				videojs.log("视频播放完毕");
			});
		});
	},
};
</script>

<style scoped>
h1,
h2 {
	font-weight: normal;
	margin: 0;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}

.hello {
	padding: 15px;
}

.centeredVideo {
	margin-bottom: 10px;
}
.video-js {
	margin-bottom: 10px;
}
</style>
