define(['widget', 'jquery', 'jqueryUI'], function(widget, $, $UI) {

    function Window() {
        this.conf = {
            width: 500,
            height:300,
            title: '系统消息',
            content: '',
            hasCloseBtn: false,
            hasMask: true,
            isDraggable: true,
            dragHandle: null,
            skinClassName: null,
            text4AlertBtn: '确定',
            handler4AlertBtn: null,
            handler4CloseBtn: null,
            text4ConfirmBtn: '确定',      // 以下四项为confirm弹窗参数
            text4CancelBtn: '取消',
            handler4ConfirmBtn: null,
            handler4CancelBtn: null,
            text4PromptBtn: '确定',      // 以下五项为prompt弹窗参数
            isPromptInputPassword: false,
            defaultValue4PromptInput: '',
            maxlength4PromptInput: 10,
            handler4PromptBtn: null
        };
    }

    Window.prototype = $.extend({}, new widget.Widget(), {

        renderUI: function() {
            var footerContent = '';

            switch (this.conf.winType) {
                case 'alert':
                    footerContent = '<input type="button" value="' + this.conf.text4AlertBtn + '" class="window_alertBtn">';
                    break;
                case 'confirm':
                    footerContent = '<input type="button" value="' + this.conf.text4ConfirmBtn + '" class="window_confirmBtn"><input type="button" value="' + this.conf.text4CancelBtn + '" class="window_cancelBtn">';
                    break;
                case 'prompt':
                    this.conf.content += '<p class="window_proptInputWrapper"><input type="' + (this.conf.isPromptInputPassword ? 'password' : 'text') + '" value="' + this.conf.defaultValue4PromptInput + '" maxlength="' + this.conf.maxlength4PromptInput + '" class="window_promptInput"></p>';
                    footerContent = '<input type="button" value="' + this.conf.text4PromptBtn + '" class="window_promptBtn"><input type="button" value="' + this.conf.text4CancelBtn + '" class="window_cancelBtn">';
                    break;
            }
            this.boundingBox = $(
                '<div class="window_boundingBox">' +
                    '<div class="window_body">' + this.conf.content + '</div>' +
                '</div>'
            );

            if (this.conf.winType !== 'common') {
                this.boundingBox.prepend('<div class="window_header">' + this.conf.title + '</div>');
                this.boundingBox.append('<div class="window_footer">' + footerContent + '</div>');
            }
            this._promptInput = this.boundingBox.find('.window_promptInput');

            if (this.conf.hasMask) {
                this._mask = $('<div class="window_mask"></div>');
                this._mask.appendTo('body');
            }

            if (this.conf.hasCloseBtn) {
                this.boundingBox.append('<span class="window_closeBtn">X</span>');
            }

            this.boundingBox.appendTo(document.body);
        },

        bindUI: function() {
            var that = this;
            this.boundingBox.delegate('.window_alertBtn', 'click', function() {
                that.fire('alert');
                that.destroy();
            }).delegate('.window_closeBtn', 'click', function() {
                that.fire('close');
                that.destroy();
            }).delegate('.window_confirmBtn', 'click', function() {
                that.fire('confirm');
                that.destroy();
            }).delegate('.window_cancelBtn', 'click', function() {
                that.fire('cancel');
                that.destroy();
            }).delegate('.window_promptBtn', 'click', function() {
                that.fire('prompt', that._promptInput.val());
                that.destroy();
            });

            if (this.conf.handler4AlertBtn) {
                this.on('alert', this.conf.handler4AlertBtn);
            }

            if (this.conf.handler4CloseBtn) {
                this.on('close', this.conf.handler4CloseBtn);
            }

            if (this.conf.handler4ConfirmBtn) {
                this.on('alert', this.conf.handler4ConfirmBtn);
            }

            if (this.conf.handler4CancelBtn) {
                this.on('cancel', this.conf.handler4CancelBtn);
            }

            if (this.conf.handler4PromptBtn) {
                this.on('prompt', this.conf.handler4PromptBtn);
            }
        },

        initUI: function() {
            this.boundingBox.css({
                width: this.conf.width + 'px',
                height: this.conf.height + 'px',
                left: (this.conf.x || (window.innerWidth - this.conf.width) / 2) + 'px',
                top: (this.conf.y || (window.innerHeight - this.conf.height) / 2) + 'px'
            });

            if (this.conf.skinClassName) {
                this.boundingBox.addClass(this.conf.skinClassName);
            }

            if (this.conf.isDraggable) {

                if (this.conf.dragHandle) {
                    this.boundingBox.draggable({handle: this.conf.dragHandle});
                } else {
                    this.boundingBox.draggable();
                }
            }
        },

        destructor: function() {
            this._mask && this._mask.remove();
        },

        alert: function(conf) {
            $.extend(this.conf, conf, {winType: 'alert'});
            this.render();
            return this;    // 实现链式调用
        },
        confirm: function(conf) {
            $.extend(this.conf, conf, {winType: 'confirm'});
            this.render();
            return this;
        },
        prompt: function(conf) {
            $.extend(this.conf, conf, {winType: 'prompt'});
            this.render();
            this._promptInput.focus();
            return this;
        },
        common: function(conf) {
            $.extend(this.conf, conf, {winType: 'common'});
            this.render();
            return this;
        }
    })

    return {
        Window: Window
    }
})