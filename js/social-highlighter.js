jQuery(document).ready(function($) {

    var SocialHighlighterShare = function(options) {

        var self = this;

        options = options || {};
        if (typeof options == 'string')
        options = {
            elements: options
        };

        this.sel = null;
        this.textSelection = '';
        this.htmlSelection = '';

        this.getSelectionText = function(sel) {
            var html = "",
            text = "";
            var sel = sel || window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                text = container.textContent;
                html = container.innerHTML
            }
            self.textSelection = text;
            self.htmlSelection = html || text;
            return text;
        };

        this.selectionDirection = function(selection) {
            var sel = selection || window.getSelection();
            var range = document.createRange();
            if (!sel.anchorNode) return 0;
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);
            var direction = (range.collapsed) ? "backward": "forward";
            range.detach();
            return direction;
        };

        this.showPopunder = function() {
            self.popunder = self.popunder || document.getElementById('socialHighlighterSharePopunder');

            var sel = window.getSelection();
            var selection = self.getSelectionText(sel);

            if (sel.isCollapsed || selection.length < 10 || !selection.match(/ /))
            return self.hidePopunder();

            if (self.popunder.classList.contains("fixed"))
            return self.popunder.style.bottom = 0;

            var range = sel.getRangeAt(0);
            var node = range.endContainer.parentNode;

            if (self.popunder.classList.contains('show')) {
                if (Math.ceil(self.popunder.getBoundingClientRect().top) == Math.ceil(node.getBoundingClientRect().bottom))
                return;

                return self.hidePopunder(self.showPopunder);
            }

            if (node.nextElementSibling) {
                self.pushSiblings(node);
            } else {
                if (!self.placeholder) {
                    self.placeholder = document.createElement('div');
                    self.placeholder.className = 'socialHighlighterSharePlaceholder';
                }

                var margin = window.getComputedStyle(node).marginBottom;
                self.placeholder.style.height = margin;
                self.placeholder.style.marginBottom = ( - 2 * parseInt(margin, 10)) + 'px';
                node.parentNode.insertBefore(self.placeholder);
            }

            var offsetTop = window.pageYOffset + node.getBoundingClientRect().bottom;
            self.popunder.style.top = Math.ceil(offsetTop) + 'px';

            setTimeout(function() {
                if (self.placeholder) self.placeholder.classList.add('show');
                self.popunder.classList.add('show');
            },
            0);

        };

        this.pushSiblings = function(el) {
            while (el = el.nextElementSibling) {
                el.classList.add('socialHighlighterShare');
                el.classList.add('moveDown');
            }
        };

        this.hidePopunder = function(cb) {
            cb = cb ||
            function() {};

            if (self.popunder == "fixed") {
                self.popunder.style.bottom = '-50px';
                return cb();
            }

            self.popunder.classList.remove('show');
            if (self.placeholder) self.placeholder.classList.remove('show');

            var els = document.getElementsByClassName('moveDown');
            while (el = els[0]) {
                el.classList.remove('moveDown');
            }

            setTimeout(function() {
                if (self.placeholder) document.body.insertBefore(self.placeholder);
                cb();
            },
            600);

        };

        this.show = function(e) {
            setTimeout(function() {
                var sel = window.getSelection();
                var selection = self.getSelectionText(sel);
                if (!sel.isCollapsed && selection && selection.length > 10 && selection.match(/ /)) {
                    var range = sel.getRangeAt(0);
                    var topOffset = range.getBoundingClientRect().top - 5;
                    var top = topOffset + window.scrollY - self.$popover.height();
                    var left = 0;
                    if (e) {
                        left = e.pageX;
                    } else {
                        var obj = sel.anchorNode.parentNode;
                        left += obj.offsetWidth / 2;
                        do {
                            left += obj.offsetLeft;
                        }
                        while (obj = obj.offsetParent);
                    }
                    switch (self.selectionDirection(sel)) {
                    case 'forward':
                        left -= self.$popover.width();
                        break;
                    case 'backward':
                        left += self.$popover.width();
                        break;
                    default:
                        return;
                    }
                    self.$popover.removeClass("anim").css("top", top + 10).css("left", left).show();
                    setTimeout(function() {
                        self.$popover.addClass("anim").css("top", top);
                    },
                    0);
                }
            },
            10);
        };

        this.hide = function(e) {
            self.$popover.hide();
        };

        this.smart_truncate = function(str, n) {
            if (!str || !str.length) return str;
            var toLong = str.length > n,
            s_ = toLong ? str.substr(0, n - 1) : str;
            s_ = toLong ? s_.substr(0, s_.lastIndexOf(' ')) : s_;
            return toLong ? s_ + '...': s_;
        };

        this.getRelatedTwitterAccounts = function() {
            var usernames = [];

            var creator = $('meta[name="twitter:creator"]').attr("content") || $('meta[name="twitter:creator"]').attr("value");
            if (creator) usernames.push(creator);

            var anchors = document.getElementsByTagName('a');
            for (var i = 0, len = anchors.length; i < len; i++) {
                if (anchors[i].attributes.href && typeof anchors[i].attributes.href.value == 'string') {
                    var matches = anchors[i].attributes.href.value.match(/^https?:\/\/twitter\.com\/([a-z0-9_]{1,20})/i)
                    if (matches && matches.length > 1 && ['widgets', 'intent'].indexOf(matches[1]) == -1)
                    usernames.push(matches[1]);
                }
            }

            if (usernames.length > 0) return usernames.join(',');
            else return '';
        };

        this.shareTwitter = function(e) {
            e.preventDefault();

            if (!self.viaTwitterAccount) {
                self.viaTwitterAccount = $('meta[name="twitter:site"]').attr("content") || $('meta[name="twitter:site"]').attr("value") || "";
                self.viaTwitterAccount = self.viaTwitterAccount.replace(/@/, '');
            }

            if (!self.relatedTwitterAccounts) {
                self.relatedTwitterAccounts = self.getRelatedTwitterAccounts();
            }

            var text = "“" + self.smart_truncate(self.textSelection.trim(), 114) + "”";
            var url = 'http://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&related=' + self.relatedTwitterAccounts + '&url=' + encodeURIComponent(window.location.href);

            if (self.viaTwitterAccount && text.length < (120 - 6 - self.viaTwitterAccount.length))
            url += '&via=' + self.viaTwitterAccount;

            var w = 640,
            h = 440;
            var left = (screen.width / 2) - (w / 2);
            var top = (screen.height / 2) - (h / 2) - 100;
            window.open(url, "share_twitter", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ',       top=' + top + ', left=' + left);
            self.hide();
            return false;
        };

        this.shareEmail = function(e) {
            var text = self.htmlSelection.replace(/<p[^>]*>/ig, '\n').replace(/<\/p>|  /ig, '').trim();
            var email = {};
            email.subject = encodeURIComponent("Quote from " + document.title);
            email.body = encodeURIComponent("“" + text + "”") + "%0D%0A%0D%0AFrom: " + document.title + "%0D%0A" + window.location.href;
            $(this).attr("href", "mailto:?subject=" + email.subject + "&body=" + email.body);
            self.hide();
            return true;
        };

        this.render = function() {
            var popoverHTML = '<div class="socialHighlighterShare" id="socialHighlighterSharePopover" style="position:absolute;">'
            + '  <div id="socialHighlighterSharePopover-inner">'
            + '    <ul>'
            + '      <li><a class="action tweet" href="" title="Share on Twitter" target="_blank">Tweet</a></li>'
            + '      <li><a class="action email" href="" title="Share by email" target="_blank"><svg width="20" height="20"><path stroke="#FFF" stroke-width="6" d="m16,25h82v60H16zl37,37q4,3 8,0l37-37M16,85l30-30m22,0 30,30"/></svg></a></li>'
            + '    </ul>'
            + '  </div>'
            + '  <div class="socialHighlighterSharePopover-clip"><span class="socialHighlighterSharePopover-arrow"></span></div>'
            + '</div>';

            var popunderHTML = '<div id="socialHighlighterSharePopunder" class="socialHighlighterShare">'
            + '  <div id="socialHighlighterSharePopunder-inner">'
            + '    <label>Share selection</label>'
            + '    <ul>'
            + '      <li><a class="action tweet" href="" title="Share on Twitter" target="_blank">Tweet</a></li>'
            + '      <li><a class="action email" href="" title="Share by email" target="_blank"><svg width="20" height="20"><path stroke="#FFF" stroke-width="6" d="m16,25h82v60H16zl37,37q4,3 8,0l37-37M16,85l30-30m22,0 30,30"/></svg></a></li>'
            + '    </ul>'
            + '  </div>'
            + '</div>';

            self.$popover = $(popoverHTML);
            self.$popover.find('a.tweet').click(self.shareTwitter);
            self.$popover.find('a.email').click(self.shareEmail);

            $('body').append(self.$popover);

            self.$popunder = $(popunderHTML);
            self.$popunder.find('a.tweet').click(self.shareTwitter);
            self.$popunder.find('a.email').click(self.shareEmail);
            $('body').append(self.$popunder);
        };

        this.setElements = function(elements) {
            if (typeof elements == 'string') elements = $(elements);
            self.$elements = elements instanceof $ ? elements: $(elements);
            self.$elements.mouseup(self.show).mousedown(self.hide).addClass("selectionShareable");

            self.$elements.bind('touchstart',
            function(e) {
                self.isMobile = true;
            });

            document.onselectionchange = self.selectionChanged;
        };

        this.selectionChanged = function(e) {
            if (!self.isMobile) return;

            if (self.lastSelectionChanged) {
                clearTimeout(self.lastSelectionChanged);
            }
            self.lastSelectionChanged = setTimeout(function() {
                self.showPopunder(e);
            },
            300);
        };

        this.render();

        if (options.elements) {
            this.setElements(options.elements);
        }

    };

    $.fn.socialHighlighterShare = function() {
        var sharer = new SocialHighlighterShare();
        sharer.setElements(this);
        return this;
    };

    if (typeof define == 'function') {
        define(function() {
            SocialHighlighterShare.load = function(name, req, onLoad, config) {
                var sharer = new SocialHighlighterShare();
                sharer.setElements('p');
                onLoad();
            };
            return SocialHighlighterShare;
        });

    } else {
        window.SocialHighlighterShare = SocialHighlighterShare;
    }

})(jQuery);