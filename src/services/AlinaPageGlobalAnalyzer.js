import lodash from "lodash";

const AlinaPageGlobalAnalyzer = {
    /**##################################################*/
    //region iFrame
    pageIsInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },
    pageRecalcIframeHeight: lodash.debounce((className) => {
        const inIframe = AlinaPageGlobalAnalyzer.pageIsInIframe();
        let iframe     = null;
        if (inIframe) {
            if (className) {
                const iframeList = parent.document.getElementsByClassName(className);
                if (iframeList && iframeList[0]) {
                    iframe = iframeList[0];
                }
            }
            if (iframe) {
                let height          = document.body.scrollHeight;
                height              = height + 100;
                height              = height + 'px';
                iframe.style.height = height;
            }
        }
    }, 300),
    //endregion iFrame
    /**##################################################*/
    // region AUDIO
    AlinaAudioPlayer: {
        trackList:                [],
        defineTrackList:          function () {
            this.trackList = document.getElementsByTagName('audio');
            return this.trackList;
        },
        eventHandlerOnEnded:      function (e) {
            var trackList = AlinaPageGlobalAnalyzer.AlinaAudioPlayer.trackList;
            if (trackList[this.nextToPlay])
                trackList[this.nextToPlay].play();
        },
        eventHandlerOnPlay:       function (e) {
            var trackList = AlinaPageGlobalAnalyzer.AlinaAudioPlayer.trackList;

            for (var i = 0; i < trackList.length; i++) {
                if (i === this.myCurrentListIndex) {
                    continue;
                }

                if (trackList[i].pause) {
                    trackList[i].pause();
                    trackList[i].currentTime = 0;
                }
            }
        },
        removeAudioEventHandlers: function (e) {
            var trackList = this.trackList;
            for (var i = 0; i < trackList.length; i++) {
                trackList[i].removeEventListener('ended', this.eventHandlerOnEnded);
                trackList[i].removeEventListener('play', this.eventHandlerOnPlay);
            }
        },
        addAudioEventHandlers:    function () {
            var trackList = this.defineTrackList();
            this.removeAudioEventHandlers();
            for (var i = 0; i < trackList.length; i++) {
                trackList[i].myCurrentListIndex = i;
                if (trackList[i + 1]) trackList[i].nextToPlay = i + 1;

                trackList[i].addEventListener('ended', this.eventHandlerOnEnded, false);
                trackList[i].addEventListener('play', this.eventHandlerOnPlay, false);
            }
        }
    },
    // endregion AUDIO
    /**##################################################*/
};
export default AlinaPageGlobalAnalyzer;