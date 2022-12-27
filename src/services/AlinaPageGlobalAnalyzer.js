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
  }, 300)
  //endregion iFrame
  /**##################################################*/
};
export default AlinaPageGlobalAnalyzer;