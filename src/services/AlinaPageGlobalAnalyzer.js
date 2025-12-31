import lodash from "lodash";

const AlinaPageGlobalAnalyzer = {
    /**##################################################*/
    // region idNameKey
    idNameKeyCurrent: 0,
    idNameKeyNext: function () {
        AlinaPageGlobalAnalyzer.idNameKeyCurrent++;
        return `alina-uniq-key-${AlinaPageGlobalAnalyzer.idNameKeyCurrent}`;
    },
    // endregion idNameKey
    /**##################################################*/
    //region iFrame
    pageIsInIframe() {
        try {
            return window !== parent || !!window.frameElement || window.top !== window.self;
        } catch (e) {
            // Cross-origin access denied → assume we're in iframe
            return true;
        }
    },

    pageRecalcIframeHeight: lodash.debounce((iframeClassName, heightRefClassName) => {

        const inIframe = AlinaPageGlobalAnalyzer.pageIsInIframe();

        if (!inIframe) {
            return;
        }

        if (!iframeClassName) {
            return;
        }

        if (!heightRefClassName) {
            return;
        }

        if (!document) {
            return;
        }

        const el = document.getElementsByClassName(heightRefClassName)[0];

        if (!el) {
            return;
        }

        let height = Math.max(
            el.offsetHeight,
            el.clientHeight,
            el.scrollHeight,
            el.getBoundingClientRect().height,
        );

        const iframeList = parent.document.getElementsByClassName(iframeClassName);

        if (iframeList?.length <= 0) {
            return;
        }

        for (const iframe of iframeList) {

            if (!iframe.contentDocument) {
                continue;
            }

            height = height + 50;
            height = height + 'px';
            iframe.style.height = height;
        }
    }, 200),
    //endregion iFrame
    /**##################################################*/
    // region AUDIO
    AlinaAudioPlayer: {
        trackList: [],
        defineTrackList: function () {
            this.trackList = document.getElementsByTagName('audio');
            return this.trackList;
        },
        eventHandlerOnEnded: function (e) {
            var trackList = AlinaPageGlobalAnalyzer.AlinaAudioPlayer.trackList;
            if (trackList[this.nextToPlay])
                trackList[this.nextToPlay].play();
        },
        eventHandlerOnPlay: function (e) {
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
        addAudioEventHandlers: function () {
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