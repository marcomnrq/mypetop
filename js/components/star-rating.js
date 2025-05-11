/*!
 * bootstrap-star-rating v4.1.0
 * http://plugins.krajee.com/star-rating
 *
 * Author: Kartik Visweswaran
 * Copyright: 2013 - 2021, Kartik Visweswaran, Krajee.com
 *
 * Licensed under the BSD 3-Clause
 * https://github.com/kartik-v/bootstrap-star-rating/blob/master/LICENSE.md
 */
!((t) => {
	"function" == typeof define && define.amd
		? define(["jquery"], t)
		: "object" == typeof module && module.exports
			? (module.exports = t(require("jquery")))
			: t(window.jQuery);
})((t) => {
	(t.fn.ratingLocales = {}), (t.fn.ratingThemes = {});
	var e, a;
	(e = {
		NAMESPACE: ".rating",
		DEFAULT_MIN: 0,
		DEFAULT_MAX: 5,
		DEFAULT_STEP: 0.5,
		isEmpty: (e, a) =>
			null === e || void 0 === e || 0 === e.length || (a && "" === t.trim(e)),
		getCss: (t, e) => (t ? " " + e : ""),
		addCss: (t, e) => {
			t.removeClass(e).addClass(e);
		},
		getDecimalPlaces: (t) => {
			var e = ("" + t).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
			return e ? Math.max(0, (e[1] ? e[1].length : 0) - (e[2] ? +e[2] : 0)) : 0;
		},
		applyPrecision: (t, e) => Number.parseFloat(t.toFixed(e)),
		handler: (a, n, i, r, s) => {
			var o = s ? n : n.split(" ").join(e.NAMESPACE + " ") + e.NAMESPACE;
			r || a.off(o),
				a.on(o, (e) => {
					var a = t.proxy(i, self);
					a(e);
				});
		},
	}),
		(a = function (e, a) {
			(this.$element = t(e)), this._init(a);
		}),
		(a.prototype = {
			constructor: a,
			_parseAttr: function (t, a) {
				var n,
					i,
					r,
					s,
					l = this.$element,
					c = l.attr("type");
				if ("range" === c || "number" === c) {
					switch (((i = a[t] || l.data(t) || l.attr(t)), t)) {
						case "min":
							r = e.DEFAULT_MIN;
							break;
						case "max":
							r = e.DEFAULT_MAX;
							break;
						default:
							r = e.DEFAULT_STEP;
					}
					(n = e.isEmpty(i) ? r : i), (s = Number.parseFloat(n));
				} else s = Number.parseFloat(a[t]);
				return isNaN(s) ? r : s;
			},
			_parseValue: function (t) {
				var a = Number.parseFloat(t);
				return (
					isNaN(a) && (a = this.clearValue),
					!this.zeroAsNull || (0 !== a && "0" !== a) ? a : null
				);
			},
			_setDefault: function (t, a) {
				e.isEmpty(this[t]) && (this[t] = a);
			},
			_initSlider: function (t) {
				var n = this.$element.val();
				(this.initialValue = e.isEmpty(n) ? 0 : n),
					this._setDefault("min", this._parseAttr("min", t)),
					this._setDefault("max", this._parseAttr("max", t)),
					this._setDefault("step", this._parseAttr("step", t)),
					(isNaN(this.min) || e.isEmpty(this.min)) &&
						(this.min = e.DEFAULT_MIN),
					(isNaN(this.max) || e.isEmpty(this.max)) &&
						(this.max = e.DEFAULT_MAX),
					(isNaN(this.step) || e.isEmpty(this.step) || 0 === this.step) &&
						(this.step = e.DEFAULT_STEP),
					(this.diff = this.max - this.min),
					this._setDefault("minThreshold", this.min),
					this.minThreshold < this.min && (this.minThreshold = this.min),
					this.minThreshold > this.max && (this.minThreshold = this.max);
			},
			_initHighlight: function (t) {
				var e,
					n = this._getCaption();
				t || (t = this.$element.val()),
					(e = this.getWidthFromValue(t) + "%"),
					this.$filledStars.width(e),
					(this.cache = { caption: n, width: e, val: t });
			},
			_getContainerCss: function () {
				return (
					"rating-container" +
					e.getCss(this.theme, "theme-" + this.theme) +
					e.getCss(this.rtl, "rating-rtl") +
					e.getCss(this.size, "rating-" + this.size) +
					e.getCss(this.animate, "rating-animate") +
					e.getCss(this.disabled || this.readonly, "rating-disabled") +
					e.getCss(this.containerClass, this.containerClass) +
					(this.displayOnly ? " is-display-only" : "")
				);
			},
			_checkDisabled: function () {
				var e = this.$element,
					a = this.options;
				(this.disabled =
					void 0 === a.disabled ? e.attr("disabled") || !1 : a.disabled),
					(this.readonly =
						void 0 === a.readonly ? e.attr("readonly") || !1 : a.readonly),
					(this.inactive = this.disabled || this.readonly),
					e.attr({ disabled: this.disabled, readonly: this.readonly });
			},
			_addContent: function (t, e) {
				var n = this.$container,
					i = "clear" === t;
				return this.rtl
					? i
						? n.append(e)
						: n.prepend(e)
					: i
						? n.prepend(e)
						: n.append(e);
			},
			_generateRating: function () {
				var a,
					n,
					i,
					s = this.$element;
				(n = this.$container =
					t(document.createElement("div")).insertBefore(s)),
					e.addCss(n, this._getContainerCss()),
					(this.$rating = a =
						t(document.createElement("div"))
							.attr("class", "rating-stars")
							.appendTo(n)
							.append(this._getStars("empty"))
							.append(this._getStars("filled"))),
					this.keyboardEnabled && this.$rating.attr("tabindex", this.tabindex),
					(this.$emptyStars = a.find(".empty-stars")),
					(this.$filledStars = a.find(".filled-stars")),
					this._renderCaption(),
					this._renderClear(),
					this._initHighlight(),
					this._initStarTitles();
				this.rtl &&
					((i = Math.max(
						this.$emptyStars.outerWidth(),
						this.$filledStars.outerWidth(),
					)),
					this.$emptyStars.width(i)),
					n.insertBefore(s);
			},
			_getCaption: function () {
				return this.$caption && this.$caption.length
					? this.$caption.html()
					: this.defaultCaption;
			},
			_setCaption: function (t) {
				this.$caption && this.$caption.length && this.$caption.html(t);
			},
			_renderCaption: function () {
				var a,
					i = this.$element.val(),
					r = this.captionElement ? t(this.captionElement) : "";
				if (this.showCaption) {
					if (((a = this.fetchCaption(i)), r && r.length))
						return e.addCss(r, "caption"), r.html(a), void (this.$caption = r);
					this._addContent("caption", '<div class="caption">' + a + "</div>"),
						(this.$caption = this.$container.find(".caption"));
				}
			},
			_renderClear: function () {
				var a,
					i = this.clearElement ? t(this.clearElement) : "";
				if (this.showClear) {
					if (((a = this._getClearClass()), i.length))
						return (
							e.addCss(i, a),
							i.attr({ title: this.clearButtonTitle }).html(this.clearButton),
							void (this.$clear = i)
						);
					this._addContent(
						"clear",
						'<div class="' +
							a +
							'" title="' +
							this.clearButtonTitle +
							'">' +
							this.clearButton +
							"</div>",
					),
						(this.$clear = this.$container.find(
							"." + this.clearButtonBaseClass,
						));
				}
			},
			_getClearClass: function () {
				return (
					this.clearButtonBaseClass +
					" " +
					(this.inactive ? "" : this.clearButtonActiveClass)
				);
			},
			_toggleHover: function (t) {
				var e, a, n;
				t &&
					(this.hoverChangeStars &&
						((e = this.getWidthFromValue(this.clearValue)),
						(a = t.val <= this.clearValue ? e + "%" : t.width),
						this.$filledStars.css("width", a)),
					this.hoverChangeCaption &&
						((n =
							t.val <= this.clearValue
								? this.fetchCaption(this.clearValue)
								: t.caption),
						n && this._setCaption(n + "")));
			},
			_init: function (a) {
				var n,
					r = this.$element.attr("tabindex", -1).addClass("rating-input"),
					s = this.minThreshold;
				return (
					(this.options = a),
					t.each(a, (t, e) => {
						this[t] = e;
					}),
					(this.rtl || "rtl" === r.attr("dir")) &&
						((this.rtl = !0), r.attr("dir", "rtl")),
					(this.starClicked = !1),
					(this.clearClicked = !1),
					this._initSlider(a),
					this._checkDisabled(),
					this.displayOnly &&
						((this.inactive = !0),
						(this.showClear = !1),
						(this.hoverEnabled = !1),
						(this.hoverChangeCaption = !1),
						(this.hoverChangeStars = !1)),
					this._generateRating(),
					this._initEvents(),
					this._listen(),
					!e.isEmpty(s) && (e.isEmpty(r.val()) || r.val() < s) && r.val(s),
					(n = this._parseValue(r.val())),
					r.val(n),
					r.removeClass("rating-loading")
				);
			},
			_initCaptionTitle: function () {
				var e;
				(e = this.fetchCaption(this.$element.val())),
					this.$rating.attr("title", t(e).text());
			},
			_trigChange: function (t) {
				this._initStarTitles(),
					this.$element.trigger("change").trigger("rating:change", t);
			},
			_initEvents: function () {
				this.events = {
					_getTouchPosition: (a) => {
						var n = e.isEmpty(a.pageX)
							? a.originalEvent.touches[0].pageX
							: a.pageX;
						return n - this.$rating.offset().left;
					},
					_listenClick: (t, e) => (
						t.stopPropagation(),
						t.preventDefault(),
						t.handled === !0 ? !1 : (e(t), void (t.handled = !0))
					),
					_noMouseAction: (e) =>
						!this.mouseEnabled ||
						!this.hoverEnabled ||
						this.inactive ||
						(e && e.isDefaultPrevented()),
					initTouch: (a) => {
						var n,
							i,
							r,
							s,
							o,
							l,
							c,
							u,
							d = this.clearValue || 0,
							h =
								"ontouchstart" in window ||
								(window.DocumentTouch &&
									document instanceof window.DocumentTouch);
						h &&
							!this.inactive &&
							((n = a.originalEvent),
							(i = e.isEmpty(n.touches) ? n.changedTouches : n.touches),
							(r = this.events._getTouchPosition(i[0])),
							"touchend" === a.type
								? (this._setStars(r),
									(u = [this.$element.val(), this._getCaption()]),
									this._trigChange(u),
									(this.starClicked = !0))
								: ((s = this.calculate(r)),
									(o = s.val <= d ? this.fetchCaption(d) : s.caption),
									(l = this.getWidthFromValue(d)),
									(c = s.val <= d ? l + "%" : s.width),
									this._setCaption(o),
									this.$filledStars.css("width", c)));
					},
					starClick: (e) => {
						var a, n;
						this.events._listenClick(e, (e) =>
							this.inactive
								? !1
								: ((a = this.events._getTouchPosition(e)),
									this._setStars(a),
									(n = [this.$element.val(), this._getCaption()]),
									this._trigChange(n),
									void (this.starClicked = !0)),
						);
					},
					clearClick: (e) => {
						this.events._listenClick(e, () => {
							this.inactive || (this.clear(), (this.clearClicked = !0));
						});
					},
					starMouseMove: (e) => {
						var a, n;
						this.events._noMouseAction(e) ||
							((this.starClicked = !1),
							(a = this.events._getTouchPosition(e)),
							(n = this.calculate(a)),
							this._toggleHover(n),
							this.$element.trigger("rating:hover", [
								n.val,
								n.caption,
								"stars",
							]));
					},
					starMouseLeave: (e) => {
						var a;
						this.events._noMouseAction(e) ||
							this.starClicked ||
							((a = this.cache),
							this._toggleHover(a),
							this.$element.trigger("rating:hoverleave", ["stars"]));
					},
					clearMouseMove: (e) => {
						var a, n, i, r;
						!this.events._noMouseAction(e) &&
							this.hoverOnClear &&
							((this.clearClicked = !1),
							(a =
								'<span class="' +
								this.clearCaptionClass +
								'">' +
								this.clearCaption +
								"</span>"),
							(n = this.clearValue),
							(i = this.getWidthFromValue(n) || 0),
							(r = { caption: a, width: i, val: n }),
							this._toggleHover(r),
							this.$element.trigger("rating:hover", [n, a, "clear"]));
					},
					clearMouseLeave: (e) => {
						var a;
						this.events._noMouseAction(e) ||
							this.clearClicked ||
							!this.hoverOnClear ||
							((a = this.cache),
							this._toggleHover(a),
							this.$element.trigger("rating:hoverleave", ["clear"]));
					},
					resetForm: (e) => {
						(e && e.isDefaultPrevented()) || this.inactive || this.reset();
					},
					focus: () => {
						this.$rating.focus(), this.$element.trigger("rating:focus");
					},
					blur: () => {
						this.$element.trigger("rating:blur");
					},
					keydown: (a) => {
						if (!this.inactive && this.keyboardEnabled) {
							var n = this.$element,
								i = n.val(),
								r = !1,
								s = Number.parseFloat(this.step),
								o = e.getDecimalPlaces(s),
								l = this.rtl ? 37 : 39,
								c = this.rtl ? 39 : 37,
								u = i ? Number.parseFloat(i) : 0,
								d = Number.parseInt(a.which || a.keyCode || 0, 10);
							d === l && u < this.max && ((u += s), (r = !0)),
								d === c && u > this.minThreshold && ((u -= s), (r = !0)),
								r &&
									((u = e.applyPrecision(u, o)),
									n.val(u),
									this._trigChange([u, this._getCaption()]),
									this.showStars(n.val()),
									this.$rating.focus()),
								(37 !== d && 39 !== d) ||
									n.trigger("rating:keydown", [u, this._getCaption()]);
						}
					},
				};
			},
			_listen: function () {
				var a = this,
					n = a.$element,
					i = n.closest("form"),
					r = a.$rating,
					s = a.$clear,
					o = a.events,
					l = e.NAMESPACE,
					c = "mousenter" + l + " mouseleave" + l,
					u = a.$rating.find(".star");
				return (
					e.handler(r, "touchstart touchmove touchend", o.initTouch),
					e.handler(r, "click touchstart", o.starClick),
					e.handler(r, "mousemove", o.starMouseMove),
					e.handler(r, "mouseleave", o.starMouseLeave),
					e.handler(r, "keydown", o.keydown),
					e.handler(r, "blur", o.blur),
					a.showClear &&
						s.length &&
						(e.handler(s, "click touchstart", o.clearClick),
						e.handler(s, "mousemove", o.clearMouseMove),
						e.handler(s, "mouseleave", o.clearMouseLeave)),
					i.length && e.handler(i, "reset", o.resetForm, !0),
					u.off(c).on(c, function (e) {
						var n = t(this),
							i = n.index(),
							r = n.parent().attr("class").slice(0, -1);
						a.$element.trigger("rating:" + e.type, [i + 1, r, n]);
					}),
					e.handler(a.$container, "click", o.focus),
					n
				);
			},
			_getStars: function (t) {
				var e,
					n = '<span class="' + t + '-stars">';
				for (e = 1; e <= this.stars; e++)
					n += '<span class="star">' + this[t + "Star"] + "</span>";
				return n + "</span>";
			},
			_initStarTitles: function (e) {
				if (this.showCaptionAsTitle) return void this._initCaptionTitle();
				var n,
					i = this.starTitles;
				(n = (a) => {
					var n = 1;
					a.each(function () {
						var a,
							r,
							s = t(this);
						"function" == typeof i
							? ((a = n === Math.floor(e) ? e : n), (r = i(a)))
							: (r = i[n]),
							r && s.attr({ title: r }),
							n++;
					});
				}),
					n(this.$emptyStars.find(".star")),
					n(this.$filledStars.find(".star"));
			},
			_setStars: function (t) {
				var a = arguments.length ? this.calculate(t) : this.calculate(),
					n = this.$element,
					i = this._parseValue(a.val);
				return (
					n.val(i),
					this.$filledStars.css("width", a.width),
					this._setCaption(a.caption),
					(this.cache = a),
					this._initStarTitles(i),
					n
				);
			},
			showStars: function (t) {
				var a = this._parseValue(t);
				return this.$element.val(a), this._setStars();
			},
			calculate: function (t) {
				var n = e.isEmpty(this.$element.val()) ? 0 : this.$element.val(),
					i = arguments.length ? this.getValueFromPosition(t) : n,
					r = this.fetchCaption(i),
					s = this.getWidthFromValue(i);
				return (s += "%"), { caption: r, width: s, val: i };
			},
			getValueFromPosition: function (t) {
				var a,
					n,
					r = e.getDecimalPlaces(this.step),
					s = this.$rating.width();
				return (
					(n = (this.diff * t) / (s * this.step)),
					(n = this.rtl ? Math.floor(n) : Math.ceil(n)),
					(a = e.applyPrecision(
						Number.parseFloat(this.min + n * this.step),
						r,
					)),
					(a = Math.max(Math.min(a, this.max), this.minThreshold)),
					this.rtl ? this.max - a : a
				);
			},
			getWidthFromValue: function (t) {
				var e,
					a,
					i = this.min,
					r = this.max,
					s = this.$emptyStars;
				return !t || t <= this.min || i === r
					? 0
					: ((t = Math.max(t, this.minThreshold)),
						(a = s.outerWidth()),
						(e = a ? s.width() / a : 1),
						t >= r ? 100 : ((t - i) * e * 100) / (r - i));
			},
			fetchCaption: function (t) {
				var a,
					n,
					i,
					r,
					s,
					l = Number.parseFloat(t) || this.clearValue,
					c = this.starCaptions,
					u = this.starCaptionClasses,
					d = this.getWidthFromValue(l);
				return (
					l &&
						l !== this.clearValue &&
						(l = e.applyPrecision(l, e.getDecimalPlaces(this.step))),
					(r = "function" == typeof u ? u(l, d) : u[l]),
					(i = "function" == typeof c ? c(l, d) : c[l]),
					(n = e.isEmpty(i) ? this.defaultCaption.replace(/\{rating}/g, l) : i),
					(a = e.isEmpty(r) ? this.clearCaptionClass : r),
					(s = l === this.clearValue ? this.clearCaption : n),
					'<span class="' + a + '">' + s + "</span>"
				);
			},
			destroy: function () {
				var n = this.$element;
				return (
					e.isEmpty(this.$container) || this.$container.before(n).remove(),
					t.removeData(n.get(0)),
					n.off("rating").removeClass("rating rating-input")
				);
			},
			create: function (t) {
				var a = t || this.options || {};
				return this.destroy().rating(a);
			},
			clear: function () {
				var e =
					'<span class="' +
					this.clearCaptionClass +
					'">' +
					this.clearCaption +
					"</span>";
				return (
					this.inactive || this._setCaption(e),
					this.showStars(this.clearValue)
						.trigger("change")
						.trigger("rating:clear")
				);
			},
			reset: function () {
				return this.showStars(this.initialValue).trigger("rating:reset");
			},
			update: function (t) {
				return arguments.length ? this.showStars(t) : this.$element;
			},
			refresh: function (e) {
				var n = this.$element;
				return e
					? this.destroy()
							.rating(t.extend(!0, this.options, e))
							.trigger("rating:refresh")
					: n;
			},
		}),
		(t.fn.rating = function (n) {
			var i = Array.apply(null, arguments),
				r = [];
			switch (
				(i.shift(),
				this.each(function () {
					var s,
						o = t(this),
						l = o.data("rating"),
						c = "object" == typeof n && n,
						u = c.theme || o.data("theme"),
						d = c.language || o.data("language") || "en",
						h = {},
						p = {};
					l ||
						(u && (h = t.fn.ratingThemes[u] || {}),
						"en" === d ||
							e.isEmpty(t.fn.ratingLocales[d]) ||
							(p = t.fn.ratingLocales[d]),
						(s = t.extend(
							!0,
							{},
							t.fn.rating.defaults,
							h,
							t.fn.ratingLocales.en,
							p,
							c,
							o.data(),
						)),
						(l = new a(this, s)),
						o.data("rating", l)),
						"string" == typeof n && r.push(l[n].apply(l, i));
				}),
				r.length)
			) {
				case 0:
					return this;
				case 1:
					return void 0 === r[0] ? this : r[0];
				default:
					return r;
			}
		}),
		(t.fn.rating.defaults = {
			theme: "krajee-svg",
			language: "en",
			stars: 5,
			tabindex: 0,
			keyboardEnabled: !0,
			mouseEnabled: !0,
			containerClass: "",
			size: "md",
			animate: !0,
			displayOnly: !1,
			rtl: !1,
			showClear: !0,
			showCaption: !0,
			starCaptionClasses: {
				0.5: "caption-badge caption-danger",
				1: "caption-badge caption-danger",
				1.5: "caption-badge caption-warning",
				2: "caption-badge caption-warning",
				2.5: "caption-badge caption-info",
				3: "caption-badge caption-info",
				3.5: "caption-badge caption-primary",
				4: "caption-badge caption-primary",
				4.5: "caption-badge caption-success",
				5: "caption-badge caption-success",
			},
			filledStar: '<span class="bi-star-fill"></span>',
			emptyStar: '<span class="bi-star"></span>',
			clearButton: '<span class="fa-solid fa-circle-minus"></span>',
			clearButtonBaseClass: "clear-rating",
			clearButtonActiveClass: "clear-rating-active",
			clearCaptionClass: "caption-badge caption-secondary",
			clearValue: null,
			captionElement: null,
			clearElement: null,
			showCaptionAsTitle: !1,
			hoverEnabled: !0,
			hoverChangeCaption: !0,
			hoverChangeStars: !0,
			hoverOnClear: !0,
			zeroAsNull: !0,
		}),
		(t.fn.ratingLocales.en = {
			defaultCaption: "{rating} Stars",
			starCaptions: {
				0.5: "Half Star",
				1: "One Star",
				1.5: "One & Half Star",
				2: "Two Stars",
				2.5: "Two & Half Stars",
				3: "Three Stars",
				3.5: "Three & Half Stars",
				4: "Four Stars",
				4.5: "Four & Half Stars",
				5: "Five Stars",
			},
			starTitles: {
				1: "One Star",
				2: "Two Stars",
				3: "Three Stars",
				4: "Four Stars",
				5: "Five Stars",
			},
			clearButtonTitle: "Clear",
			clearCaption: "Not Rated",
		}),
		(t.fn.rating.Constructor = a),
		t(document).ready(() => {
			var e = t("input.rating");
			e.length &&
				e.removeClass("rating-loading").addClass("rating-loading").rating();
		});
});

/*!
 * Krajee SVG Theme Configuration for bootstrap-star-rating.
 * This file must be loaded after 'star-rating.js'.
 *
 * @see http://github.com/kartik-v/bootstrap-star-rating
 * @author Kartik Visweswaran <kartikv2@gmail.com>
 */ !((a) => {
	a.fn.ratingThemes["krajee-svg"] = {
		filledStar: '<span class="krajee-icon krajee-icon-star"></span>',
		emptyStar: '<span class="krajee-icon krajee-icon-star"></span>',
		clearButton: '<span class="krajee-icon-clear"></span>',
	};
})(window.jQuery);
