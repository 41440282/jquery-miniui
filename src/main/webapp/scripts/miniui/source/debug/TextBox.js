mini.TextBox = function() {
    mini.TextBox.superclass.constructor.call(this)
};
mini
        .extend(
                mini.TextBox,
                mini.ValidatorBase,
                {
                    name : "",
                    formField : true,
                    selectOnFocus : false,
                    allowInput : true,
                    minWidth : 10,
                    minHeight : 15,
                    maxLength : 5000,
                    emptyText : "",
                    text : "",
                    value : "",
                    defaultValue : "",
                    height : 21,
                    _emptyCls : "mini-textbox-empty",
                    _focusCls : "mini-textbox-focus",
                    _disabledCls : "mini-textbox-disabled",
                    uiCls : "mini-textbox",
                    _InputType : "text",
                    _create : function() {
                        var a = '<input  type="'
                                + this._InputType
                                + '" class="mini-textbox-input" autocomplete="off"/>';
                        if (this._InputType == "textarea") {
                            a = '<textarea  class="mini-textbox-input" autocomplete="off"/></textarea>'
                        }
                        a = '<span class="mini-textbox-border">' + a
                                + "</span>";
                        a += '<input type="hidden"/>';
                        this.el = document.createElement("span");
                        this.el.className = "mini-textbox";
                        this.el.innerHTML = a;
                        this._borderEl = this.el.firstChild;
                        this._textEl = this._borderEl.firstChild;
                        this._valueEl = this._borderEl.lastChild;
                        this._doEmpty()
                    },
                    _initEvents : function() {
                        mini._BindEvents(function() {
                            mini_onOne(this._textEl, "drop", this.__OnDropText,
                                    this);
                            mini_onOne(this._textEl, "change",
                                    this.__OnInputTextChanged, this);
                            mini_onOne(this._textEl, "focus", this.__OnFocus,
                                    this);
                            mini_onOne(this.el, "mousedown",
                                    this.__OnMouseDown, this);
                            var a = this.value;
                            this.value = null;
                            if (this.el) {
                                this.setValue(a)
                            }
                        }, this);
                        this.on("validation", this.__OnValidation, this)
                    },
                    _inputEventsInited : false,
                    _initInputEvents : function() {
                        if (this._inputEventsInited) {
                            return
                        }
                        this._inputEventsInited = true;
                        mini.on(this._textEl, "blur", this.__OnBlur, this);
                        mini.on(this._textEl, "keydown", this.__OnInputKeyDown,
                                this);
                        mini.on(this._textEl, "keyup", this.__OnInputKeyUp,
                                this);
                        mini.on(this._textEl, "keypress",
                                this.__OnInputKeyPress, this)
                    },
                    destroy : function(a) {
                        if (this.el) {
                            this.el.onmousedown = null
                        }
                        if (this._textEl) {
                            this._textEl.ondrop = null;
                            this._textEl.onchange = null;
                            this._textEl.onfocus = null;
                            mini.clearEvent(this._textEl);
                            this._textEl = null
                        }
                        if (this._valueEl) {
                            mini.clearEvent(this._valueEl);
                            this._valueEl = null
                        }
                        mini.TextBox.superclass.destroy.call(this, a)
                    },
                    doLayout : function() {
                        if (this._doLabelLayout) {
                            this._labelLayout()
                        }
                    },
                    setHeight : function(a) {
                        if (parseInt(a) == a) {
                            a += "px"
                        }
                        this.height = a;
                        if (this._InputType == "textarea") {
                            this.el.style.height = a;
                            this.doLayout()
                        }
                    },
                    setName : function(a) {
                        if (this.name != a) {
                            this.name = a;
                            if (this._valueEl) {
                                mini.setAttr(this._valueEl, "name", this.name)
                            }
                        }
                    },
                    setValue : function(a) {
                        if (a === null || a === undefined) {
                            a = ""
                        }
                        a = String(a);
                        if (a.length > this.maxLength) {
                            a = a.substring(0, this.maxLength)
                        }
                        if (this.value !== a) {
                            this.value = a;
                            this._valueEl.value = this._textEl.value = a;
                            this._doEmpty()
                        }
                    },
                    getValue : function() {
                        return this.value
                    },
                    getFormValue : function() {
                        var a = this.value;
                        if (a === null || a === undefined) {
                            a = ""
                        }
                        return String(a)
                    },
                    setAllowInput : function(a) {
                        if (this.allowInput != a) {
                            this.allowInput = a;
                            this.doUpdate()
                        }
                    },
                    getAllowInput : function() {
                        return this.allowInput
                    },
                    _placeholdered : false,
                    _doEmpty : function() {
                        this._textEl.placeholder = this.emptyText;
                        if (this.emptyText) {
                            mini._placeholder(this._textEl)
                        }
                    },
                    setEmptyText : function(a) {
                        if (this.emptyText != a) {
                            this.emptyText = a;
                            this._doEmpty()
                        }
                    },
                    getEmptyText : function() {
                        return this.emptyText
                    },
                    setMaxLength : function(a) {
                        this.maxLength = a;
                        mini.setAttr(this._textEl, "maxLength", a);
                        if (this._InputType == "textarea" && mini.isIE) {
                            mini.on(this._textEl, "keypress",
                                    this.__OnMaxLengthKeyUp, this)
                        }
                    },
                    __OnMaxLengthKeyUp : function(a) {
                        if (this._textEl.value.length >= this.maxLength) {
                            a.preventDefault()
                        }
                    },
                    getMaxLength : function() {
                        return this.maxLength
                    },
                    setReadOnly : function(a) {
                        if (this.readOnly != a) {
                            this.readOnly = a;
                            this.doUpdate()
                        }
                    },
                    setEnabled : function(a) {
                        if (this.enabled != a) {
                            this.enabled = a;
                            this.doUpdate()
                        }
                    },
                    doUpdate : function() {
                        if (this.enabled) {
                            this.removeCls(this._disabledCls)
                        } else {
                            this.addCls(this._disabledCls)
                        }
                        if (this.isReadOnly() || this.allowInput == false) {
                            this._textEl.readOnly = true;
                            mini.addClass(this.el, "mini-textbox-readOnly")
                        } else {
                            this._textEl.readOnly = false;
                            mini.removeClass(this.el, "mini-textbox-readOnly")
                        }
                        if (this.required) {
                            this.addCls(this._requiredCls)
                        } else {
                            this.removeCls(this._requiredCls)
                        }
                        if (this.enabled) {
                            this._textEl.disabled = false
                        } else {
                            this._textEl.disabled = true
                        }
                    },
                    focus : function() {
                        var a = this;
                        setTimeout(function() {
                            try {
                                a._textEl.focus()
                            } catch (b) {
                            }
                        }, 10)
                    },
                    blur : function() {
                        try {
                            this._textEl.blur()
                        } catch (a) {
                        }
                    },
                    selectText : function() {
                        var b = this;
                        function a() {
                            try {
                                b._textEl.select()
                            } catch (c) {
                            }
                        }
                        a();
                        setTimeout(function() {
                            a()
                        }, 30)
                    },
                    getTextEl : function() {
                        return this._textEl
                    },
                    getInputText : function() {
                        return this._textEl.value
                    },
                    setSelectOnFocus : function(a) {
                        this.selectOnFocus = a
                    },
                    getSelectOnFocus : function(a) {
                        return this.selectOnFocus
                    },
                    _errorIconEl : null,
                    getErrorIconEl : function() {
                        if (!this._errorIconEl) {
                            this._errorIconEl = mini.append(this.el,
                                    '<span class="mini-errorIcon"></span>')
                        }
                        return this._errorIconEl
                    },
                    _RemoveErrorIcon : function() {
                        if (this._errorIconEl) {
                            var a = this._errorIconEl;
                            jQuery(a).remove()
                        }
                        this._errorIconEl = null
                    },
                    __OnMouseDown : function(b) {
                        var a = this;
                        if (!mini.isAncestor(this._textEl, b.target)) {
                            setTimeout(function() {
                                a.focus();
                                mini.selectRange(a._textEl, 1000, 1000)
                            }, 1)
                        } else {
                            setTimeout(function() {
                                try {
                                    a._textEl.focus()
                                } catch (c) {
                                }
                            }, 1)
                        }
                    },
                    __OnInputTextChanged : function(c, a) {
                        var b = this.value;
                        this.setValue(this._textEl.value);
                        if (b !== this.getValue() || a === true) {
                            this._OnValueChanged()
                        }
                    },
                    __OnDropText : function(b) {
                        var a = this;
                        setTimeout(function() {
                            a.__OnInputTextChanged(b)
                        }, 0)
                    },
                    __OnInputKeyDown : function(c) {
                        var a = {
                            htmlEvent : c
                        };
                        this.fire("keydown", a);
                        if (c.keyCode == 8
                                && (this.isReadOnly() || this.allowInput == false)) {
                            return false
                        }
                        if (c.keyCode == 27 || c.keyCode == 13
                                || c.keyCode == 9) {
                            if (this._InputType == "textarea"
                                    && c.keyCode == 13) {
                            } else {
                                this.__OnInputTextChanged(null, true);
                                if (c.keyCode == 13) {
                                    var b = this;
                                    b.fire("enter", a)
                                }
                            }
                        }
                        if (c.keyCode == 27) {
                            c.preventDefault()
                        }
                    },
                    __OnInputKeyUp : function(a) {
                        this.fire("keyup", {
                            htmlEvent : a
                        })
                    },
                    __OnInputKeyPress : function(a) {
                        this.fire("keypress", {
                            htmlEvent : a
                        })
                    },
                    __OnFocus : function(a) {
                        this.doUpdate();
                        if (this.isReadOnly()) {
                            return
                        }
                        this._focused = true;
                        this.addCls(this._focusCls);
                        this._initInputEvents();
                        if (this.selectOnFocus) {
                            this.selectText()
                        }
                        this.fire("focus", {
                            htmlEvent : a
                        })
                    },
                    __OnBlur : function(b) {
                        this._focused = false;
                        var a = this;
                        setTimeout(function() {
                            if (a._focused == false) {
                                a.removeCls(a._focusCls)
                            }
                        }, 2);
                        this.fire("blur", {
                            htmlEvent : b
                        });
                        if (this.validateOnLeave && this.isEditable()) {
                            this._tryValidate()
                        }
                    },
                    inputStyle : "",
                    setInputStyle : function(a) {
                        this.inputStyle = a;
                        mini.setStyle(this._textEl, a)
                    },
                    getAttrs : function(b) {
                        var a = mini.TextBox.superclass.getAttrs.call(this, b);
                        var c = jQuery(b);
                        mini._ParseString(b, a, [ "value", "text", "emptyText",
                                "inputStyle", "onenter", "onkeydown",
                                "onkeyup", "onkeypress", "maxLengthErrorText",
                                "minLengthErrorText", "onfocus", "onblur",
                                "vtype", "emailErrorText", "urlErrorText",
                                "floatErrorText", "intErrorText",
                                "dateErrorText", "minErrorText",
                                "maxErrorText", "rangeLengthErrorText",
                                "rangeErrorText", "rangeCharErrorText" ]);
                        mini
                                ._ParseBool(b, a, [ "allowInput",
                                        "selectOnFocus" ]);
                        mini._ParseInt(b, a, [ "maxLength", "minLength",
                                "minHeight", "minWidth" ]);
                        return a
                    },
                    vtype : "",
                    setVtype : function(a) {
                        this.vtype = a
                    },
                    getVtype : function() {
                        return this.vtype
                    },
                    __OnValidation : function(a) {
                        if (a.isValid == false) {
                            return
                        }
                        mini._ValidateVType(this.vtype, a.value, a, this)
                    },
                    setEmailErrorText : function(a) {
                        this.emailErrorText = a
                    },
                    getEmailErrorText : function() {
                        return this.emailErrorText
                    },
                    setUrlErrorText : function(a) {
                        this.urlErrorText = a
                    },
                    getUrlErrorText : function() {
                        return this.urlErrorText
                    },
                    setFloatErrorText : function(a) {
                        this.floatErrorText = a
                    },
                    getFloatErrorText : function() {
                        return this.floatErrorText
                    },
                    setIntErrorText : function(a) {
                        this.intErrorText = a
                    },
                    getIntErrorText : function() {
                        return this.intErrorText
                    },
                    setDateErrorText : function(a) {
                        this.dateErrorText = a
                    },
                    getDateErrorText : function() {
                        return this.dateErrorText
                    },
                    setMaxLengthErrorText : function(a) {
                        this.maxLengthErrorText = a
                    },
                    getMaxLengthErrorText : function() {
                        return this.maxLengthErrorText
                    },
                    setMinLengthErrorText : function(a) {
                        this.minLengthErrorText = a
                    },
                    getMinLengthErrorText : function() {
                        return this.minLengthErrorText
                    },
                    setMaxErrorText : function(a) {
                        this.maxErrorText = a
                    },
                    getMaxErrorText : function() {
                        return this.maxErrorText
                    },
                    setMinErrorText : function(a) {
                        this.minErrorText = a
                    },
                    getMinErrorText : function() {
                        return this.minErrorText
                    },
                    setRangeLengthErrorText : function(a) {
                        this.rangeLengthErrorText = a
                    },
                    getRangeLengthErrorText : function() {
                        return this.rangeLengthErrorText
                    },
                    setRangeCharErrorText : function(a) {
                        this.rangeCharErrorText = a
                    },
                    getRangeCharErrorText : function() {
                        return this.rangeCharErrorText
                    },
                    setRangeErrorText : function(a) {
                        this.rangeErrorText = a
                    },
                    getRangeErrorText : function() {
                        return this.rangeErrorText
                    }
                });
mini.regClass(mini.TextBox, "textbox");
mini.Password = function() {
    mini.Password.superclass.constructor.call(this)
};
mini.extend(mini.Password, mini.TextBox, {
    uiCls : "mini-password",
    _InputType : "password",
    setEmptyText : function(a) {
        this.emptyText = ""
    },
    getValue : function() {
        return this._textEl.value
    }
});
mini.regClass(mini.Password, "password");
mini.TextArea = function() {
    mini.TextArea.superclass.constructor.call(this)
};
mini.extend(mini.TextArea, mini.TextBox, {
    maxLength : 10000000,
    height : "",
    minHeight : 50,
    _InputType : "textarea",
    uiCls : "mini-textarea",
    doLayout : function() {
        if (!this.canLayout()) {
            return
        }
        mini.TextArea.superclass.doLayout.call(this);
        var a = mini.getHeight(this.el);
        if (mini.isIE6) {
            mini.setHeight(this._borderEl, a)
        }
        a -= 2;
        if (a < 0) {
            a = 0
        }
        this._textEl.style.height = a + "px"
    }
});
mini.regClass(mini.TextArea, "textarea");