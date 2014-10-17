+function ($) { "use strict";

  var Highlighter = function (element, options) {
    this.init(element, options)
  }

  Highlighter.prototype.init = function (element, options) {
    this.$element = $(element)

    this.loadStyles();
    this.loadWidgets();
    this.loadPopover();
    this.bindEvents();
  }

  Highlighter.prototype.bindEvents = function() {
    var _this = this;
    _this.$element.mouseup(function(e) {
      _this.checkTextSelection(_this);
      e.stopPropagation();
    });
    $(document).mouseup(function(e) {
      _this.hide();
    });

    $('#highlighter-share-facebook').click(function(e) {
      var facebook_dialog_url = "https://www.facebook.com/sharer/sharer.php?u=" + document.URL;
      var facebook_popup = window.open(facebook_dialog_url,'facebook-share','height=600,width=500');
      if (window.focus) {facebook_popup.focus()}
      _this.hide();
    });

    $('#highlighter-share-twitter').click(function(e) {
      var twitter_intent_url = "https://twitter.com/intent/tweet?text=" + _this.getText() + "&url=" + document.URL;
      var twitter_popup = window.open(twitter_intent_url,'twitter-share','height=600,width=500');
      if (window.focus) {twitter_popup.focus()}
      _this.hide();
    });
    $('#highlighter-share-facebook').mousedown(function(e){
      e.preventDefault();
    })
    $('#highlighter-share-twitter').mousedown(function(e){
      e.preventDefault();
    })
  }

  Highlighter.prototype.getText = function() {
    var highlighted = window.getSelection().toString();
    var text = highlighted.length > 115 ? '' + window.getSelection().toString().substring(0, 112) + '...' : highlighted;
    text = '"' + text + '"';
    return text;
  }

  Highlighter.prototype.loadPopover = function() {
    if (!document.getElementById('highlighter-share-wrapper')) {
      $("<div id='highlighter-share-wrapper'>" +
          "<div id='highlighter-share-popover-inner'>" + 
            "<div id='highlighter-share-facebook'><i class='icon-facebook icon-light'></i></div>" +
            "<div id='highlighter-share-twitter'><i class='icon-twitter icon-light'></i></div>" + 
          "</div>" +
          "<div id='highlighter-share-arrow-wrapper'>" +
            "<span id='highlighter-share-arrow'></span>" +
          "</div>" +
        "</div>"
      ).appendTo('body');
    }
  }

  Highlighter.prototype.loadStyles = function() {
    var head  = document.getElementsByTagName('head')[0];
    if (!document.getElementById('font_awesome')) {
      var font_awesome  = document.createElement('link');
      font_awesome.id   = 'font_awesome';
      font_awesome.rel  = 'stylesheet';
      font_awesome.type = 'text/css';
      font_awesome.href = 'http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css';
      font_awesome.media = 'all';
      head.appendChild(font_awesome);
    }

    // medium share css
    if (!document.getElementById('medium_share_css')) {
      var style = document.createElement('style');
      style.id = "medium_share_css";
      style.textContent = "#highlighter-share-wrapper {\
        display: none;\
        z-index: 500;\
        position: absolute;\
        -webkit-animation-delay: 0s;\
        -webkit-animation-direction: normal;\
        -webkit-animation-duration: 0.18s;\
        -webkit-animation-fill-mode: forwards;\
        -webkit-animation-iteration-count: 1;\
        -webkit-animation-name: pop-upwards;\
        -webkit-animation-timing-function: linear;\
        -webkit-transition-delay: 0s, 0s;\
        -webkit-transition-duration: 0.075s, 0.075s;\
        -webkit-transition-property: top, left;\
        -webkit-transition-timing-function: ease-out, ease-out;\
        transition-delay: 0s, 0s;\
        transition-duration: 0.075s, 0.075s;\
        transition-property: top, left;\
        transition-timing-function: ease-out, ease-out;\
      }\
      #highlighter-share-wrapper:after {\
        content: '';\
        display: block;\
        position: absolute;\
        bottom: -3px;\
        left: 50%;\
        margin-left: -4px;\
        width: 8px;\
        height: 8px;\
        -webkit-transform: rotate(45deg);\
        -moz-transform: rotate(45deg);\
        -o-transform: rotate(45deg);\
        transform: rotate(45deg);\
        background: #262625;\
        box-shadow: 0 0 2px #262625;\
      }\
      #highlighter-share-popover-inner {\
        height: 42px;\
        width: 80px;\
        background-repeat: repeat-x;\
        background-image: -webkit-gradient(linear,0 0,0 100%,from(rgba(49,49,47,0.97)),to(#262625));\
        background-image: -moz-linear-gradient(top,rgba(49,49,47,0.97),#262625);\
        background-image: -webkit-linear-gradient(top,rgba(49,49,47,0.97),#262625);\
        background-image: -o-linear-gradient(top,rgba(49,49,47,0.97),#262625);\
        background-image: linear-gradient(rgba(49, 49, 47, 0.972549), rgb(38, 38, 37)); \
        -webkit-box-shadow: rgba(0, 0, 0, 0.701961) 0px 1px 3px -1px, rgba(255, 255, 255, 0.0666667) 0px 0px 1px 0px inset, rgba(255, 255, 255, 0.14902) 0px 0px 2px 0px inset;\
        box-shadow: rgba(0, 0, 0, 0.701961) 0px 1px 3px -1px, rgba(255, 255, 255, 0.0666667) 0px 0px 1px 0px inset, rgba(255, 255, 255, 0.14902) 0px 0px 2px 0px inset;\
        border-top-color: rgb(38, 38, 37);\
        border-bottom-color: rgb(18, 18, 17);\
        border-left-color: rgb(28, 28, 27);\
        border-right-color: rgb(28, 28, 27);\
        border: 1px solid;\
        border-radius: 5px;\
      }\
      #highlighter-share-facebook, #highlighter-share-twitter {\
        height: 30px;\
        width: 40px;\
        display: inline-block;\
        padding-top: 10px;\
        cursor: pointer;\
        font-size: 1.35em;\
      }\
      #highlighter-share-facebook i {\
        margin-left: 17px;\
      }\
      #highlighter-share-twitter i {\
        margin-left: 5px;\
      }\
      #highlighter-share-arrow-wrapper {\
        display: block;\
        position: absolute;\
        bottom: -11px;\
        left: 50%;\
        clip: rect(12px 24px 24px 0);\
        margin-left: -12px;\
        color: rgb(51, 51, 50);\
      }\
      #highlighter-share-arrow {\
        display: block;\
        width: 20px;\
        height: 20px;\
        -webkit-transform: rotate(45deg) scale(0.5);\
        -moz-transform: rotate(45deg) scale(0.5);\
        -o-transform: rotate(45deg) scale(0.5);\
        transform: rotate(45deg) scale(0.5);\
        background-color: #454543;\
        border: 2px solid #121211;\
      }\
      ";
      document.body.appendChild(style);
    }
  }

  Highlighter.prototype.loadWidgets = function() {
    var twitter_widget = "http://platform.twitter.com/widgets.js";
    if (!$("script[src='" + twitter_widget + "']").length) {
      $("<script type='text/javascript' src='" + twitter_widget + "'></script>").appendTo('body');
    }
  }

  Highlighter.prototype.show = function(x, y) {
    x = x - 40;
    y = y - 20 - 40;
    $("#highlighter-share-wrapper").css({ top: y+'px', left: x+'px' });
    $("#highlighter-share-wrapper").fadeIn(100);
  }

  Highlighter.prototype.hide = function() {
    $("#highlighter-share-wrapper").fadeOut(100);
  }

  Highlighter.prototype.checkTextSelection = function(popover) {
    var selected_text = "";
    if (typeof window.getSelection != "undefined") {
      selected_text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
      selected_text = document.selection.createRange().text;
    }

    if (selected_text && selected_text.length > 0) {
      // find the bounding box of the highlighted text
      var rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
      var y = rect.bottom - rect.height + document.body.scrollTop + 6;
      var x = rect.left + rect.width / 2 + document.body.scrollLeft;
      popover.show(x, y);
    } else {
      popover.hide();
    }
  }

  var old = $.fn.highlighter
  $.fn.highlighter = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('highlighter')
      var options = typeof option == 'object' && option

      if (!data) $this.data('highlighter', (data = new Highlighter(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }
  $.fn.highlighter.Constructor = Highlighter

}(window.jQuery);