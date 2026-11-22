// Generated from resources/js/record-switcher.js. Run npm run build.
/*! choices.js v11.2.3 | © 2026 Josh Johnson | https://github.com/Choices-js/Choices#readme */ var de =
  function (i, e) {
    return (
      (de =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (t, s) {
            t.__proto__ = s
          }) ||
        function (t, s) {
          for (var n in s)
            Object.prototype.hasOwnProperty.call(s, n) && (t[n] = s[n])
        }),
      de(i, e)
    )
  }
function Ye(i, e) {
  if (typeof e != 'function' && e !== null)
    throw new TypeError(
      'Class extends value ' + String(e) + ' is not a constructor or null',
    )
  de(i, e)
  function t() {
    this.constructor = i
  }
  i.prototype =
    e === null ? Object.create(e) : ((t.prototype = e.prototype), new t())
}
var T = function () {
  return (
    (T =
      Object.assign ||
      function (e) {
        for (var t, s = 1, n = arguments.length; s < n; s++) {
          t = arguments[s]
          for (var r in t)
            Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
        }
        return e
      }),
    T.apply(this, arguments)
  )
}
function ot(i, e, t) {
  if (t || arguments.length === 2)
    for (var s = 0, n = e.length, r; s < n; s++)
      (r || !(s in e)) &&
        (r || (r = Array.prototype.slice.call(e, 0, s)), (r[s] = e[s]))
  return i.concat(r || Array.prototype.slice.call(e))
}
var w = {
    ADD_CHOICE: 'ADD_CHOICE',
    REMOVE_CHOICE: 'REMOVE_CHOICE',
    FILTER_CHOICES: 'FILTER_CHOICES',
    ACTIVATE_CHOICES: 'ACTIVATE_CHOICES',
    CLEAR_CHOICES: 'CLEAR_CHOICES',
    ADD_GROUP: 'ADD_GROUP',
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    HIGHLIGHT_ITEM: 'HIGHLIGHT_ITEM',
  },
  O = {
    showDropdown: 'showDropdown',
    hideDropdown: 'hideDropdown',
    change: 'change',
    choice: 'choice',
    search: 'search',
    addItem: 'addItem',
    removeItem: 'removeItem',
    highlightItem: 'highlightItem',
    highlightChoice: 'highlightChoice',
    unhighlightItem: 'unhighlightItem',
  },
  A = {
    TAB_KEY: 9,
    SHIFT_KEY: 16,
    BACK_KEY: 46,
    DELETE_KEY: 8,
    ENTER_KEY: 13,
    A_KEY: 65,
    ESC_KEY: 27,
    UP_KEY: 38,
    DOWN_KEY: 40,
    PAGE_UP_KEY: 33,
    PAGE_DOWN_KEY: 34,
  },
  at = ['fuseOptions', 'classNames'],
  $ = {
    Text: 'text',
    SelectOne: 'select-one',
    SelectMultiple: 'select-multiple',
  },
  De = function (i) {
    return { type: w.ADD_CHOICE, choice: i }
  },
  lt = function (i) {
    return { type: w.REMOVE_CHOICE, choice: i }
  },
  ct = function (i) {
    return { type: w.FILTER_CHOICES, results: i }
  },
  ht = function (i) {
    return { type: w.ACTIVATE_CHOICES, active: i }
  },
  ut = function (i) {
    return { type: w.ADD_GROUP, group: i }
  },
  xe = function (i) {
    return { type: w.ADD_ITEM, item: i }
  },
  Me = function (i) {
    return { type: w.REMOVE_ITEM, item: i }
  },
  ee = function (i, e) {
    return { type: w.HIGHLIGHT_ITEM, item: i, highlighted: e }
  },
  dt = function (i, e) {
    return Math.floor(Math.random() * (e - i) + i)
  },
  Ne = function (i) {
    return Array.from({ length: i }, function () {
      return dt(0, 36).toString(36)
    }).join('')
  },
  ft = function (i, e) {
    var t = i.id || (i.name && ''.concat(i.name, '-').concat(Ne(2))) || Ne(4)
    return (
      (t = t.replace(/(:|\.|\[|\]|,)/g, '')),
      (t = ''.concat(e, '-').concat(t)),
      t
    )
  },
  pt = function (i, e, t) {
    t === void 0 && (t = 1)
    for (
      var s = ''.concat(t > 0 ? 'next' : 'previous', 'ElementSibling'),
        n = i[s];
      n;
    ) {
      if (n.matches(e)) return n
      n = n[s]
    }
    return null
  },
  Pe = function (i, e, t) {
    t === void 0 && (t = 1)
    var s
    return (
      t > 0
        ? (s = e.scrollTop + e.offsetHeight >= i.offsetTop + i.offsetHeight)
        : (s = i.offsetTop >= e.scrollTop),
      s
    )
  },
  Q = function (i) {
    if (typeof i != 'string') {
      if (i == null) return ''
      if (typeof i == 'object') {
        if ('raw' in i) return Q(i.raw)
        if ('trusted' in i) return i.trusted
      }
      return i
    }
    return i
      .replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/'/g, '&#039;')
      .replace(/"/g, '&quot;')
  },
  mt = (function () {
    var i = document.createElement('div')
    return function (e) {
      i.innerHTML = e.trim()
      for (var t = i.children[0]; i.firstChild;) i.removeChild(i.firstChild)
      return t
    }
  })(),
  Re = function (i) {
    return typeof i == 'function' ? i() : i
  },
  R = function (i) {
    if (typeof i == 'string') return i
    if (typeof i == 'object') {
      if ('trusted' in i) return i.trusted
      if ('raw' in i) return i.raw
    }
    return ''
  },
  ze = function (i) {
    if (typeof i == 'string') return i
    if (typeof i == 'object') {
      if ('escaped' in i) return i.escaped
      if ('trusted' in i) return i.trusted
    }
    return ''
  },
  N = function (i, e) {
    return {
      id: i.id,
      highlighted: i.highlighted,
      labelClass: i.labelClass,
      labelDescription: R(i.labelDescription),
      customProperties: i.customProperties,
      disabled: i.disabled,
      active: i.active,
      label: i.label,
      placeholder: i.placeholder,
      value: i.value,
      groupValue: i.group ? i.group.label : void 0,
      element: i.element,
      keyCode: e,
    }
  },
  X = function (i, e, t) {
    return typeof i == 'function' ? i(Q(e), R(e), t) : i
  },
  Oe = function (i, e) {
    return i ? ze(e) : Q(e)
  },
  K = function (i, e, t) {
    i.innerHTML = Oe(e, t)
  },
  vt = function (i, e) {
    var t = i.value,
      s = i.label,
      n = s === void 0 ? t : s,
      r = e.value,
      o = e.label,
      a = o === void 0 ? r : o
    return R(n).localeCompare(R(a), [], {
      sensitivity: 'base',
      ignorePunctuation: !0,
      numeric: !0,
    })
  },
  _t = function (i, e) {
    return i.rank - e.rank
  },
  gt = function (i, e, t) {
    t === void 0 && (t = null)
    var s = new CustomEvent(e, { detail: t, bubbles: !0, cancelable: !0 })
    return i.dispatchEvent(s)
  },
  yt = function (i, e) {
    var t = Object.keys(i).sort(),
      s = Object.keys(e).sort()
    return t.filter(function (n) {
      return s.indexOf(n) < 0
    })
  },
  oe = function (i) {
    return Array.isArray(i) ? i : [i]
  },
  U = function (i) {
    return i && Array.isArray(i)
      ? i
          .map(function (e) {
            return '.'.concat(e)
          })
          .join('')
      : '.'.concat(i)
  },
  E = function (i, e) {
    var t
    ;(t = i.classList).add.apply(t, oe(e))
  },
  M = function (i, e) {
    var t
    ;(t = i.classList).remove.apply(t, oe(e))
  },
  bt = function (i) {
    if (typeof i < 'u')
      try {
        return JSON.parse(i)
      } catch {
        return i
      }
    return {}
  },
  Et = function (i, e, t) {
    var s = i.itemEl
    s && (M(s, t), E(s, e))
  },
  Ct = (function () {
    function i(e) {
      var t = e.element,
        s = e.type,
        n = e.classNames
      ;((this.element = t),
        (this.classNames = n),
        (this.type = s),
        (this.isActive = !1))
    }
    return (
      (i.prototype.show = function () {
        return (
          E(this.element, this.classNames.activeState),
          this.element.setAttribute('aria-expanded', 'true'),
          (this.isActive = !0),
          this
        )
      }),
      (i.prototype.hide = function () {
        return (
          M(this.element, this.classNames.activeState),
          this.element.setAttribute('aria-expanded', 'false'),
          (this.isActive = !1),
          this
        )
      }),
      i
    )
  })(),
  ke = (function () {
    function i(e) {
      var t = e.element,
        s = e.type,
        n = e.classNames,
        r = e.position
      ;((this.element = t),
        (this.classNames = n),
        (this.type = s),
        (this.position = r),
        (this.isOpen = !1),
        (this.isFlipped = !1),
        (this.isDisabled = !1),
        (this.isLoading = !1))
    }
    return (
      (i.prototype.shouldFlip = function (e, t) {
        var s = !1
        return (
          this.position === 'auto'
            ? (s =
                this.element.getBoundingClientRect().top - t >= 0 &&
                !window.matchMedia('(min-height: '.concat(e + 1, 'px)'))
                  .matches)
            : this.position === 'top' && (s = !0),
          s
        )
      }),
      (i.prototype.setActiveDescendant = function (e) {
        this.element.setAttribute('aria-activedescendant', e)
      }),
      (i.prototype.removeActiveDescendant = function () {
        this.element.removeAttribute('aria-activedescendant')
      }),
      (i.prototype.open = function (e, t) {
        ;(E(this.element, this.classNames.openState),
          this.element.setAttribute('aria-expanded', 'true'),
          (this.isOpen = !0),
          this.shouldFlip(e, t) &&
            (E(this.element, this.classNames.flippedState),
            (this.isFlipped = !0)))
      }),
      (i.prototype.close = function () {
        ;(M(this.element, this.classNames.openState),
          this.element.setAttribute('aria-expanded', 'false'),
          this.removeActiveDescendant(),
          (this.isOpen = !1),
          this.isFlipped &&
            (M(this.element, this.classNames.flippedState),
            (this.isFlipped = !1)))
      }),
      (i.prototype.addFocusState = function () {
        E(this.element, this.classNames.focusState)
      }),
      (i.prototype.removeFocusState = function () {
        M(this.element, this.classNames.focusState)
      }),
      (i.prototype.addInvalidState = function () {
        E(this.element, this.classNames.invalidState)
      }),
      (i.prototype.removeInvalidState = function () {
        M(this.element, this.classNames.invalidState)
      }),
      (i.prototype.enable = function () {
        ;(M(this.element, this.classNames.disabledState),
          this.element.removeAttribute('aria-disabled'),
          this.type === $.SelectOne &&
            this.element.setAttribute('tabindex', '0'),
          (this.isDisabled = !1))
      }),
      (i.prototype.disable = function () {
        ;(E(this.element, this.classNames.disabledState),
          this.element.setAttribute('aria-disabled', 'true'),
          this.type === $.SelectOne &&
            this.element.setAttribute('tabindex', '-1'),
          (this.isDisabled = !0))
      }),
      (i.prototype.wrap = function (e) {
        var t = this.element,
          s = e.parentNode
        ;(s &&
          (e.nextSibling ? s.insertBefore(t, e.nextSibling) : s.appendChild(t)),
          t.appendChild(e))
      }),
      (i.prototype.unwrap = function (e) {
        var t = this.element,
          s = t.parentNode
        s && (s.insertBefore(e, t), s.removeChild(t))
      }),
      (i.prototype.addLoadingState = function () {
        ;(E(this.element, this.classNames.loadingState),
          this.element.setAttribute('aria-busy', 'true'),
          (this.isLoading = !0))
      }),
      (i.prototype.removeLoadingState = function () {
        ;(M(this.element, this.classNames.loadingState),
          this.element.removeAttribute('aria-busy'),
          (this.isLoading = !1))
      }),
      i
    )
  })(),
  wt = (function () {
    function i(e) {
      var t = e.element,
        s = e.type,
        n = e.classNames,
        r = e.preventPaste
      ;((this.element = t),
        (this.type = s),
        (this.classNames = n),
        (this.preventPaste = r),
        (this.isFocussed = this.element.isEqualNode(document.activeElement)),
        (this.isDisabled = t.disabled),
        (this._onPaste = this._onPaste.bind(this)),
        (this._onInput = this._onInput.bind(this)),
        (this._onFocus = this._onFocus.bind(this)),
        (this._onBlur = this._onBlur.bind(this)))
    }
    return (
      Object.defineProperty(i.prototype, 'placeholder', {
        set: function (e) {
          this.element.placeholder = e
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'value', {
        get: function () {
          return this.element.value
        },
        set: function (e) {
          this.element.value = e
        },
        enumerable: !1,
        configurable: !0,
      }),
      (i.prototype.addEventListeners = function () {
        var e = this.element
        ;(e.addEventListener('paste', this._onPaste),
          e.addEventListener('input', this._onInput, { passive: !0 }),
          e.addEventListener('focus', this._onFocus, { passive: !0 }),
          e.addEventListener('blur', this._onBlur, { passive: !0 }))
      }),
      (i.prototype.removeEventListeners = function () {
        var e = this.element
        ;(e.removeEventListener('input', this._onInput),
          e.removeEventListener('paste', this._onPaste),
          e.removeEventListener('focus', this._onFocus),
          e.removeEventListener('blur', this._onBlur))
      }),
      (i.prototype.enable = function () {
        var e = this.element
        ;(e.removeAttribute('disabled'), (this.isDisabled = !1))
      }),
      (i.prototype.disable = function () {
        var e = this.element
        ;(e.setAttribute('disabled', ''), (this.isDisabled = !0))
      }),
      (i.prototype.focus = function () {
        this.isFocussed || this.element.focus()
      }),
      (i.prototype.blur = function () {
        this.isFocussed && this.element.blur()
      }),
      (i.prototype.clear = function (e) {
        return (
          e === void 0 && (e = !0),
          (this.element.value = ''),
          e && this.setWidth(),
          this
        )
      }),
      (i.prototype.setWidth = function () {
        var e = this.element,
          t = e.value,
          s = e.placeholder,
          n = 0,
          r = 0
        if (t || s) {
          var o = document.createElement('span')
          ;((o.style.position = 'absolute'),
            (o.style.visibility = 'hidden'),
            (o.style.whiteSpace = 'pre'),
            (o.style.height = 'auto'),
            (o.style.width = 'auto'),
            (o.style.minWidth = '1ch'),
            E(o, Array.from(e.classList)),
            e.after(o))
          var a = parseFloat(getComputedStyle(o).width)
          ;(Number.isNaN(a)
            ? ((n = s.length), (r = t.length))
            : (s &&
                ((o.innerText = s),
                (n = parseFloat(getComputedStyle(o).width) / a)),
              t &&
                ((o.innerText = t),
                (r = parseFloat(getComputedStyle(o).width) / a))),
            o.remove())
        }
        ;((e.style.minWidth = ''.concat(Math.ceil(n) + 1, 'ch')),
          (e.style.width = ''.concat(Math.ceil(r) + 1, 'ch')))
      }),
      (i.prototype.setActiveDescendant = function (e) {
        this.element.setAttribute('aria-activedescendant', e)
      }),
      (i.prototype.removeActiveDescendant = function () {
        this.element.removeAttribute('aria-activedescendant')
      }),
      (i.prototype._onInput = function () {
        this.type !== $.SelectOne && this.setWidth()
      }),
      (i.prototype._onPaste = function (e) {
        this.preventPaste && e.preventDefault()
      }),
      (i.prototype._onFocus = function () {
        this.isFocussed = !0
      }),
      (i.prototype._onBlur = function () {
        this.isFocussed = !1
      }),
      i
    )
  })(),
  St = 4,
  Fe = (function () {
    function i(e) {
      var t = e.element
      ;((this.element = t),
        (this.scrollPos = this.element.scrollTop),
        (this.height = this.element.offsetHeight))
    }
    return (
      (i.prototype.prepend = function (e) {
        var t = this.element.firstElementChild
        t ? this.element.insertBefore(e, t) : this.element.append(e)
      }),
      (i.prototype.scrollToTop = function () {
        this.element.scrollTop = 0
      }),
      (i.prototype.scrollToChildElement = function (e, t) {
        var s = this
        if (e) {
          var n = this.element.offsetHeight,
            r = this.element.scrollTop + n,
            o = e.offsetHeight,
            a = e.offsetTop + o,
            l = t > 0 ? this.element.scrollTop + a - r : e.offsetTop
          requestAnimationFrame(function () {
            s._animateScroll(l, t)
          })
        }
      }),
      (i.prototype._scrollDown = function (e, t, s) {
        var n = (s - e) / t,
          r = n > 1 ? n : 1
        this.element.scrollTop = e + r
      }),
      (i.prototype._scrollUp = function (e, t, s) {
        var n = (e - s) / t,
          r = n > 1 ? n : 1
        this.element.scrollTop = e - r
      }),
      (i.prototype._animateScroll = function (e, t) {
        var s = this,
          n = St,
          r = this.element.scrollTop,
          o = !1
        ;(t > 0
          ? (this._scrollDown(r, n, e), r < e && (o = !0))
          : (this._scrollUp(r, n, e), r > e && (o = !0)),
          o &&
            requestAnimationFrame(function () {
              s._animateScroll(e, t)
            }))
      }),
      i
    )
  })(),
  Xe = (function () {
    function i(e) {
      var t = e.element,
        s = e.classNames
      ;((this.element = t), (this.classNames = s), (this.isDisabled = !1))
    }
    return (
      Object.defineProperty(i.prototype, 'isActive', {
        get: function () {
          return this.element.dataset.choice === 'active'
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'dir', {
        get: function () {
          return this.element.dir
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'value', {
        get: function () {
          return this.element.value
        },
        set: function (e) {
          ;(this.element.setAttribute('value', e), (this.element.value = e))
        },
        enumerable: !1,
        configurable: !0,
      }),
      (i.prototype.conceal = function () {
        var e = this.element
        ;(E(e, this.classNames.input), (e.hidden = !0), (e.tabIndex = -1))
        var t = e.getAttribute('style')
        ;(t && e.setAttribute('data-choice-orig-style', t),
          e.setAttribute('data-choice', 'active'))
      }),
      (i.prototype.reveal = function () {
        var e = this.element
        ;(M(e, this.classNames.input),
          (e.hidden = !1),
          e.removeAttribute('tabindex'))
        var t = e.getAttribute('data-choice-orig-style')
        ;(t
          ? (e.removeAttribute('data-choice-orig-style'),
            e.setAttribute('style', t))
          : e.removeAttribute('style'),
          e.removeAttribute('data-choice'))
      }),
      (i.prototype.enable = function () {
        ;(this.element.removeAttribute('disabled'),
          (this.element.disabled = !1),
          (this.isDisabled = !1))
      }),
      (i.prototype.disable = function () {
        ;(this.element.setAttribute('disabled', ''),
          (this.element.disabled = !0),
          (this.isDisabled = !0))
      }),
      (i.prototype.triggerEvent = function (e, t) {
        gt(this.element, e, t || {})
      }),
      i
    )
  })(),
  It = (function (i) {
    Ye(e, i)
    function e() {
      return (i !== null && i.apply(this, arguments)) || this
    }
    return e
  })(Xe),
  z = function (i, e) {
    return (e === void 0 && (e = !0), typeof i > 'u' ? e : !!i)
  },
  Je = function (i) {
    if (
      (typeof i == 'string' &&
        (i = i.split(' ').filter(function (e) {
          return e.length
        })),
      Array.isArray(i) && i.length)
    )
      return i
  },
  P = function (i, e, t) {
    if ((t === void 0 && (t = !0), typeof i == 'string')) {
      var s = Q(i),
        n = t || s === i ? i : { escaped: s, raw: i },
        r = P({ value: i, label: n, selected: !0 }, !1)
      return r
    }
    var o = i
    if ('choices' in o) {
      if (!e) throw new TypeError('optGroup is not allowed')
      var a = o,
        l = a.choices.map(function (f) {
          return P(f, !1)
        }),
        h = {
          id: 0,
          label: R(a.label) || a.value,
          active: !!l.length,
          disabled: !!a.disabled,
          choices: l,
        }
      return h
    }
    var c = o,
      u = {
        id: 0,
        group: null,
        score: 0,
        rank: 0,
        value: c.value,
        label: c.label || c.value,
        active: z(c.active),
        selected: z(c.selected, !1),
        disabled: z(c.disabled, !1),
        placeholder: z(c.placeholder, !1),
        highlighted: !1,
        labelClass: Je(c.labelClass),
        labelDescription: c.labelDescription,
        customProperties: c.customProperties,
      }
    return u
  },
  At = function (i) {
    return i.tagName === 'INPUT'
  },
  Qe = function (i) {
    return i.tagName === 'SELECT'
  },
  Ot = function (i) {
    return i.tagName === 'OPTION'
  },
  Tt = function (i) {
    return i.tagName === 'OPTGROUP'
  },
  Lt = (function (i) {
    Ye(e, i)
    function e(t) {
      var s = t.element,
        n = t.classNames,
        r = t.template,
        o = t.extractPlaceholder,
        a = i.call(this, { element: s, classNames: n }) || this
      return ((a.template = r), (a.extractPlaceholder = o), a)
    }
    return (
      Object.defineProperty(e.prototype, 'placeholderOption', {
        get: function () {
          return (
            this.element.querySelector('option[value=""]') ||
            this.element.querySelector('option[placeholder]')
          )
        },
        enumerable: !1,
        configurable: !0,
      }),
      (e.prototype.addOptions = function (t) {
        var s = this,
          n = document.createDocumentFragment()
        ;(t.forEach(function (r) {
          var o = r
          if (!o.element) {
            var a = s.template(o)
            ;(n.appendChild(a), (o.element = a))
          }
        }),
          this.element.appendChild(n))
      }),
      (e.prototype.optionsAsChoices = function () {
        var t = this,
          s = []
        return (
          this.element
            .querySelectorAll(':scope > option, :scope > optgroup')
            .forEach(function (n) {
              Ot(n)
                ? s.push(t._optionToChoice(n))
                : Tt(n) && s.push(t._optgroupToChoice(n))
            }),
          s
        )
      }),
      (e.prototype._optionToChoice = function (t) {
        return (
          !t.hasAttribute('value') &&
            t.hasAttribute('placeholder') &&
            (t.setAttribute('value', ''), (t.value = '')),
          {
            id: 0,
            group: null,
            score: 0,
            rank: 0,
            value: t.value,
            label: t.label,
            element: t,
            active: !0,
            selected: this.extractPlaceholder
              ? t.selected
              : t.hasAttribute('selected'),
            disabled: t.disabled,
            highlighted: !1,
            placeholder:
              this.extractPlaceholder &&
              (!t.value || t.hasAttribute('placeholder')),
            labelClass:
              typeof t.dataset.labelClass < 'u'
                ? Je(t.dataset.labelClass)
                : void 0,
            labelDescription:
              typeof t.dataset.labelDescription < 'u'
                ? { trusted: t.dataset.labelDescription }
                : void 0,
            customProperties: bt(t.dataset.customProperties),
          }
        )
      }),
      (e.prototype._optgroupToChoice = function (t) {
        var s = this,
          n = t.querySelectorAll('option'),
          r = Array.from(n).map(function (o) {
            return s._optionToChoice(o)
          })
        return {
          id: 0,
          label: t.label || '',
          element: t,
          active: !!r.length,
          disabled: t.disabled,
          choices: r,
        }
      }),
      e
    )
  })(Xe),
  Dt = {
    containerOuter: ['choices'],
    containerInner: ['choices__inner'],
    input: ['choices__input'],
    inputCloned: ['choices__input--cloned'],
    list: ['choices__list'],
    listItems: ['choices__list--multiple'],
    listSingle: ['choices__list--single'],
    listDropdown: ['choices__list--dropdown'],
    item: ['choices__item'],
    itemSelectable: ['choices__item--selectable'],
    itemDisabled: ['choices__item--disabled'],
    itemChoice: ['choices__item--choice'],
    description: ['choices__description'],
    placeholder: ['choices__placeholder'],
    group: ['choices__group'],
    groupHeading: ['choices__heading'],
    button: ['choices__button'],
    activeState: ['is-active'],
    focusState: ['is-focused'],
    openState: ['is-open'],
    disabledState: ['is-disabled'],
    highlightedState: ['is-highlighted'],
    selectedState: ['is-selected'],
    flippedState: ['is-flipped'],
    loadingState: ['is-loading'],
    invalidState: ['is-invalid'],
    notice: ['choices__notice'],
    addChoice: ['choices__item--selectable', 'add-choice'],
    noResults: ['has-no-results'],
    noChoices: ['has-no-choices'],
  },
  Ke = {
    items: [],
    choices: [],
    silent: !1,
    renderChoiceLimit: -1,
    maxItemCount: -1,
    closeDropdownOnSelect: 'auto',
    singleModeForMultiSelect: !1,
    addChoices: !1,
    addItems: !0,
    addItemFilter: function (i) {
      return !!i && i !== ''
    },
    removeItems: !0,
    removeItemButton: !1,
    removeItemButtonAlignLeft: !1,
    editItems: !1,
    allowHTML: !1,
    allowHtmlUserInput: !1,
    duplicateItemsAllowed: !0,
    delimiter: ',',
    paste: !0,
    searchEnabled: !0,
    searchChoices: !0,
    searchDisabledChoices: !1,
    searchFloor: 1,
    searchResultLimit: 4,
    searchFields: ['label', 'value'],
    position: 'auto',
    resetScrollPosition: !0,
    shouldSort: !0,
    shouldSortItems: !1,
    sorter: vt,
    shadowRoot: null,
    placeholder: !0,
    placeholderValue: null,
    searchPlaceholderValue: null,
    prependValue: null,
    appendValue: null,
    renderSelectedChoices: 'auto',
    searchRenderSelectedChoices: !0,
    loadingText: 'Loading...',
    noResultsText: 'No results found',
    noChoicesText: 'No choices to choose from',
    itemSelectText: 'Press to select',
    uniqueItemText: 'Only unique values can be added',
    customAddItemText: 'Only values matching specific conditions can be added',
    addItemText: function (i) {
      return 'Press Enter to add <b>"'.concat(i, '"</b>')
    },
    removeItemIconText: function () {
      return 'Remove item'
    },
    removeItemLabelText: function (i, e, t) {
      return 'Remove item: '.concat(t ? Q(t.label) : i)
    },
    maxItemText: function (i) {
      return 'Only '.concat(i, ' values can be added')
    },
    valueComparer: function (i, e) {
      return i === e
    },
    fuseOptions: { includeScore: !0 },
    labelId: '',
    callbackOnInit: null,
    callbackOnCreateTemplates: null,
    classNames: Dt,
    appendGroupInSearch: !1,
  },
  He = function (i) {
    var e = i.itemEl
    e && (e.remove(), (i.itemEl = void 0))
  }
function xt(i, e, t) {
  var s = i,
    n = !0
  switch (e.type) {
    case w.ADD_ITEM: {
      e.item.selected = !0
      var r = e.item.element
      ;(r && ((r.selected = !0), r.setAttribute('selected', '')),
        s.push(e.item))
      break
    }
    case w.REMOVE_ITEM: {
      e.item.selected = !1
      var r = e.item.element
      if (r) {
        ;((r.selected = !1), r.removeAttribute('selected'))
        var o = r.parentElement
        o && Qe(o) && o.type === $.SelectOne && (o.value = '')
      }
      ;(He(e.item),
        (s = s.filter(function (c) {
          return c.id !== e.item.id
        })))
      break
    }
    case w.REMOVE_CHOICE: {
      ;(He(e.choice),
        (s = s.filter(function (h) {
          return h.id !== e.choice.id
        })))
      break
    }
    case w.HIGHLIGHT_ITEM: {
      var a = e.highlighted,
        l = s.find(function (h) {
          return h.id === e.item.id
        })
      l &&
        l.highlighted !== a &&
        ((l.highlighted = a),
        t &&
          Et(
            l,
            a ? t.classNames.highlightedState : t.classNames.selectedState,
            a ? t.classNames.selectedState : t.classNames.highlightedState,
          ))
      break
    }
    default: {
      n = !1
      break
    }
  }
  return { state: s, update: n }
}
function Mt(i, e) {
  var t = i,
    s = !0
  switch (e.type) {
    case w.ADD_GROUP: {
      t.push(e.group)
      break
    }
    case w.CLEAR_CHOICES: {
      t = []
      break
    }
    default: {
      s = !1
      break
    }
  }
  return { state: t, update: s }
}
function Nt(i, e, t) {
  var s = i,
    n = !0
  switch (e.type) {
    case w.ADD_CHOICE: {
      s.push(e.choice)
      break
    }
    case w.REMOVE_CHOICE: {
      ;((e.choice.choiceEl = void 0),
        e.choice.group &&
          (e.choice.group.choices = e.choice.group.choices.filter(function (o) {
            return o.id !== e.choice.id
          })),
        (s = s.filter(function (o) {
          return o.id !== e.choice.id
        })))
      break
    }
    case w.ADD_ITEM:
    case w.REMOVE_ITEM: {
      e.item.choiceEl = void 0
      break
    }
    case w.FILTER_CHOICES: {
      var r = []
      ;(e.results.forEach(function (o) {
        r[o.item.id] = o
      }),
        s.forEach(function (o) {
          var a = r[o.id]
          ;(a !== void 0
            ? ((o.score = a.score), (o.rank = a.rank), (o.active = !0))
            : ((o.score = 0), (o.rank = 0), (o.active = !1)),
            t && t.appendGroupInSearch && (o.choiceEl = void 0))
        }))
      break
    }
    case w.ACTIVATE_CHOICES: {
      s.forEach(function (o) {
        ;((o.active = e.active),
          t && t.appendGroupInSearch && (o.choiceEl = void 0))
      })
      break
    }
    case w.CLEAR_CHOICES: {
      s = []
      break
    }
    default: {
      n = !1
      break
    }
  }
  return { state: s, update: n }
}
var je = { groups: Mt, items: xt, choices: Nt },
  Pt = (function () {
    function i(e) {
      ;((this._state = this.defaultState),
        (this._listeners = []),
        (this._txn = 0),
        (this._context = e))
    }
    return (
      Object.defineProperty(i.prototype, 'defaultState', {
        get: function () {
          return { groups: [], items: [], choices: [] }
        },
        enumerable: !1,
        configurable: !0,
      }),
      (i.prototype.changeSet = function (e) {
        return { groups: e, items: e, choices: e }
      }),
      (i.prototype.reset = function () {
        this._state = this.defaultState
        var e = this.changeSet(!0)
        this._txn
          ? (this._changeSet = e)
          : this._listeners.forEach(function (t) {
              return t(e)
            })
      }),
      (i.prototype.subscribe = function (e) {
        return (this._listeners.push(e), this)
      }),
      (i.prototype.dispatch = function (e) {
        var t = this,
          s = this._state,
          n = !1,
          r = this._changeSet || this.changeSet(!1)
        ;(Object.keys(je).forEach(function (o) {
          var a = je[o](s[o], e, t._context)
          a.update && ((n = !0), (r[o] = !0), (s[o] = a.state))
        }),
          n &&
            (this._txn
              ? (this._changeSet = r)
              : this._listeners.forEach(function (o) {
                  return o(r)
                })))
      }),
      (i.prototype.withTxn = function (e) {
        this._txn++
        try {
          e()
        } finally {
          if (((this._txn = Math.max(0, this._txn - 1)), !this._txn)) {
            var t = this._changeSet
            t &&
              ((this._changeSet = void 0),
              this._listeners.forEach(function (s) {
                return s(t)
              }))
          }
        }
      }),
      Object.defineProperty(i.prototype, 'state', {
        get: function () {
          return this._state
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'items', {
        get: function () {
          return this.state.items
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'highlightedActiveItems', {
        get: function () {
          return this.items.filter(function (e) {
            return e.active && e.highlighted
          })
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'choices', {
        get: function () {
          return this.state.choices
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'activeChoices', {
        get: function () {
          return this.choices.filter(function (e) {
            return e.active
          })
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'searchableChoices', {
        get: function () {
          var e = this._context
          return this.choices.filter(function (t) {
            return !t.placeholder && (e.searchDisabledChoices || !t.disabled)
          })
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'groups', {
        get: function () {
          return this.state.groups
        },
        enumerable: !1,
        configurable: !0,
      }),
      Object.defineProperty(i.prototype, 'activeGroups', {
        get: function () {
          var e = this
          return this.state.groups.filter(function (t) {
            var s = t.active && !t.disabled,
              n = e.state.choices.some(function (r) {
                return r.active && !r.disabled
              })
            return s && n
          }, [])
        },
        enumerable: !1,
        configurable: !0,
      }),
      (i.prototype.inTxn = function () {
        return this._txn > 0
      }),
      (i.prototype.getChoiceById = function (e) {
        return this.activeChoices.find(function (t) {
          return t.id === e
        })
      }),
      (i.prototype.getGroupById = function (e) {
        return this.groups.find(function (t) {
          return t.id === e
        })
      }),
      i
    )
  })(),
  I = {
    noChoices: 'no-choices',
    noResults: 'no-results',
    addChoice: 'add-choice',
    generic: '',
  }
function Rt(i, e, t) {
  return (
    (e = Ft(e)) in i
      ? Object.defineProperty(i, e, {
          value: t,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (i[e] = t),
    i
  )
}
function Ve(i, e) {
  var t = Object.keys(i)
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(i)
    ;(e &&
      (s = s.filter(function (n) {
        return Object.getOwnPropertyDescriptor(i, n).enumerable
      })),
      t.push.apply(t, s))
  }
  return t
}
function q(i) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {}
    e % 2
      ? Ve(Object(t), !0).forEach(function (s) {
          Rt(i, s, t[s])
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(t))
        : Ve(Object(t)).forEach(function (s) {
            Object.defineProperty(i, s, Object.getOwnPropertyDescriptor(t, s))
          })
  }
  return i
}
function kt(i, e) {
  if (typeof i != 'object' || !i) return i
  var t = i[Symbol.toPrimitive]
  if (t !== void 0) {
    var s = t.call(i, e)
    if (typeof s != 'object') return s
    throw new TypeError('@@toPrimitive must return a primitive value.')
  }
  return (e === 'string' ? String : Number)(i)
}
function Ft(i) {
  var e = kt(i, 'string')
  return typeof e == 'symbol' ? e : e + ''
}
function H(i) {
  return Array.isArray ? Array.isArray(i) : tt(i) === '[object Array]'
}
function Kt(i) {
  if (typeof i == 'string') return i
  let e = i + ''
  return e == '0' && 1 / i == -1 / 0 ? '-0' : e
}
function Ht(i) {
  return i == null ? '' : Kt(i)
}
function k(i) {
  return typeof i == 'string'
}
function Ze(i) {
  return typeof i == 'number'
}
function jt(i) {
  return i === !0 || i === !1 || (Vt(i) && tt(i) == '[object Boolean]')
}
function et(i) {
  return typeof i == 'object'
}
function Vt(i) {
  return et(i) && i !== null
}
function L(i) {
  return i != null
}
function ce(i) {
  return !i.trim().length
}
function tt(i) {
  return i == null
    ? i === void 0
      ? '[object Undefined]'
      : '[object Null]'
    : Object.prototype.toString.call(i)
}
var $t = "Incorrect 'index' type",
  Bt = (i) => `Invalid value for key ${i}`,
  Gt = (i) => `Pattern length exceeds max of ${i}.`,
  Wt = (i) => `Missing ${i} property in key`,
  Ut = (i) => `Property 'weight' in key '${i}' must be a positive integer`,
  $e = Object.prototype.hasOwnProperty,
  fe = class {
    constructor(e) {
      ;((this._keys = []), (this._keyMap = {}))
      let t = 0
      ;(e.forEach((s) => {
        let n = it(s)
        ;(this._keys.push(n), (this._keyMap[n.id] = n), (t += n.weight))
      }),
        this._keys.forEach((s) => {
          s.weight /= t
        }))
    }
    get(e) {
      return this._keyMap[e]
    }
    keys() {
      return this._keys
    }
    toJSON() {
      return JSON.stringify(this._keys)
    }
  }
function it(i) {
  let e = null,
    t = null,
    s = null,
    n = 1,
    r = null
  if (k(i) || H(i)) ((s = i), (e = Be(i)), (t = pe(i)))
  else {
    if (!$e.call(i, 'name')) throw new Error(Wt('name'))
    let o = i.name
    if (((s = o), $e.call(i, 'weight') && ((n = i.weight), n <= 0)))
      throw new Error(Ut(o))
    ;((e = Be(o)), (t = pe(o)), (r = i.getFn))
  }
  return { path: e, id: t, weight: n, src: s, getFn: r }
}
function Be(i) {
  return H(i) ? i : i.split('.')
}
function pe(i) {
  return H(i) ? i.join('.') : i
}
function qt(i, e) {
  let t = [],
    s = !1,
    n = (r, o, a) => {
      if (L(r))
        if (!o[a]) t.push(r)
        else {
          let l = o[a],
            h = r[l]
          if (!L(h)) return
          if (a === o.length - 1 && (k(h) || Ze(h) || jt(h))) t.push(Ht(h))
          else if (H(h)) {
            s = !0
            for (let c = 0, u = h.length; c < u; c += 1) n(h[c], o, a + 1)
          } else o.length && n(h, o, a + 1)
        }
    }
  return (n(i, k(e) ? e.split('.') : e, 0), s ? t : t[0])
}
var Yt = { includeMatches: !1, findAllMatches: !1, minMatchCharLength: 1 },
  zt = {
    isCaseSensitive: !1,
    includeScore: !1,
    keys: [],
    shouldSort: !0,
    sortFn: (i, e) =>
      i.score === e.score
        ? i.idx < e.idx
          ? -1
          : 1
        : i.score < e.score
          ? -1
          : 1,
  },
  Xt = { location: 0, threshold: 0.6, distance: 100 },
  Jt = {
    useExtendedSearch: !1,
    getFn: qt,
    ignoreLocation: !1,
    ignoreFieldNorm: !1,
    fieldNormWeight: 1,
  },
  y = q(q(q(q({}, zt), Yt), Xt), Jt),
  Qt = /[^ ]+/g
function Zt(i = 1, e = 3) {
  let t = new Map(),
    s = Math.pow(10, e)
  return {
    get(n) {
      let r = n.match(Qt).length
      if (t.has(r)) return t.get(r)
      let o = 1 / Math.pow(r, 0.5 * i),
        a = parseFloat(Math.round(o * s) / s)
      return (t.set(r, a), a)
    },
    clear() {
      t.clear()
    },
  }
}
var J = class {
  constructor({
    getFn: e = y.getFn,
    fieldNormWeight: t = y.fieldNormWeight,
  } = {}) {
    ;((this.norm = Zt(t, 3)),
      (this.getFn = e),
      (this.isCreated = !1),
      this.setIndexRecords())
  }
  setSources(e = []) {
    this.docs = e
  }
  setIndexRecords(e = []) {
    this.records = e
  }
  setKeys(e = []) {
    ;((this.keys = e),
      (this._keysMap = {}),
      e.forEach((t, s) => {
        this._keysMap[t.id] = s
      }))
  }
  create() {
    this.isCreated ||
      !this.docs.length ||
      ((this.isCreated = !0),
      k(this.docs[0])
        ? this.docs.forEach((e, t) => {
            this._addString(e, t)
          })
        : this.docs.forEach((e, t) => {
            this._addObject(e, t)
          }),
      this.norm.clear())
  }
  add(e) {
    let t = this.size()
    k(e) ? this._addString(e, t) : this._addObject(e, t)
  }
  removeAt(e) {
    this.records.splice(e, 1)
    for (let t = e, s = this.size(); t < s; t += 1) this.records[t].i -= 1
  }
  getValueForItemAtKeyId(e, t) {
    return e[this._keysMap[t]]
  }
  size() {
    return this.records.length
  }
  _addString(e, t) {
    if (!L(e) || ce(e)) return
    let s = { v: e, i: t, n: this.norm.get(e) }
    this.records.push(s)
  }
  _addObject(e, t) {
    let s = { i: t, $: {} }
    ;(this.keys.forEach((n, r) => {
      let o = n.getFn ? n.getFn(e) : this.getFn(e, n.path)
      if (L(o)) {
        if (H(o)) {
          let a = [],
            l = [{ nestedArrIndex: -1, value: o }]
          for (; l.length;) {
            let { nestedArrIndex: h, value: c } = l.pop()
            if (L(c))
              if (k(c) && !ce(c)) {
                let u = { v: c, i: h, n: this.norm.get(c) }
                a.push(u)
              } else
                H(c) &&
                  c.forEach((u, f) => {
                    l.push({ nestedArrIndex: f, value: u })
                  })
          }
          s.$[r] = a
        } else if (k(o) && !ce(o)) {
          let a = { v: o, n: this.norm.get(o) }
          s.$[r] = a
        }
      }
    }),
      this.records.push(s))
  }
  toJSON() {
    return { keys: this.keys, records: this.records }
  }
}
function st(
  i,
  e,
  { getFn: t = y.getFn, fieldNormWeight: s = y.fieldNormWeight } = {},
) {
  let n = new J({ getFn: t, fieldNormWeight: s })
  return (n.setKeys(i.map(it)), n.setSources(e), n.create(), n)
}
function ei(
  i,
  { getFn: e = y.getFn, fieldNormWeight: t = y.fieldNormWeight } = {},
) {
  let { keys: s, records: n } = i,
    r = new J({ getFn: e, fieldNormWeight: t })
  return (r.setKeys(s), r.setIndexRecords(n), r)
}
function te(
  i,
  {
    errors: e = 0,
    currentLocation: t = 0,
    expectedLocation: s = 0,
    distance: n = y.distance,
    ignoreLocation: r = y.ignoreLocation,
  } = {},
) {
  let o = e / i.length
  if (r) return o
  let a = Math.abs(s - t)
  return n ? o + a / n : a ? 1 : o
}
function ti(i = [], e = y.minMatchCharLength) {
  let t = [],
    s = -1,
    n = -1,
    r = 0
  for (let o = i.length; r < o; r += 1) {
    let a = i[r]
    a && s === -1
      ? (s = r)
      : !a &&
        s !== -1 &&
        ((n = r - 1), n - s + 1 >= e && t.push([s, n]), (s = -1))
  }
  return (i[r - 1] && r - s >= e && t.push([s, r - 1]), t)
}
var G = 32
function ii(
  i,
  e,
  t,
  {
    location: s = y.location,
    distance: n = y.distance,
    threshold: r = y.threshold,
    findAllMatches: o = y.findAllMatches,
    minMatchCharLength: a = y.minMatchCharLength,
    includeMatches: l = y.includeMatches,
    ignoreLocation: h = y.ignoreLocation,
  } = {},
) {
  if (e.length > G) throw new Error(Gt(G))
  let c = e.length,
    u = i.length,
    f = Math.max(0, Math.min(s, u)),
    v = r,
    m = f,
    _ = a > 1 || l,
    b = _ ? Array(u) : [],
    d
  for (; (d = i.indexOf(e, m)) > -1;) {
    let D = te(e, {
      currentLocation: d,
      expectedLocation: f,
      distance: n,
      ignoreLocation: h,
    })
    if (((v = Math.min(D, v)), (m = d + c), _)) {
      let j = 0
      for (; j < c;) ((b[d + j] = 1), (j += 1))
    }
  }
  m = -1
  let p = [],
    g = 1,
    S = c + u,
    C = 1 << (c - 1)
  for (let D = 0; D < c; D += 1) {
    let j = 0,
      V = S
    for (; j < V;)
      (te(e, {
        errors: D,
        currentLocation: f + V,
        expectedLocation: f,
        distance: n,
        ignoreLocation: h,
      }) <= v
        ? (j = V)
        : (S = V),
        (V = Math.floor((S - j) / 2 + j)))
    S = V
    let Te = Math.max(1, f - V + 1),
      le = o ? u : Math.min(f + V, u) + c,
      W = Array(le + 2)
    W[le + 1] = (1 << D) - 1
    for (let x = le; x >= Te; x -= 1) {
      let Z = x - 1,
        Le = t[i.charAt(Z)]
      if (
        (_ && (b[Z] = +!!Le),
        (W[x] = ((W[x + 1] << 1) | 1) & Le),
        D && (W[x] |= ((p[x + 1] | p[x]) << 1) | 1 | p[x + 1]),
        W[x] & C &&
          ((g = te(e, {
            errors: D,
            currentLocation: Z,
            expectedLocation: f,
            distance: n,
            ignoreLocation: h,
          })),
          g <= v))
      ) {
        if (((v = g), (m = Z), m <= f)) break
        Te = Math.max(1, 2 * f - m)
      }
    }
    if (
      te(e, {
        errors: D + 1,
        currentLocation: f,
        expectedLocation: f,
        distance: n,
        ignoreLocation: h,
      }) > v
    )
      break
    p = W
  }
  let ae = { isMatch: m >= 0, score: Math.max(0.001, g) }
  if (_) {
    let D = ti(b, a)
    D.length ? l && (ae.indices = D) : (ae.isMatch = !1)
  }
  return ae
}
function si(i) {
  let e = {}
  for (let t = 0, s = i.length; t < s; t += 1) {
    let n = i.charAt(t)
    e[n] = (e[n] || 0) | (1 << (s - t - 1))
  }
  return e
}
var ie = class {
    constructor(
      e,
      {
        location: t = y.location,
        threshold: s = y.threshold,
        distance: n = y.distance,
        includeMatches: r = y.includeMatches,
        findAllMatches: o = y.findAllMatches,
        minMatchCharLength: a = y.minMatchCharLength,
        isCaseSensitive: l = y.isCaseSensitive,
        ignoreLocation: h = y.ignoreLocation,
      } = {},
    ) {
      if (
        ((this.options = {
          location: t,
          threshold: s,
          distance: n,
          includeMatches: r,
          findAllMatches: o,
          minMatchCharLength: a,
          isCaseSensitive: l,
          ignoreLocation: h,
        }),
        (this.pattern = l ? e : e.toLowerCase()),
        (this.chunks = []),
        !this.pattern.length)
      )
        return
      let c = (f, v) => {
          this.chunks.push({ pattern: f, alphabet: si(f), startIndex: v })
        },
        u = this.pattern.length
      if (u > G) {
        let f = 0,
          v = u % G,
          m = u - v
        for (; f < m;) (c(this.pattern.substr(f, G), f), (f += G))
        if (v) {
          let _ = u - G
          c(this.pattern.substr(_), _)
        }
      } else c(this.pattern, 0)
    }
    searchIn(e) {
      let { isCaseSensitive: t, includeMatches: s } = this.options
      if ((t || (e = e.toLowerCase()), this.pattern === e)) {
        let m = { isMatch: !0, score: 0 }
        return (s && (m.indices = [[0, e.length - 1]]), m)
      }
      let {
          location: n,
          distance: r,
          threshold: o,
          findAllMatches: a,
          minMatchCharLength: l,
          ignoreLocation: h,
        } = this.options,
        c = [],
        u = 0,
        f = !1
      this.chunks.forEach(({ pattern: m, alphabet: _, startIndex: b }) => {
        let {
          isMatch: d,
          score: p,
          indices: g,
        } = ii(e, m, _, {
          location: n + b,
          distance: r,
          threshold: o,
          findAllMatches: a,
          minMatchCharLength: l,
          includeMatches: s,
          ignoreLocation: h,
        })
        ;(d && (f = !0), (u += p), d && g && (c = [...c, ...g]))
      })
      let v = { isMatch: f, score: f ? u / this.chunks.length : 1 }
      return (f && s && (v.indices = c), v)
    }
  },
  F = class {
    constructor(e) {
      this.pattern = e
    }
    static isMultiMatch(e) {
      return Ge(e, this.multiRegex)
    }
    static isSingleMatch(e) {
      return Ge(e, this.singleRegex)
    }
    search() {}
  }
function Ge(i, e) {
  let t = i.match(e)
  return t ? t[1] : null
}
var me = class extends F {
    constructor(e) {
      super(e)
    }
    static get type() {
      return 'exact'
    }
    static get multiRegex() {
      return /^="(.*)"$/
    }
    static get singleRegex() {
      return /^=(.*)$/
    }
    search(e) {
      let t = e === this.pattern
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [0, this.pattern.length - 1],
      }
    }
  },
  ve = class extends F {
    constructor(e) {
      super(e)
    }
    static get type() {
      return 'inverse-exact'
    }
    static get multiRegex() {
      return /^!"(.*)"$/
    }
    static get singleRegex() {
      return /^!(.*)$/
    }
    search(e) {
      let s = e.indexOf(this.pattern) === -1
      return { isMatch: s, score: s ? 0 : 1, indices: [0, e.length - 1] }
    }
  },
  _e = class extends F {
    constructor(e) {
      super(e)
    }
    static get type() {
      return 'prefix-exact'
    }
    static get multiRegex() {
      return /^\^"(.*)"$/
    }
    static get singleRegex() {
      return /^\^(.*)$/
    }
    search(e) {
      let t = e.startsWith(this.pattern)
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [0, this.pattern.length - 1],
      }
    }
  },
  ge = class extends F {
    constructor(e) {
      super(e)
    }
    static get type() {
      return 'inverse-prefix-exact'
    }
    static get multiRegex() {
      return /^!\^"(.*)"$/
    }
    static get singleRegex() {
      return /^!\^(.*)$/
    }
    search(e) {
      let t = !e.startsWith(this.pattern)
      return { isMatch: t, score: t ? 0 : 1, indices: [0, e.length - 1] }
    }
  },
  ye = class extends F {
    constructor(e) {
      super(e)
    }
    static get type() {
      return 'suffix-exact'
    }
    static get multiRegex() {
      return /^"(.*)"\$$/
    }
    static get singleRegex() {
      return /^(.*)\$$/
    }
    search(e) {
      let t = e.endsWith(this.pattern)
      return {
        isMatch: t,
        score: t ? 0 : 1,
        indices: [e.length - this.pattern.length, e.length - 1],
      }
    }
  },
  be = class extends F {
    constructor(e) {
      super(e)
    }
    static get type() {
      return 'inverse-suffix-exact'
    }
    static get multiRegex() {
      return /^!"(.*)"\$$/
    }
    static get singleRegex() {
      return /^!(.*)\$$/
    }
    search(e) {
      let t = !e.endsWith(this.pattern)
      return { isMatch: t, score: t ? 0 : 1, indices: [0, e.length - 1] }
    }
  },
  se = class extends F {
    constructor(
      e,
      {
        location: t = y.location,
        threshold: s = y.threshold,
        distance: n = y.distance,
        includeMatches: r = y.includeMatches,
        findAllMatches: o = y.findAllMatches,
        minMatchCharLength: a = y.minMatchCharLength,
        isCaseSensitive: l = y.isCaseSensitive,
        ignoreLocation: h = y.ignoreLocation,
      } = {},
    ) {
      ;(super(e),
        (this._bitapSearch = new ie(e, {
          location: t,
          threshold: s,
          distance: n,
          includeMatches: r,
          findAllMatches: o,
          minMatchCharLength: a,
          isCaseSensitive: l,
          ignoreLocation: h,
        })))
    }
    static get type() {
      return 'fuzzy'
    }
    static get multiRegex() {
      return /^"(.*)"$/
    }
    static get singleRegex() {
      return /^(.*)$/
    }
    search(e) {
      return this._bitapSearch.searchIn(e)
    }
  },
  ne = class extends F {
    constructor(e) {
      super(e)
    }
    static get type() {
      return 'include'
    }
    static get multiRegex() {
      return /^'"(.*)"$/
    }
    static get singleRegex() {
      return /^'(.*)$/
    }
    search(e) {
      let t = 0,
        s,
        n = [],
        r = this.pattern.length
      for (; (s = e.indexOf(this.pattern, t)) > -1;)
        ((t = s + r), n.push([s, t - 1]))
      let o = !!n.length
      return { isMatch: o, score: o ? 0 : 1, indices: n }
    }
  },
  Ee = [me, ne, _e, ge, be, ye, ve, se],
  We = Ee.length,
  ni = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/,
  ri = '|'
function oi(i, e = {}) {
  return i.split(ri).map((t) => {
    let s = t
        .trim()
        .split(ni)
        .filter((r) => r && !!r.trim()),
      n = []
    for (let r = 0, o = s.length; r < o; r += 1) {
      let a = s[r],
        l = !1,
        h = -1
      for (; !l && ++h < We;) {
        let c = Ee[h],
          u = c.isMultiMatch(a)
        u && (n.push(new c(u, e)), (l = !0))
      }
      if (!l)
        for (h = -1; ++h < We;) {
          let c = Ee[h],
            u = c.isSingleMatch(a)
          if (u) {
            n.push(new c(u, e))
            break
          }
        }
    }
    return n
  })
}
var ai = new Set([se.type, ne.type]),
  Ce = class {
    constructor(
      e,
      {
        isCaseSensitive: t = y.isCaseSensitive,
        includeMatches: s = y.includeMatches,
        minMatchCharLength: n = y.minMatchCharLength,
        ignoreLocation: r = y.ignoreLocation,
        findAllMatches: o = y.findAllMatches,
        location: a = y.location,
        threshold: l = y.threshold,
        distance: h = y.distance,
      } = {},
    ) {
      ;((this.query = null),
        (this.options = {
          isCaseSensitive: t,
          includeMatches: s,
          minMatchCharLength: n,
          findAllMatches: o,
          ignoreLocation: r,
          location: a,
          threshold: l,
          distance: h,
        }),
        (this.pattern = t ? e : e.toLowerCase()),
        (this.query = oi(this.pattern, this.options)))
    }
    static condition(e, t) {
      return t.useExtendedSearch
    }
    searchIn(e) {
      let t = this.query
      if (!t) return { isMatch: !1, score: 1 }
      let { includeMatches: s, isCaseSensitive: n } = this.options
      e = n ? e : e.toLowerCase()
      let r = 0,
        o = [],
        a = 0
      for (let l = 0, h = t.length; l < h; l += 1) {
        let c = t[l]
        ;((o.length = 0), (r = 0))
        for (let u = 0, f = c.length; u < f; u += 1) {
          let v = c[u],
            { isMatch: m, indices: _, score: b } = v.search(e)
          if (m) {
            if (((r += 1), (a += b), s)) {
              let d = v.constructor.type
              ai.has(d) ? (o = [...o, ..._]) : o.push(_)
            }
          } else {
            ;((a = 0), (r = 0), (o.length = 0))
            break
          }
        }
        if (r) {
          let u = { isMatch: !0, score: a / r }
          return (s && (u.indices = o), u)
        }
      }
      return { isMatch: !1, score: 1 }
    }
  },
  we = []
function li(...i) {
  we.push(...i)
}
function Se(i, e) {
  for (let t = 0, s = we.length; t < s; t += 1) {
    let n = we[t]
    if (n.condition(i, e)) return new n(i, e)
  }
  return new ie(i, e)
}
var re = { AND: '$and', OR: '$or' },
  Ie = { PATH: '$path', PATTERN: '$val' },
  Ae = (i) => !!(i[re.AND] || i[re.OR]),
  ci = (i) => !!i[Ie.PATH],
  hi = (i) => !H(i) && et(i) && !Ae(i),
  Ue = (i) => ({ [re.AND]: Object.keys(i).map((e) => ({ [e]: i[e] })) })
function nt(i, e, { auto: t = !0 } = {}) {
  let s = (n) => {
    let r = Object.keys(n),
      o = ci(n)
    if (!o && r.length > 1 && !Ae(n)) return s(Ue(n))
    if (hi(n)) {
      let l = o ? n[Ie.PATH] : r[0],
        h = o ? n[Ie.PATTERN] : n[l]
      if (!k(h)) throw new Error(Bt(l))
      let c = { keyId: pe(l), pattern: h }
      return (t && (c.searcher = Se(h, e)), c)
    }
    let a = { children: [], operator: r[0] }
    return (
      r.forEach((l) => {
        let h = n[l]
        H(h) &&
          h.forEach((c) => {
            a.children.push(s(c))
          })
      }),
      a
    )
  }
  return (Ae(i) || (i = Ue(i)), s(i))
}
function ui(i, { ignoreFieldNorm: e = y.ignoreFieldNorm }) {
  i.forEach((t) => {
    let s = 1
    ;(t.matches.forEach(({ key: n, norm: r, score: o }) => {
      let a = n ? n.weight : null
      s *= Math.pow(o === 0 && a ? Number.EPSILON : o, (a || 1) * (e ? 1 : r))
    }),
      (t.score = s))
  })
}
function di(i, e) {
  let t = i.matches
  ;((e.matches = []),
    L(t) &&
      t.forEach((s) => {
        if (!L(s.indices) || !s.indices.length) return
        let { indices: n, value: r } = s,
          o = { indices: n, value: r }
        ;(s.key && (o.key = s.key.src),
          s.idx > -1 && (o.refIndex = s.idx),
          e.matches.push(o))
      }))
}
function fi(i, e) {
  e.score = i.score
}
function pi(
  i,
  e,
  {
    includeMatches: t = y.includeMatches,
    includeScore: s = y.includeScore,
  } = {},
) {
  let n = []
  return (
    t && n.push(di),
    s && n.push(fi),
    i.map((r) => {
      let { idx: o } = r,
        a = { item: e[o], refIndex: o }
      return (
        n.length &&
          n.forEach((l) => {
            l(r, a)
          }),
        a
      )
    })
  )
}
var B = class {
  constructor(e, t = {}, s) {
    ;((this.options = q(q({}, y), t)),
      this.options.useExtendedSearch,
      (this._keyStore = new fe(this.options.keys)),
      this.setCollection(e, s))
  }
  setCollection(e, t) {
    if (((this._docs = e), t && !(t instanceof J))) throw new Error($t)
    this._myIndex =
      t ||
      st(this.options.keys, this._docs, {
        getFn: this.options.getFn,
        fieldNormWeight: this.options.fieldNormWeight,
      })
  }
  add(e) {
    L(e) && (this._docs.push(e), this._myIndex.add(e))
  }
  remove(e = () => !1) {
    let t = []
    for (let s = 0, n = this._docs.length; s < n; s += 1) {
      let r = this._docs[s]
      e(r, s) && (this.removeAt(s), (s -= 1), (n -= 1), t.push(r))
    }
    return t
  }
  removeAt(e) {
    ;(this._docs.splice(e, 1), this._myIndex.removeAt(e))
  }
  getIndex() {
    return this._myIndex
  }
  search(e, { limit: t = -1 } = {}) {
    let {
        includeMatches: s,
        includeScore: n,
        shouldSort: r,
        sortFn: o,
        ignoreFieldNorm: a,
      } = this.options,
      l = k(e)
        ? k(this._docs[0])
          ? this._searchStringList(e)
          : this._searchObjectList(e)
        : this._searchLogical(e)
    return (
      ui(l, { ignoreFieldNorm: a }),
      r && l.sort(o),
      Ze(t) && t > -1 && (l = l.slice(0, t)),
      pi(l, this._docs, { includeMatches: s, includeScore: n })
    )
  }
  _searchStringList(e) {
    let t = Se(e, this.options),
      { records: s } = this._myIndex,
      n = []
    return (
      s.forEach(({ v: r, i: o, n: a }) => {
        if (!L(r)) return
        let { isMatch: l, score: h, indices: c } = t.searchIn(r)
        l &&
          n.push({
            item: r,
            idx: o,
            matches: [{ score: h, value: r, norm: a, indices: c }],
          })
      }),
      n
    )
  }
  _searchLogical(e) {
    let t = nt(e, this.options),
      s = (a, l, h) => {
        if (!a.children) {
          let { keyId: u, searcher: f } = a,
            v = this._findMatches({
              key: this._keyStore.get(u),
              value: this._myIndex.getValueForItemAtKeyId(l, u),
              searcher: f,
            })
          return v && v.length ? [{ idx: h, item: l, matches: v }] : []
        }
        let c = []
        for (let u = 0, f = a.children.length; u < f; u += 1) {
          let v = a.children[u],
            m = s(v, l, h)
          if (m.length) c.push(...m)
          else if (a.operator === re.AND) return []
        }
        return c
      },
      n = this._myIndex.records,
      r = {},
      o = []
    return (
      n.forEach(({ $: a, i: l }) => {
        if (L(a)) {
          let h = s(t, a, l)
          h.length &&
            (r[l] || ((r[l] = { idx: l, item: a, matches: [] }), o.push(r[l])),
            h.forEach(({ matches: c }) => {
              r[l].matches.push(...c)
            }))
        }
      }),
      o
    )
  }
  _searchObjectList(e) {
    let t = Se(e, this.options),
      { keys: s, records: n } = this._myIndex,
      r = []
    return (
      n.forEach(({ $: o, i: a }) => {
        if (!L(o)) return
        let l = []
        ;(s.forEach((h, c) => {
          l.push(...this._findMatches({ key: h, value: o[c], searcher: t }))
        }),
          l.length && r.push({ idx: a, item: o, matches: l }))
      }),
      r
    )
  }
  _findMatches({ key: e, value: t, searcher: s }) {
    if (!L(t)) return []
    let n = []
    if (H(t))
      t.forEach(({ v: r, i: o, n: a }) => {
        if (!L(r)) return
        let { isMatch: l, score: h, indices: c } = s.searchIn(r)
        l && n.push({ score: h, key: e, value: r, idx: o, norm: a, indices: c })
      })
    else {
      let { v: r, n: o } = t,
        { isMatch: a, score: l, indices: h } = s.searchIn(r)
      a && n.push({ score: l, key: e, value: r, norm: o, indices: h })
    }
    return n
  }
}
B.version = '7.0.0'
B.createIndex = st
B.parseIndex = ei
B.config = y
B.parseQuery = nt
li(Ce)
var mi = (function () {
  function i(e) {
    ;((this._haystack = []),
      (this._fuseOptions = T(T({}, e.fuseOptions), {
        keys: ot([], e.searchFields, !0),
        includeMatches: !0,
      })))
  }
  return (
    (i.prototype.index = function (e) {
      ;((this._haystack = e), this._fuse && this._fuse.setCollection(e))
    }),
    (i.prototype.reset = function () {
      ;((this._haystack = []), (this._fuse = void 0))
    }),
    (i.prototype.isEmptyIndex = function () {
      return !this._haystack.length
    }),
    (i.prototype.search = function (e) {
      this._fuse || (this._fuse = new B(this._haystack, this._fuseOptions))
      var t = this._fuse.search(e)
      return t.map(function (s, n) {
        return { item: s.item, score: s.score || 0, rank: n + 1 }
      })
    }),
    i
  )
})()
function vi(i) {
  return new mi(i)
}
var _i = function (i) {
    for (var e in i) if (Object.prototype.hasOwnProperty.call(i, e)) return !1
    return !0
  },
  he = function (i, e, t) {
    var s = i.dataset,
      n = e.customProperties,
      r = e.labelClass,
      o = e.labelDescription
    ;(r && (s.labelClass = oe(r).join(' ')),
      o && (s.labelDescription = R(o)),
      t &&
        n &&
        (typeof n == 'string'
          ? (s.customProperties = n)
          : typeof n == 'object' &&
            !_i(n) &&
            (s.customProperties = JSON.stringify(n))))
  },
  qe = function (i, e, t) {
    var s = e && i.querySelector("label[for='".concat(e, "']")),
      n = s && s.innerText
    n && t.setAttribute('aria-label', n)
  },
  gi = {
    containerOuter: function (i, e, t, s, n, r, o) {
      var a = i.classNames.containerOuter,
        l = document.createElement('div')
      return (
        E(l, a),
        (l.dataset.type = r),
        e && (l.dir = e),
        s && (l.tabIndex = 0),
        t &&
          (l.setAttribute('role', n ? 'combobox' : 'listbox'),
          n
            ? l.setAttribute('aria-autocomplete', 'list')
            : o || qe(this._docRoot, this.passedElement.element.id, l),
          l.setAttribute('aria-haspopup', 'true'),
          l.setAttribute('aria-expanded', 'false')),
        o && l.setAttribute('aria-labelledby', o),
        l
      )
    },
    containerInner: function (i) {
      var e = i.classNames.containerInner,
        t = document.createElement('div')
      return (E(t, e), t)
    },
    itemList: function (i, e) {
      var t = i.searchEnabled,
        s = i.classNames,
        n = s.list,
        r = s.listSingle,
        o = s.listItems,
        a = document.createElement('div')
      return (
        E(a, n),
        E(a, e ? r : o),
        this._isSelectElement && t && a.setAttribute('role', 'listbox'),
        a
      )
    },
    placeholder: function (i, e) {
      var t = i.allowHTML,
        s = i.classNames.placeholder,
        n = document.createElement('div')
      return (E(n, s), K(n, t, e), n)
    },
    item: function (i, e, t) {
      var s = i.allowHTML,
        n = i.removeItemButtonAlignLeft,
        r = i.removeItemIconText,
        o = i.removeItemLabelText,
        a = i.classNames,
        l = a.item,
        h = a.button,
        c = a.highlightedState,
        u = a.itemSelectable,
        f = a.placeholder,
        v = R(e.value),
        m = document.createElement('div')
      if ((E(m, l), e.labelClass)) {
        var _ = document.createElement('span')
        ;(K(_, s, e.label), E(_, e.labelClass), m.appendChild(_))
      } else K(m, s, e.label)
      if (
        ((m.dataset.item = ''),
        (m.dataset.id = e.id),
        (m.dataset.value = v),
        he(m, e, !0),
        (e.disabled || this.containerOuter.isDisabled) &&
          m.setAttribute('aria-disabled', 'true'),
        this._isSelectElement &&
          (m.setAttribute('aria-selected', 'true'),
          m.setAttribute('role', 'option')),
        e.placeholder && (E(m, f), (m.dataset.placeholder = '')),
        E(m, e.highlighted ? c : u),
        t)
      ) {
        ;(e.disabled && M(m, u), (m.dataset.deletable = ''))
        var b = document.createElement('button')
        ;((b.type = 'button'), E(b, h))
        var d = N(e)
        K(b, !0, X(r, e.value, d))
        var p = X(o, e.value, d)
        ;(p && b.setAttribute('aria-label', p),
          (b.dataset.button = ''),
          n ? m.insertAdjacentElement('afterbegin', b) : m.appendChild(b))
      }
      return m
    },
    choiceList: function (i, e) {
      var t = i.classNames.list,
        s = document.createElement('div')
      return (
        E(s, t),
        e || s.setAttribute('aria-multiselectable', 'true'),
        s.setAttribute('role', 'listbox'),
        s
      )
    },
    choiceGroup: function (i, e) {
      var t = i.allowHTML,
        s = i.classNames,
        n = s.group,
        r = s.groupHeading,
        o = s.itemDisabled,
        a = e.id,
        l = e.label,
        h = e.disabled,
        c = R(l),
        u = document.createElement('div')
      ;(E(u, n),
        h && E(u, o),
        u.setAttribute('role', 'group'),
        (u.dataset.group = ''),
        (u.dataset.id = a),
        (u.dataset.value = c),
        h && u.setAttribute('aria-disabled', 'true'))
      var f = document.createElement('div')
      return (E(f, r), K(f, t, l || ''), u.appendChild(f), u)
    },
    choice: function (i, e, t, s) {
      var n = i.allowHTML,
        r = i.classNames,
        o = r.item,
        a = r.itemChoice,
        l = r.itemSelectable,
        h = r.selectedState,
        c = r.itemDisabled,
        u = r.description,
        f = r.placeholder,
        v = e.label,
        m = R(e.value),
        _ = document.createElement('div')
      ;((_.id = e.elementId),
        E(_, o),
        E(_, a),
        s &&
          typeof v == 'string' &&
          ((v = Oe(n, v)), (v += ' ('.concat(s, ')')), (v = { trusted: v })))
      var b = _
      if (e.labelClass) {
        var d = document.createElement('span')
        ;(K(d, n, v), E(d, e.labelClass), (b = d), _.appendChild(d))
      } else K(_, n, v)
      if (e.labelDescription) {
        var p = ''.concat(e.elementId, '-description')
        b.setAttribute('aria-describedby', p)
        var g = document.createElement('span')
        ;(K(g, n, e.labelDescription), (g.id = p), E(g, u), _.appendChild(g))
      }
      return (
        e.selected && E(_, h),
        e.placeholder && E(_, f),
        _.setAttribute('role', e.group ? 'treeitem' : 'option'),
        (_.dataset.choice = ''),
        (_.dataset.id = e.id),
        (_.dataset.value = m),
        t && (_.dataset.selectText = t),
        e.group && (_.dataset.groupId = ''.concat(e.group.id)),
        he(_, e, !1),
        e.disabled
          ? (E(_, c),
            (_.dataset.choiceDisabled = ''),
            _.setAttribute('aria-disabled', 'true'))
          : (E(_, l),
            (_.dataset.choiceSelectable = ''),
            _.setAttribute('aria-selected', e.selected ? 'true' : 'false')),
        _
      )
    },
    input: function (i, e) {
      var t = i.classNames,
        s = t.input,
        n = t.inputCloned,
        r = i.labelId,
        o = document.createElement('input')
      return (
        (o.type = 'search'),
        E(o, s),
        E(o, n),
        (o.autocomplete = 'off'),
        (o.autocapitalize = 'off'),
        (o.spellcheck = !1),
        o.setAttribute('aria-autocomplete', 'list'),
        e
          ? o.setAttribute('aria-label', e)
          : r || qe(this._docRoot, this.passedElement.element.id, o),
        o
      )
    },
    dropdown: function (i) {
      var e = i.classNames,
        t = e.list,
        s = e.listDropdown,
        n = document.createElement('div')
      return (E(n, t), E(n, s), n.setAttribute('aria-expanded', 'false'), n)
    },
    notice: function (i, e, t) {
      var s = i.classNames,
        n = s.item,
        r = s.itemChoice,
        o = s.addChoice,
        a = s.noResults,
        l = s.noChoices,
        h = s.notice
      t === void 0 && (t = I.generic)
      var c = document.createElement('div')
      switch ((K(c, !0, e), E(c, n), E(c, r), E(c, h), t)) {
        case I.addChoice:
          E(c, o)
          break
        case I.noResults:
          E(c, a)
          break
        case I.noChoices:
          E(c, l)
          break
      }
      return (
        t === I.addChoice &&
          ((c.dataset.choiceSelectable = ''), (c.dataset.choice = '')),
        c
      )
    },
    option: function (i) {
      var e = R(i.label),
        t = new Option(e, i.value, !1, i.selected)
      return (
        he(t, i, !0),
        (t.disabled = i.disabled),
        i.selected && t.setAttribute('selected', ''),
        t
      )
    },
  },
  yi =
    '-ms-scroll-limit' in document.documentElement.style &&
    '-ms-ime-align' in document.documentElement.style,
  bi = {},
  ue = function (i) {
    if (i) return i.dataset.id ? parseInt(i.dataset.id, 10) : void 0
  },
  Y = '[data-choice-selectable]',
  rt = (function () {
    function i(e, t) {
      ;(e === void 0 && (e = '[data-choice]'), t === void 0 && (t = {}))
      var s = this
      ;((this.initialisedOK = void 0),
        (this._hasNonChoicePlaceholder = !1),
        (this._lastAddedChoiceId = 0),
        (this._lastAddedGroupId = 0))
      var n = i.defaults
      ;((this.config = T(T(T({}, n.allOptions), n.options), t)),
        at.forEach(function (d) {
          s.config[d] = T(T(T({}, n.allOptions[d]), n.options[d]), t[d])
        }))
      var r = this.config
      r.silent || this._validateConfig()
      var o = r.shadowRoot || document.documentElement
      this._docRoot = o
      var a = typeof e == 'string' ? o.querySelector(e) : e
      if (!a || typeof a != 'object' || !(At(a) || Qe(a)))
        throw TypeError(
          !a && typeof e == 'string'
            ? 'Selector '.concat(e, ' failed to find an element')
            : 'Expected one of the following types text|select-one|select-multiple',
        )
      var l = a.type,
        h = l === $.Text
      ;((h || r.maxItemCount !== 1) && (r.singleModeForMultiSelect = !1),
        r.singleModeForMultiSelect && (l = $.SelectMultiple))
      var c = l === $.SelectOne,
        u = l === $.SelectMultiple,
        f = c || u
      if (
        ((this._elementType = l),
        (this._isTextElement = h),
        (this._isSelectOneElement = c),
        (this._isSelectMultipleElement = u),
        (this._isSelectElement = c || u),
        (this._canAddUserChoices = (h && r.addItems) || (f && r.addChoices)),
        typeof r.renderSelectedChoices != 'boolean' &&
          (r.renderSelectedChoices = r.renderSelectedChoices === 'always' || c),
        r.closeDropdownOnSelect === 'auto'
          ? (r.closeDropdownOnSelect = h || c || r.singleModeForMultiSelect)
          : (r.closeDropdownOnSelect = z(r.closeDropdownOnSelect)),
        r.placeholder &&
          (r.placeholderValue
            ? (this._hasNonChoicePlaceholder = !0)
            : a.dataset.placeholder &&
              ((this._hasNonChoicePlaceholder = !0),
              (r.placeholderValue = a.dataset.placeholder))),
        t.addItemFilter && typeof t.addItemFilter != 'function')
      ) {
        var v =
          t.addItemFilter instanceof RegExp
            ? t.addItemFilter
            : new RegExp(t.addItemFilter)
        r.addItemFilter = v.test.bind(v)
      }
      if (this._isTextElement)
        this.passedElement = new It({ element: a, classNames: r.classNames })
      else {
        var m = a
        this.passedElement = new Lt({
          element: m,
          classNames: r.classNames,
          template: function (d) {
            return s._templates.option(d)
          },
          extractPlaceholder: r.placeholder && !this._hasNonChoicePlaceholder,
        })
      }
      if (
        ((this.initialised = !1),
        (this._store = new Pt(r)),
        (this._currentValue = ''),
        (r.searchEnabled = !h && r.searchEnabled),
        (this._canSearch = r.searchEnabled),
        (this._isScrollingOnIe = !1),
        (this._highlightPosition = 0),
        (this._wasTap = !0),
        (this._placeholderValue = this._generatePlaceholderValue()),
        (this._baseId = ft(a, 'choices-')),
        (this._direction = a.dir),
        !this._direction)
      ) {
        var _ = window.getComputedStyle(a).direction,
          b = window.getComputedStyle(document.documentElement).direction
        _ !== b && (this._direction = _)
      }
      if (
        ((this._idNames = { itemChoice: 'item-choice' }),
        (this._templates = n.templates),
        (this._render = this._render.bind(this)),
        (this._onFocus = this._onFocus.bind(this)),
        (this._onBlur = this._onBlur.bind(this)),
        (this._onKeyUp = this._onKeyUp.bind(this)),
        (this._onKeyDown = this._onKeyDown.bind(this)),
        (this._onInput = this._onInput.bind(this)),
        (this._onClick = this._onClick.bind(this)),
        (this._onTouchMove = this._onTouchMove.bind(this)),
        (this._onTouchEnd = this._onTouchEnd.bind(this)),
        (this._onMouseDown = this._onMouseDown.bind(this)),
        (this._onMouseOver = this._onMouseOver.bind(this)),
        (this._onFormReset = this._onFormReset.bind(this)),
        (this._onSelectKey = this._onSelectKey.bind(this)),
        (this._onEnterKey = this._onEnterKey.bind(this)),
        (this._onEscapeKey = this._onEscapeKey.bind(this)),
        (this._onDirectionKey = this._onDirectionKey.bind(this)),
        (this._onDeleteKey = this._onDeleteKey.bind(this)),
        (this._onChange = this._onChange.bind(this)),
        (this._onInvalid = this._onInvalid.bind(this)),
        this.passedElement.isActive)
      ) {
        ;(r.silent ||
          console.warn(
            'Trying to initialise Choices on element already initialised',
            { element: e },
          ),
          (this.initialised = !0),
          (this.initialisedOK = !1))
        return
      }
      ;(this.init(),
        (this._initialItems = this._store.items.map(function (d) {
          return d.value
        })))
    }
    return (
      Object.defineProperty(i, 'defaults', {
        get: function () {
          return Object.preventExtensions({
            get options() {
              return bi
            },
            get allOptions() {
              return Ke
            },
            get templates() {
              return gi
            },
          })
        },
        enumerable: !1,
        configurable: !0,
      }),
      (i.prototype.init = function () {
        if (!(this.initialised || this.initialisedOK !== void 0)) {
          ;((this._searcher = vi(this.config)),
            this._loadChoices(),
            this._createTemplates(),
            this._createElements(),
            this._createStructure(),
            (this._isTextElement && !this.config.addItems) ||
            this.passedElement.element.hasAttribute('disabled') ||
            this.passedElement.element.closest('fieldset:disabled')
              ? this.disable()
              : (this.enable(), this._addEventListeners()),
            this._initStore(),
            (this.initialised = !0),
            (this.initialisedOK = !0))
          var e = this.config.callbackOnInit
          typeof e == 'function' && e.call(this)
        }
      }),
      (i.prototype.destroy = function () {
        this.initialised &&
          (this._removeEventListeners(),
          this.passedElement.reveal(),
          this.containerOuter.unwrap(this.passedElement.element),
          (this._store._listeners = []),
          this.clearStore(!1),
          this._stopSearch(),
          (this._templates = i.defaults.templates),
          (this.initialised = !1),
          (this.initialisedOK = void 0))
      }),
      (i.prototype.enable = function () {
        return (
          this.passedElement.isDisabled && this.passedElement.enable(),
          this.containerOuter.isDisabled &&
            (this._addEventListeners(),
            this.input.enable(),
            this.containerOuter.enable()),
          this
        )
      }),
      (i.prototype.disable = function () {
        return (
          this.passedElement.isDisabled || this.passedElement.disable(),
          this.containerOuter.isDisabled ||
            (this._removeEventListeners(),
            this.input.disable(),
            this.containerOuter.disable()),
          this
        )
      }),
      (i.prototype.highlightItem = function (e, t) {
        if ((t === void 0 && (t = !0), !e || !e.id)) return this
        var s = this._store.items.find(function (n) {
          return n.id === e.id
        })
        return !s || s.highlighted
          ? this
          : (this._store.dispatch(ee(s, !0)),
            t && this.passedElement.triggerEvent(O.highlightItem, N(s)),
            this)
      }),
      (i.prototype.unhighlightItem = function (e, t) {
        if ((t === void 0 && (t = !0), !e || !e.id)) return this
        var s = this._store.items.find(function (n) {
          return n.id === e.id
        })
        return !s || !s.highlighted
          ? this
          : (this._store.dispatch(ee(s, !1)),
            t && this.passedElement.triggerEvent(O.unhighlightItem, N(s)),
            this)
      }),
      (i.prototype.highlightAll = function () {
        var e = this
        return (
          this._store.withTxn(function () {
            e._store.items.forEach(function (t) {
              t.highlighted ||
                (e._store.dispatch(ee(t, !0)),
                e.passedElement.triggerEvent(O.highlightItem, N(t)))
            })
          }),
          this
        )
      }),
      (i.prototype.unhighlightAll = function () {
        var e = this
        return (
          this._store.withTxn(function () {
            e._store.items.forEach(function (t) {
              t.highlighted &&
                (e._store.dispatch(ee(t, !1)),
                e.passedElement.triggerEvent(O.highlightItem, N(t)))
            })
          }),
          this
        )
      }),
      (i.prototype.removeActiveItemsByValue = function (e) {
        var t = this
        return (
          this._store.withTxn(function () {
            t._store.items
              .filter(function (s) {
                return s.value === e
              })
              .forEach(function (s) {
                return t._removeItem(s)
              })
          }),
          this
        )
      }),
      (i.prototype.removeActiveItems = function (e) {
        var t = this
        return (
          this._store.withTxn(function () {
            t._store.items
              .filter(function (s) {
                var n = s.id
                return n !== e
              })
              .forEach(function (s) {
                return t._removeItem(s)
              })
          }),
          this
        )
      }),
      (i.prototype.removeHighlightedItems = function (e) {
        var t = this
        return (
          e === void 0 && (e = !1),
          this._store.withTxn(function () {
            t._store.highlightedActiveItems.forEach(function (s) {
              ;(t._removeItem(s), e && t._triggerChange(s.value))
            })
          }),
          this
        )
      }),
      (i.prototype.showDropdown = function (e) {
        var t = this
        return this.dropdown.isActive
          ? this
          : (e === void 0 && (e = !this._canSearch),
            requestAnimationFrame(function () {
              t.dropdown.show()
              var s = t.dropdown.element.getBoundingClientRect()
              ;(t.containerOuter.open(s.bottom, s.height),
                e || t.input.focus(),
                t.passedElement.triggerEvent(O.showDropdown))
              var n = t.choiceList.element.querySelector(
                U(t.config.classNames.selectedState),
              )
              n !== null &&
                !Pe(n, t.choiceList.element) &&
                (t.choiceList.element.scrollTop = n.offsetTop)
            }),
            this)
      }),
      (i.prototype.hideDropdown = function (e) {
        var t = this
        return this.dropdown.isActive
          ? (this._removeHighlightedChoices(),
            requestAnimationFrame(function () {
              ;(t.dropdown.hide(),
                t.containerOuter.close(),
                !e &&
                  t._canSearch &&
                  (t.input.removeActiveDescendant(), t.input.blur()),
                t.passedElement.triggerEvent(O.hideDropdown))
            }),
            this)
          : this
      }),
      (i.prototype.getValue = function (e) {
        var t = this._store.items.map(function (s) {
          return e ? s.value : N(s)
        })
        return this._isSelectOneElement || this.config.singleModeForMultiSelect
          ? t[0]
          : t
      }),
      (i.prototype.setValue = function (e) {
        var t = this
        return this.initialisedOK
          ? (this._store.withTxn(function () {
              e.forEach(function (s) {
                s && t._addChoice(P(s, !1))
              })
            }),
            this._searcher.reset(),
            this)
          : (this._warnChoicesInitFailed('setValue'), this)
      }),
      (i.prototype.setChoiceByValue = function (e) {
        var t = this
        return this.initialisedOK
          ? this._isTextElement
            ? this
            : (this._store.withTxn(function () {
                var s = Array.isArray(e) ? e : [e]
                ;(s.forEach(function (n) {
                  return t._findAndSelectChoiceByValue(n)
                }),
                  t.unhighlightAll())
              }),
              this._searcher.reset(),
              this)
          : (this._warnChoicesInitFailed('setChoiceByValue'), this)
      }),
      (i.prototype.setChoices = function (e, t, s, n, r, o) {
        var a = this
        if (
          (e === void 0 && (e = []),
          t === void 0 && (t = 'value'),
          s === void 0 && (s = 'label'),
          n === void 0 && (n = !1),
          r === void 0 && (r = !0),
          o === void 0 && (o = !1),
          !this.initialisedOK)
        )
          return (this._warnChoicesInitFailed('setChoices'), this)
        if (!this._isSelectElement)
          throw new TypeError(
            "setChoices can't be used with INPUT based Choices",
          )
        if (typeof t != 'string' || !t)
          throw new TypeError(
            "value parameter must be a name of 'value' field in passed objects",
          )
        if (typeof e == 'function') {
          var l = e(this)
          if (typeof Promise == 'function' && l instanceof Promise)
            return new Promise(function (h) {
              return requestAnimationFrame(h)
            })
              .then(function () {
                return a._handleLoadingState(!0)
              })
              .then(function () {
                return l
              })
              .then(function (h) {
                return a.setChoices(h, t, s, n, r, o)
              })
              .catch(function (h) {
                a.config.silent || console.error(h)
              })
              .then(function () {
                return a._handleLoadingState(!1)
              })
              .then(function () {
                return a
              })
          if (!Array.isArray(l))
            throw new TypeError(
              '.setChoices first argument function must return either array of choices or Promise, got: '.concat(
                typeof l,
              ),
            )
          e = l
        }
        if (!Array.isArray(e))
          throw new TypeError(
            '.setChoices must be called either with array of choices with a function resulting into Promise of array of choices',
          )
        return (
          this.containerOuter.removeLoadingState(),
          this._store.withTxn(function () {
            ;(r && (a._isSearching = !1), n && a.clearChoices(!0, o))
            var h = t === 'value',
              c = s === 'label'
            ;(e.forEach(function (u) {
              if ('choices' in u) {
                var f = u
                ;(c || (f = T(T({}, f), { label: f[s] })),
                  a._addGroup(P(f, !0)))
              } else {
                var v = u
                ;(!c || !h) && (v = T(T({}, v), { value: v[t], label: v[s] }))
                var m = P(v, !1)
                ;(a._addChoice(m),
                  m.placeholder &&
                    !a._hasNonChoicePlaceholder &&
                    (a._placeholderValue = ze(m.label)))
              }
            }),
              a.unhighlightAll())
          }),
          this.dropdown.isActive &&
            this._canAddUserChoices &&
            this._canCreateItem(this.input.value),
          this._searcher.reset(),
          this
        )
      }),
      (i.prototype.refresh = function (e, t, s) {
        var n = this
        return (
          e === void 0 && (e = !1),
          t === void 0 && (t = !1),
          s === void 0 && (s = !1),
          this._isSelectElement
            ? (this._store.withTxn(function () {
                var r = n.passedElement.optionsAsChoices(),
                  o = {}
                ;(s ||
                  n._store.items.forEach(function (l) {
                    l.id && l.active && l.selected && (o[l.value] = !0)
                  }),
                  n.clearStore(!1))
                var a = function (l) {
                  s ? n._store.dispatch(Me(l)) : o[l.value] && (l.selected = !0)
                }
                ;(r.forEach(function (l) {
                  if ('choices' in l) {
                    l.choices.forEach(a)
                    return
                  }
                  a(l)
                }),
                  n._addPredefinedChoices(r, t, e),
                  n._isSearching && n._searchChoices(n.input.value))
              }),
              this)
            : (this.config.silent ||
                console.warn(
                  'refresh method can only be used on choices backed by a <select> element',
                ),
              this)
        )
      }),
      (i.prototype.removeChoice = function (e) {
        var t = this._store.choices.find(function (s) {
          return s.value === e
        })
        return t
          ? (this._clearNotice(),
            this._store.dispatch(lt(t)),
            this._searcher.reset(),
            t.selected && this.passedElement.triggerEvent(O.removeItem, N(t)),
            this)
          : this
      }),
      (i.prototype.clearChoices = function (e, t) {
        var s = this
        return (
          e === void 0 && (e = !0),
          t === void 0 && (t = !1),
          e &&
            (t
              ? this.passedElement.element.replaceChildren('')
              : this.passedElement.element
                  .querySelectorAll(':not([selected])')
                  .forEach(function (n) {
                    n.remove()
                  })),
          this.itemList.element.replaceChildren(''),
          this.choiceList.element.replaceChildren(''),
          this._clearNotice(),
          this._store.withTxn(function () {
            var n = t ? [] : s._store.items
            ;(s._store.reset(),
              n.forEach(function (r) {
                ;(s._store.dispatch(De(r)), s._store.dispatch(xe(r)))
              }))
          }),
          this._searcher.reset(),
          this
        )
      }),
      (i.prototype.clearStore = function (e) {
        return (
          e === void 0 && (e = !0),
          this.clearChoices(e, !0),
          this._stopSearch(),
          (this._lastAddedChoiceId = 0),
          (this._lastAddedGroupId = 0),
          this
        )
      }),
      (i.prototype.clearInput = function () {
        var e = !this._isSelectOneElement
        return (this.input.clear(e), this._stopSearch(), this)
      }),
      (i.prototype._validateConfig = function () {
        var e = this.config,
          t = yt(e, Ke)
        ;(t.length &&
          console.warn('Unknown config option(s) passed', t.join(', ')),
          e.allowHTML &&
            e.allowHtmlUserInput &&
            (e.addItems &&
              console.warn(
                'Warning: allowHTML/allowHtmlUserInput/addItems all being true is strongly not recommended and may lead to XSS attacks',
              ),
            e.addChoices &&
              console.warn(
                'Warning: allowHTML/allowHtmlUserInput/addChoices all being true is strongly not recommended and may lead to XSS attacks',
              )))
      }),
      (i.prototype._render = function (e) {
        ;(e === void 0 && (e = { choices: !0, groups: !0, items: !0 }),
          !this._store.inTxn() &&
            (this._isSelectElement &&
              (e.choices || e.groups) &&
              this._renderChoices(),
            e.items && this._renderItems()))
      }),
      (i.prototype._renderChoices = function () {
        var e = this
        if (this._canAddItems()) {
          var t = this,
            s = t.config,
            n = t._isSearching,
            r = this._store,
            o = r.activeGroups,
            a = r.activeChoices,
            l = n ? s.searchResultLimit : s.renderChoiceLimit
          if (this._isSelectElement) {
            var h = a.filter(function (b) {
              return !b.element
            })
            h.length && this.passedElement.addOptions(h)
          }
          var c = document.createDocumentFragment(),
            u = function (b) {
              return b.filter(function (d) {
                return (
                  !d.placeholder &&
                  (n
                    ? (s.searchRenderSelectedChoices || !d.selected) && !!d.rank
                    : s.renderSelectedChoices || !d.selected)
                )
              })
            },
            f = s.appendGroupInSearch && n,
            v = !1,
            m = null,
            _ = function (b, d) {
              n ? b.sort(_t) : s.shouldSort && b.sort(s.sorter)
              var p = b.length
              ;((p = !d && l > 0 && p > l ? l : p),
                p--,
                b.every(function (g, S) {
                  var C =
                    g.choiceEl ||
                    e._templates.choice(
                      s,
                      g,
                      s.itemSelectText,
                      f && g.group ? g.group.label : void 0,
                    )
                  return (
                    (g.choiceEl = C),
                    c.appendChild(C),
                    n || !g.selected ? (v = !0) : m || (m = C),
                    S < p
                  )
                }))
            }
          ;(a.length &&
            (s.resetScrollPosition &&
              requestAnimationFrame(function () {
                return e.choiceList.scrollToTop()
              }),
            !this._hasNonChoicePlaceholder &&
              !n &&
              this._isSelectOneElement &&
              _(
                a.filter(function (b) {
                  return b.placeholder && !b.group
                }),
                !1,
              ),
            o.length && !n
              ? (s.shouldSort && o.sort(s.sorter),
                _(
                  a.filter(function (b) {
                    return !b.placeholder && !b.group
                  }),
                  !1,
                ),
                o.forEach(function (b) {
                  var d = u(b.choices)
                  if (d.length) {
                    if (b.label) {
                      var p = b.groupEl || e._templates.choiceGroup(e.config, b)
                      ;((b.groupEl = p), p.remove(), c.appendChild(p))
                    }
                    _(d, !0)
                  }
                }))
              : _(u(a), !1)),
            !v &&
              (n || !c.children.length || !s.renderSelectedChoices) &&
              (this._notice ||
                (this._notice = {
                  text: Re(n ? s.noResultsText : s.noChoicesText),
                  type: n ? I.noResults : I.noChoices,
                }),
              c.replaceChildren('')),
            this._renderNotice(c),
            this.choiceList.element.replaceChildren(c),
            this._highlightChoice(m))
        }
      }),
      (i.prototype._renderItems = function () {
        var e = this,
          t = this._store.items || [],
          s = this.itemList.element,
          n = this.config,
          r = document.createDocumentFragment(),
          o = function (u) {
            return s.querySelector('[data-item][data-id="'.concat(u.id, '"]'))
          },
          a = function (u) {
            var f = u.itemEl
            ;(f && f.parentElement) ||
              ((f = o(u) || e._templates.item(n, u, n.removeItemButton)),
              (u.itemEl = f),
              r.appendChild(f))
          }
        t.forEach(a)
        var l = !!r.childNodes.length
        if (this._isSelectOneElement) {
          var h = s.children.length
          if (l || h > 1) {
            var c = s.querySelector(U(n.classNames.placeholder))
            c && c.remove()
          } else
            !l &&
              !h &&
              this._placeholderValue &&
              ((l = !0),
              a(
                P(
                  {
                    selected: !0,
                    value: '',
                    label: this._placeholderValue,
                    placeholder: !0,
                  },
                  !1,
                ),
              ))
        }
        ;(l &&
          (s.append(r),
          n.shouldSortItems &&
            !this._isSelectOneElement &&
            (t.sort(n.sorter),
            t.forEach(function (u) {
              var f = o(u)
              f && (f.remove(), r.append(f))
            }),
            s.append(r))),
          this._isTextElement &&
            (this.passedElement.value = t
              .map(function (u) {
                var f = u.value
                return f
              })
              .join(n.delimiter)))
      }),
      (i.prototype._displayNotice = function (e, t, s) {
        s === void 0 && (s = !0)
        var n = this._notice
        if (
          n &&
          ((n.type === t && n.text === e) ||
            (n.type === I.addChoice &&
              (t === I.noResults || t === I.noChoices)))
        ) {
          s && this.showDropdown(!0)
          return
        }
        ;(this._clearNotice(),
          (this._notice = e ? { text: e, type: t } : void 0),
          this._renderNotice(),
          s && e && this.showDropdown(!0))
      }),
      (i.prototype._clearNotice = function () {
        if (this._notice) {
          var e = this.choiceList.element.querySelector(
            U(this.config.classNames.notice),
          )
          ;(e && e.remove(), (this._notice = void 0))
        }
      }),
      (i.prototype._renderNotice = function (e) {
        var t = this._notice
        if (t) {
          var s = this._templates.notice(this.config, t.text, t.type)
          e ? e.append(s) : this.choiceList.prepend(s)
        }
      }),
      (i.prototype._getChoiceForOutput = function (e, t) {
        return N(e, t)
      }),
      (i.prototype._triggerChange = function (e) {
        e != null && this.passedElement.triggerEvent(O.change, { value: e })
      }),
      (i.prototype._handleButtonAction = function (e) {
        var t = this,
          s = this._store.items
        if (!(
          !s.length ||
          !this.config.removeItems ||
          !this.config.removeItemButton
        )) {
          var n = e && ue(e.closest('[data-id]')),
            r =
              n &&
              s.find(function (o) {
                return o.id === n
              })
          r &&
            this._store.withTxn(function () {
              if (
                (t._removeItem(r),
                t._triggerChange(r.value),
                t._isSelectOneElement && !t._hasNonChoicePlaceholder)
              ) {
                var o = (
                  t.config.shouldSort
                    ? t._store.choices.reverse()
                    : t._store.choices
                ).find(function (a) {
                  return a.placeholder
                })
                o &&
                  (t._addItem(o),
                  t.unhighlightAll(),
                  o.value && t._triggerChange(o.value))
              }
            })
        }
      }),
      (i.prototype._handleItemAction = function (e, t) {
        var s = this
        t === void 0 && (t = !1)
        var n = this._store.items
        if (!(
          !n.length ||
          !this.config.removeItems ||
          this._isSelectOneElement
        )) {
          var r = ue(e)
          r &&
            (n.forEach(function (o) {
              o.id === r && !o.highlighted
                ? s.highlightItem(o)
                : !t && o.highlighted && s.unhighlightItem(o)
            }),
            this.input.focus())
        }
      }),
      (i.prototype._handleChoiceAction = function (e) {
        var t = this,
          s = ue(e),
          n = s && this._store.getChoiceById(s)
        if (!n || n.disabled) return !1
        var r = this.dropdown.isActive
        if (!n.selected) {
          if (!this._canAddItems()) return !0
          ;(this._store.withTxn(function () {
            ;(t._addItem(n, !0, !0), t.clearInput(), t.unhighlightAll())
          }),
            this._triggerChange(n.value))
        }
        return (
          r &&
            this.config.closeDropdownOnSelect &&
            (this.hideDropdown(!0), this.containerOuter.element.focus()),
          !0
        )
      }),
      (i.prototype._handleBackspace = function (e) {
        var t = this.config
        if (!(!t.removeItems || !e.length)) {
          var s = e[e.length - 1],
            n = e.some(function (r) {
              return r.highlighted
            })
          t.editItems && !n && s
            ? ((this.input.value = s.value),
              this.input.setWidth(),
              this._removeItem(s),
              this._triggerChange(s.value))
            : (n || this.highlightItem(s, !1), this.removeHighlightedItems(!0))
        }
      }),
      (i.prototype._loadChoices = function () {
        var e,
          t = this,
          s = this.config
        if (this._isTextElement) {
          if (
            ((this._presetChoices = s.items.map(function (o) {
              return P(o, !1)
            })),
            this.passedElement.value)
          ) {
            var n = this.passedElement.value
              .split(s.delimiter)
              .map(function (o) {
                return P(o, !1, t.config.allowHtmlUserInput)
              })
            this._presetChoices = this._presetChoices.concat(n)
          }
          this._presetChoices.forEach(function (o) {
            o.selected = !0
          })
        } else if (this._isSelectElement) {
          this._presetChoices = s.choices.map(function (o) {
            return P(o, !0)
          })
          var r = this.passedElement.optionsAsChoices()
          r && (e = this._presetChoices).push.apply(e, r)
        }
      }),
      (i.prototype._handleLoadingState = function (e) {
        e === void 0 && (e = !0)
        var t = this.itemList.element
        e
          ? (this.disable(),
            this.containerOuter.addLoadingState(),
            this._isSelectOneElement
              ? t.replaceChildren(
                  this._templates.placeholder(
                    this.config,
                    this.config.loadingText,
                  ),
                )
              : (this.input.placeholder = this.config.loadingText))
          : (this.enable(),
            this.containerOuter.removeLoadingState(),
            this._isSelectOneElement
              ? (t.replaceChildren(''), this._render())
              : (this.input.placeholder = this._placeholderValue || ''))
      }),
      (i.prototype._handleSearch = function (e) {
        if (this.input.isFocussed)
          if (
            e !== null &&
            typeof e < 'u' &&
            e.length >= this.config.searchFloor
          ) {
            var t = this.config.searchChoices ? this._searchChoices(e) : 0
            t !== null &&
              this.passedElement.triggerEvent(O.search, {
                value: e,
                resultCount: t,
              })
          } else
            this._store.choices.some(function (s) {
              return !s.active
            }) && this._stopSearch()
      }),
      (i.prototype._canAddItems = function () {
        var e = this.config,
          t = e.maxItemCount,
          s = e.maxItemText
        return !e.singleModeForMultiSelect &&
          t > 0 &&
          t <= this._store.items.length
          ? (this.choiceList.element.replaceChildren(''),
            (this._notice = void 0),
            this._displayNotice(
              typeof s == 'function' ? s(t) : s,
              I.addChoice,
              !1,
            ),
            !1)
          : (this._notice &&
              this._notice.type === I.addChoice &&
              this._clearNotice(),
            !0)
      }),
      (i.prototype._canCreateItem = function (e) {
        var t = this.config,
          s = !0,
          n = ''
        if (
          (s &&
            typeof t.addItemFilter == 'function' &&
            !t.addItemFilter(e) &&
            ((s = !1), (n = X(t.customAddItemText, e, void 0))),
          s)
        ) {
          var r = this._store.choices.find(function (o) {
            return t.valueComparer(o.value, e)
          })
          if (r) {
            if (this._isSelectElement)
              return (this._displayNotice('', I.addChoice), !1)
            t.duplicateItemsAllowed ||
              ((s = !1), (n = X(t.uniqueItemText, e, void 0)))
          }
        }
        return (
          s && (n = X(t.addItemText, e, void 0)),
          n && this._displayNotice(n, I.addChoice),
          s
        )
      }),
      (i.prototype._searchChoices = function (e) {
        var t = e.trim().replace(/\s{2,}/, ' ')
        if (!t.length || t === this._currentValue) return null
        var s = this._searcher
        s.isEmptyIndex() && s.index(this._store.searchableChoices)
        var n = s.search(t)
        ;((this._currentValue = t),
          (this._highlightPosition = 0),
          (this._isSearching = !0))
        var r = this._notice,
          o = r && r.type
        return (
          o !== I.addChoice &&
            (n.length
              ? this._clearNotice()
              : this._displayNotice(
                  Re(this.config.noResultsText),
                  I.noResults,
                )),
          this._store.dispatch(ct(n)),
          n.length
        )
      }),
      (i.prototype._stopSearch = function () {
        this._isSearching &&
          ((this._currentValue = ''),
          (this._isSearching = !1),
          this._clearNotice(),
          this._store.dispatch(ht(!0)),
          this.passedElement.triggerEvent(O.search, {
            value: '',
            resultCount: 0,
          }))
      }),
      (i.prototype._addEventListeners = function () {
        var e = this._docRoot,
          t = this.containerOuter.element,
          s = this.input.element,
          n = this.passedElement.element
        ;(e.addEventListener('touchend', this._onTouchEnd, !0),
          t.addEventListener('keydown', this._onKeyDown, !0),
          t.addEventListener('mousedown', this._onMouseDown, !0),
          e.addEventListener('click', this._onClick, { passive: !0 }),
          e.addEventListener('touchmove', this._onTouchMove, { passive: !0 }),
          this.dropdown.element.addEventListener(
            'mouseover',
            this._onMouseOver,
            { passive: !0 },
          ),
          this._isSelectOneElement &&
            (t.addEventListener('focus', this._onFocus, { passive: !0 }),
            t.addEventListener('blur', this._onBlur, { passive: !0 })),
          s.addEventListener('keyup', this._onKeyUp, { passive: !0 }),
          s.addEventListener('input', this._onInput, { passive: !0 }),
          s.addEventListener('focus', this._onFocus, { passive: !0 }),
          s.addEventListener('blur', this._onBlur, { passive: !0 }),
          s.form &&
            s.form.addEventListener('reset', this._onFormReset, {
              passive: !0,
            }),
          n.hasAttribute('required') &&
            (n.addEventListener('change', this._onChange, { passive: !0 }),
            n.addEventListener('invalid', this._onInvalid, { passive: !0 })),
          this.input.addEventListeners())
      }),
      (i.prototype._removeEventListeners = function () {
        var e = this._docRoot,
          t = this.containerOuter.element,
          s = this.input.element,
          n = this.passedElement.element
        ;(e.removeEventListener('touchend', this._onTouchEnd, !0),
          t.removeEventListener('keydown', this._onKeyDown, !0),
          t.removeEventListener('mousedown', this._onMouseDown, !0),
          e.removeEventListener('click', this._onClick),
          e.removeEventListener('touchmove', this._onTouchMove),
          this.dropdown.element.removeEventListener(
            'mouseover',
            this._onMouseOver,
          ),
          this._isSelectOneElement &&
            (t.removeEventListener('focus', this._onFocus),
            t.removeEventListener('blur', this._onBlur)),
          s.removeEventListener('keyup', this._onKeyUp),
          s.removeEventListener('input', this._onInput),
          s.removeEventListener('focus', this._onFocus),
          s.removeEventListener('blur', this._onBlur),
          s.form && s.form.removeEventListener('reset', this._onFormReset),
          n.hasAttribute('required') &&
            (n.removeEventListener('change', this._onChange),
            n.removeEventListener('invalid', this._onInvalid)),
          this.input.removeEventListeners())
      }),
      (i.prototype._onKeyDown = function (e) {
        var t = e.keyCode,
          s = this.dropdown.isActive,
          n =
            e.key.length === 1 ||
            (e.key.length === 2 && e.key.charCodeAt(0) >= 55296) ||
            e.key === 'Unidentified'
        switch (
          (!this._isTextElement &&
            !s &&
            t !== A.ESC_KEY &&
            t !== A.TAB_KEY &&
            t !== A.SHIFT_KEY &&
            (this.showDropdown(),
            !this.input.isFocussed &&
              n &&
              ((this.input.value += e.key),
              e.key === ' ' && e.preventDefault())),
          t)
        ) {
          case A.A_KEY:
            return this._onSelectKey(e, this.itemList.element.hasChildNodes())
          case A.ENTER_KEY:
            return this._onEnterKey(e, s)
          case A.ESC_KEY:
            return this._onEscapeKey(e, s)
          case A.UP_KEY:
          case A.PAGE_UP_KEY:
          case A.DOWN_KEY:
          case A.PAGE_DOWN_KEY:
            return this._onDirectionKey(e, s)
          case A.DELETE_KEY:
          case A.BACK_KEY:
            return this._onDeleteKey(
              e,
              this._store.items,
              this.input.isFocussed,
            )
        }
      }),
      (i.prototype._onKeyUp = function () {
        this._canSearch = this.config.searchEnabled
      }),
      (i.prototype._onInput = function () {
        var e = this.input.value
        if (!e) {
          this._isTextElement ? this.hideDropdown(!0) : this._stopSearch()
          return
        }
        this._canAddItems() &&
          (this._canSearch && this._handleSearch(e),
          this._canAddUserChoices &&
            (this._canCreateItem(e),
            this._isSelectElement &&
              ((this._highlightPosition = 0), this._highlightChoice())))
      }),
      (i.prototype._onSelectKey = function (e, t) {
        if ((e.ctrlKey || e.metaKey) && t) {
          this._canSearch = !1
          var s =
            this.config.removeItems &&
            !this.input.value &&
            this.input.element === document.activeElement
          s && this.highlightAll()
        }
      }),
      (i.prototype._onEnterKey = function (e, t) {
        var s = this,
          n = this.input.value,
          r = e.target
        if ((e.preventDefault(), r && r.hasAttribute('data-button'))) {
          this._handleButtonAction(r)
          return
        }
        if (!t) {
          ;(this._isSelectElement || this._notice) && this.showDropdown()
          return
        }
        var o = this.dropdown.element.querySelector(
          U(this.config.classNames.highlightedState),
        )
        if (!(o && this._handleChoiceAction(o))) {
          if (!r || !n) {
            this.hideDropdown(!0)
            return
          }
          if (this._canAddItems()) {
            var a = !1
            ;(this._store.withTxn(function () {
              if (((a = s._findAndSelectChoiceByValue(n, !0)), !a)) {
                if (!s._canAddUserChoices || !s._canCreateItem(n)) return
                ;(s._addChoice(P(n, !1, s.config.allowHtmlUserInput), !0, !0),
                  (a = !0))
              }
              ;(s.clearInput(), s.unhighlightAll())
            }),
              a &&
                (this._triggerChange(n),
                this.config.closeDropdownOnSelect && this.hideDropdown(!0)))
          }
        }
      }),
      (i.prototype._onEscapeKey = function (e, t) {
        t &&
          (e.stopPropagation(),
          this.hideDropdown(!0),
          this._stopSearch(),
          this.containerOuter.element.focus())
      }),
      (i.prototype._onDirectionKey = function (e, t) {
        var s = e.keyCode
        if (t || this._isSelectOneElement) {
          ;(this.showDropdown(), (this._canSearch = !1))
          var n = s === A.DOWN_KEY || s === A.PAGE_DOWN_KEY ? 1 : -1,
            r = e.metaKey || s === A.PAGE_DOWN_KEY || s === A.PAGE_UP_KEY,
            o = void 0
          if (r)
            n > 0
              ? (o = this.dropdown.element.querySelector(
                  ''.concat(Y, ':last-of-type'),
                ))
              : (o = this.dropdown.element.querySelector(Y))
          else {
            var a = this.dropdown.element.querySelector(
              U(this.config.classNames.highlightedState),
            )
            a ? (o = pt(a, Y, n)) : (o = this.dropdown.element.querySelector(Y))
          }
          ;(o &&
            (Pe(o, this.choiceList.element, n) ||
              this.choiceList.scrollToChildElement(o, n),
            this._highlightChoice(o)),
            e.preventDefault())
        }
      }),
      (i.prototype._onDeleteKey = function (e, t, s) {
        !this._isSelectOneElement &&
          !e.target.value &&
          s &&
          (this._handleBackspace(t), e.preventDefault())
      }),
      (i.prototype._onTouchMove = function () {
        this._wasTap && (this._wasTap = !1)
      }),
      (i.prototype._onTouchEnd = function (e) {
        var t = (e || e.touches[0]).target,
          s = this._wasTap && this.containerOuter.element.contains(t)
        if (s) {
          var n =
            t === this.containerOuter.element ||
            t === this.containerInner.element
          ;(n &&
            (this._isTextElement
              ? this.input.focus()
              : this._isSelectMultipleElement && this.showDropdown()),
            e.stopPropagation())
        }
        this._wasTap = !0
      }),
      (i.prototype._onMouseDown = function (e) {
        var t = e.target
        if (t instanceof Element) {
          if (yi && this.choiceList.element.contains(t)) {
            var s = this.choiceList.element.firstElementChild
            this._isScrollingOnIe =
              this._direction === 'ltr'
                ? e.offsetX >= s.offsetWidth
                : e.offsetX < s.offsetLeft
          }
          if (t !== this.input.element) {
            var n = t.closest('[data-button],[data-item],[data-choice]')
            ;(n instanceof HTMLElement &&
              ('button' in n.dataset
                ? this._handleButtonAction(n)
                : 'item' in n.dataset
                  ? this._handleItemAction(n, e.shiftKey)
                  : 'choice' in n.dataset && this._handleChoiceAction(n)),
              e.preventDefault())
          }
        }
      }),
      (i.prototype._onMouseOver = function (e) {
        var t = e.target
        t instanceof HTMLElement &&
          'choice' in t.dataset &&
          this._highlightChoice(t)
      }),
      (i.prototype._onClick = function (e) {
        var t = e.target,
          s = this.containerOuter,
          n = s.element.contains(t)
        n
          ? !this.dropdown.isActive && !s.isDisabled
            ? this._isTextElement
              ? document.activeElement !== this.input.element &&
                this.input.focus()
              : (this.showDropdown(), s.element.focus())
            : this._isSelectOneElement &&
              t !== this.input.element &&
              !this.dropdown.element.contains(t) &&
              this.hideDropdown()
          : (s.removeFocusState(), this.hideDropdown(!0), this.unhighlightAll())
      }),
      (i.prototype._onFocus = function (e) {
        var t = e.target,
          s = this.containerOuter,
          n = t && s.element.contains(t)
        if (n) {
          var r = t === this.input.element
          this._isTextElement
            ? r && s.addFocusState()
            : this._isSelectMultipleElement
              ? r && (this.showDropdown(!0), s.addFocusState())
              : (s.addFocusState(), r && this.showDropdown(!0))
        }
      }),
      (i.prototype._onBlur = function (e) {
        var t = e.target,
          s = this.containerOuter,
          n = t && s.element.contains(t)
        n && !this._isScrollingOnIe
          ? t === this.input.element
            ? (s.removeFocusState(),
              this.hideDropdown(!0),
              (this._isTextElement || this._isSelectMultipleElement) &&
                this.unhighlightAll())
            : t === this.containerOuter.element &&
              (s.removeFocusState(),
              this.config.searchEnabled || this.hideDropdown(!0))
          : ((this._isScrollingOnIe = !1), this.input.element.focus())
      }),
      (i.prototype._onFormReset = function () {
        var e = this
        this._store.withTxn(function () {
          ;(e.clearInput(),
            e.hideDropdown(),
            e.refresh(!1, !1, !0),
            e._initialItems.length && e.setChoiceByValue(e._initialItems))
        })
      }),
      (i.prototype._onChange = function (e) {
        e.target.checkValidity() && this.containerOuter.removeInvalidState()
      }),
      (i.prototype._onInvalid = function () {
        this.containerOuter.addInvalidState()
      }),
      (i.prototype._removeHighlightedChoices = function () {
        var e = this.config.classNames.highlightedState,
          t = Array.from(this.dropdown.element.querySelectorAll(U(e)))
        t.forEach(function (s) {
          ;(M(s, e), s.setAttribute('aria-selected', 'false'))
        })
      }),
      (i.prototype._highlightChoice = function (e) {
        e === void 0 && (e = null)
        var t = Array.from(this.dropdown.element.querySelectorAll(Y))
        if (t.length) {
          var s = e,
            n = this.config.classNames.highlightedState
          ;(this._removeHighlightedChoices(),
            s
              ? (this._highlightPosition = t.indexOf(s))
              : (t.length > this._highlightPosition
                  ? (s = t[this._highlightPosition])
                  : (s = t[t.length - 1]),
                s || (s = t[0])),
            E(s, n),
            s.setAttribute('aria-selected', 'true'),
            this.passedElement.triggerEvent(O.highlightChoice, { el: s }),
            this.dropdown.isActive &&
              (this.input.setActiveDescendant(s.id),
              this.containerOuter.setActiveDescendant(s.id)))
        }
      }),
      (i.prototype._addItem = function (e, t, s) {
        if ((t === void 0 && (t = !0), s === void 0 && (s = !1), !e.id))
          throw new TypeError(
            'item.id must be set before _addItem is called for a choice/item',
          )
        if (
          ((this.config.singleModeForMultiSelect || this._isSelectOneElement) &&
            this.removeActiveItems(e.id),
          this._store.dispatch(xe(e)),
          t)
        ) {
          var n = N(e)
          ;(this.passedElement.triggerEvent(O.addItem, n),
            s && this.passedElement.triggerEvent(O.choice, n))
        }
      }),
      (i.prototype._removeItem = function (e) {
        if (e.id) {
          this._store.dispatch(Me(e))
          var t = this._notice
          ;(t && t.type === I.noChoices && this._clearNotice(),
            this.passedElement.triggerEvent(O.removeItem, N(e)))
        }
      }),
      (i.prototype._addChoice = function (e, t, s) {
        if ((t === void 0 && (t = !0), s === void 0 && (s = !1), e.id))
          throw new TypeError(
            'Can not re-add a choice which has already been added',
          )
        var n = this.config
        if (!(
          !n.duplicateItemsAllowed &&
          this._store.choices.find(function (a) {
            return n.valueComparer(a.value, e.value)
          })
        )) {
          ;(this._lastAddedChoiceId++,
            (e.id = this._lastAddedChoiceId),
            (e.elementId = ''
              .concat(this._baseId, '-')
              .concat(this._idNames.itemChoice, '-')
              .concat(e.id)))
          var r = n.prependValue,
            o = n.appendValue
          ;(r && (e.value = r + e.value),
            o && (e.value += o.toString()),
            (r || o) && e.element && (e.element.value = e.value),
            this._clearNotice(),
            this._store.dispatch(De(e)),
            e.selected && this._addItem(e, t, s))
        }
      }),
      (i.prototype._addGroup = function (e, t) {
        var s = this
        if ((t === void 0 && (t = !0), e.id))
          throw new TypeError(
            'Can not re-add a group which has already been added',
          )
        ;(this._store.dispatch(ut(e)),
          e.choices &&
            (this._lastAddedGroupId++,
            (e.id = this._lastAddedGroupId),
            e.choices.forEach(function (n) {
              ;((n.group = e),
                e.disabled && (n.disabled = !0),
                s._addChoice(n, t))
            })))
      }),
      (i.prototype._createTemplates = function () {
        var e = this,
          t = this.config.callbackOnCreateTemplates,
          s = {}
        typeof t == 'function' && (s = t.call(this, mt, Oe, oe))
        var n = {}
        ;(Object.keys(this._templates).forEach(function (r) {
          r in s ? (n[r] = s[r].bind(e)) : (n[r] = e._templates[r].bind(e))
        }),
          (this._templates = n))
      }),
      (i.prototype._createElements = function () {
        var e = this._templates,
          t = this,
          s = t.config,
          n = t._isSelectOneElement,
          r = s.position,
          o = s.classNames,
          a = this._elementType
        ;((this.containerOuter = new ke({
          element: e.containerOuter(
            s,
            this._direction,
            this._isSelectElement,
            n,
            s.searchEnabled,
            a,
            s.labelId,
          ),
          classNames: o,
          type: a,
          position: r,
        })),
          (this.containerInner = new ke({
            element: e.containerInner(s),
            classNames: o,
            type: a,
            position: r,
          })),
          (this.input = new wt({
            element: e.input(s, this._placeholderValue),
            classNames: o,
            type: a,
            preventPaste: !s.paste,
          })),
          (this.choiceList = new Fe({ element: e.choiceList(s, n) })),
          (this.itemList = new Fe({ element: e.itemList(s, n) })),
          (this.dropdown = new Ct({
            element: e.dropdown(s),
            classNames: o,
            type: a,
          })))
      }),
      (i.prototype._createStructure = function () {
        var e = this,
          t = e.containerInner,
          s = e.containerOuter,
          n = e.passedElement,
          r = this.dropdown.element
        ;(n.conceal(),
          t.wrap(n.element),
          s.wrap(t.element),
          s.element.appendChild(t.element),
          s.element.appendChild(r),
          t.element.appendChild(this.itemList.element),
          r.appendChild(this.choiceList.element),
          this._isSelectOneElement
            ? ((this.input.placeholder =
                this.config.searchPlaceholderValue || ''),
              this.config.searchEnabled &&
                r.insertBefore(this.input.element, r.firstChild))
            : ((!this._isSelectMultipleElement || this.config.searchEnabled) &&
                t.element.appendChild(this.input.element),
              this._placeholderValue &&
                (this.input.placeholder = this._placeholderValue),
              this.input.setWidth()),
          (this._highlightPosition = 0),
          (this._isSearching = !1))
      }),
      (i.prototype._initStore = function () {
        var e = this
        ;(this._store.subscribe(this._render).withTxn(function () {
          e._addPredefinedChoices(
            e._presetChoices,
            e._isSelectOneElement && !e._hasNonChoicePlaceholder,
            !1,
          )
        }),
          (!this._store.choices.length ||
            (this._isSelectOneElement && this._hasNonChoicePlaceholder)) &&
            this._render())
      }),
      (i.prototype._addPredefinedChoices = function (e, t, s) {
        var n = this
        if ((t === void 0 && (t = !1), s === void 0 && (s = !0), t)) {
          var r =
            e.findIndex(function (o) {
              return o.selected
            }) === -1
          r &&
            e.some(function (o) {
              return o.disabled || 'choices' in o ? !1 : ((o.selected = !0), !0)
            })
        }
        e.forEach(function (o) {
          'choices' in o
            ? n._isSelectElement && n._addGroup(o, s)
            : n._addChoice(o, s)
        })
      }),
      (i.prototype._findAndSelectChoiceByValue = function (e, t) {
        var s = this
        t === void 0 && (t = !1)
        var n = this._store.choices.find(function (r) {
          return s.config.valueComparer(r.value, e)
        })
        return n && !n.disabled && !n.selected
          ? (this._addItem(n, !0, t), !0)
          : !1
      }),
      (i.prototype._generatePlaceholderValue = function () {
        var e = this.config
        if (!e.placeholder) return null
        if (this._hasNonChoicePlaceholder) return e.placeholderValue
        if (this._isSelectElement) {
          var t = this.passedElement.placeholderOption
          return t ? t.text : null
        }
        return null
      }),
      (i.prototype._warnChoicesInitFailed = function (e) {
        if (!this.config.silent)
          if (this.initialised) {
            if (!this.initialisedOK)
              throw new TypeError(
                ''.concat(
                  e,
                  ' called for an element which has multiple instances of Choices initialised on it',
                ),
              )
          } else
            throw new TypeError(
              ''.concat(e, ' called on a non-initialised instance of Choices'),
            )
      }),
      (i.version = '11.2.3'),
      i
    )
  })()
function Ei({
  getResultsUsing: i,
  hasDynamicSearchResults: e,
  label: t,
  loadingMessage: s,
  errorMessage: n,
  unavailableMessage: r,
  noSearchResultsMessage: o,
  optionsLimit: a,
  pinLabel: l,
  pinnedMessage: h,
  searchPrompt: c,
  searchingMessage: u,
  state: f,
  togglePin: v,
  unpinLabel: m,
  unpinnedMessage: _,
  updateSelected: b,
}) {
  return {
    isSearching: !1,
    select: null,
    selectedOptions: [],
    isStateBeingUpdated: !1,
    searchRequest: 0,
    state: f,
    _handlers: {},
    _loadingTimer: null,
    destroyed: !1,
    suppressRefresh: !1,
    pinnable: new Map(),
    lastSearch: void 0,
    statusElement: null,
    async init() {
      ;((this.select = new rt(this.$refs.input, {
        allowHTML: !1,
        searchChoices: !1,
        duplicateItemsAllowed: !1,
        itemSelectText: '',
        loadingText: s,
        maxItemCount: -1,
        noChoicesText: c,
        noResultsText: o,
        placeholderValue: t,
        removeItemButton: !1,
        renderChoiceLimit: a,
        searchEnabled: !0,
        searchFields: ['label'],
        searchPlaceholderValue: c,
        searchResultLimit: a,
        shouldSort: !1,
        searchFloor: e ? 0 : 1,
        classNames: {
          containerOuter: ['choices', 'choices__select__changer'],
          containerInner: 'choices__inner',
          input: 'choices__input',
          listDropdown: 'choices__list--dropdown',
          item: ['choices__item', 'choices__select__changer__item'],
          list: 'choices__list',
          placeholder: 'choices__placeholder',
        },
      })),
        this.refreshPlaceholder(),
        (this._handlers.showDropdown = async () => {
          if (this.suppressRefresh) {
            this.suppressRefresh = !1
            return
          }
          await this.refreshChoices()
        }),
        (this._handlers.change = async () => {
          let p = this.select.getValue(!0) ?? null
          if ((this.setChoices([{ label: t, value: f, selected: !0 }]), !p))
            return
          let g = ++this.searchRequest
          try {
            let S = await b(p)
            if (this.destroyed || g !== this.searchRequest) return
            let C = S ? new URL(S, window.location.href) : null
            if (
              !C ||
              !['http:', 'https:'].includes(C.protocol) ||
              C.origin !== window.location.origin
            ) {
              this.showMessage(r)
              return
            }
            window.location.assign(C.href)
          } catch {
            !this.destroyed && g === this.searchRequest && this.showMessage(n)
          }
        }),
        (this._handlers.search = async () => {
          ;(++this.searchRequest, (this.isSearching = !0))
        }))
      let d = window.Alpine
      ;((this._handlers.debouncedSearch = d?.debounce
        ? d.debounce(async (p) => {
            ;(await this.refreshChoices({ search: p.detail.value?.trim() }),
              (this.isSearching = !1))
          }, 120)
        : async (p) => {
            ;(await this.refreshChoices({ search: p.detail.value?.trim() }),
              (this.isSearching = !1))
          }),
        (this._handlers.keydown = (p) => {
          if (
            v &&
            p.altKey &&
            p.code === 'KeyP' &&
            this.select?.dropdown?.isActive
          ) {
            p.preventDefault()
            let g = this.select.dropdown.element.querySelector(
              '.choices__item.is-highlighted',
            )?.dataset.value
            g && this.togglePinned(g)
          } else
            p.key === 'Escape' && this.select?.dropdown?.isActive
              ? (p.preventDefault(),
                p.stopPropagation(),
                this.select.hideDropdown(),
                this.select.containerOuter.element.focus())
              : p.key === 'Tab' && this.select.hideDropdown()
        }),
        this.$refs.input.addEventListener(
          'showDropdown',
          this._handlers.showDropdown,
        ),
        this.$refs.input.addEventListener('change', this._handlers.change),
        this.$refs.input.addEventListener('search', this._handlers.search),
        this.$refs.input.addEventListener(
          'search',
          this._handlers.debouncedSearch,
        ),
        this.$el.addEventListener('keydown', this._handlers.keydown),
        (this._handlers.pinPointer = (p) => {
          let g = p.target?.closest?.('[data-pin-toggle]')
          g &&
            (p.preventDefault(),
            p.stopPropagation(),
            p.type === 'click' && this.togglePinned(g.dataset.recordKey))
        }),
        ['mousedown', 'click'].forEach((p) =>
          this.select.dropdown.element.addEventListener(
            p,
            this._handlers.pinPointer,
            !0,
          ),
        ),
        (this._handlers.wireRefresh = () => {
          ;(this.select.clearChoices(),
            this.select.setChoices([{ label: t, value: f, selected: !0 }]))
        }),
        this.$wire?.on &&
          this.$wire.on('record-switcher:refresh', this._handlers.wireRefresh))
    },
    destroy() {
      ;((this.destroyed = !0),
        ++this.searchRequest,
        window.clearTimeout(this._loadingTimer),
        this.select &&
          (['mousedown', 'click'].forEach((d) =>
            this.select.dropdown.element.removeEventListener(
              d,
              this._handlers.pinPointer,
              !0,
            ),
          ),
          this.select.destroy(),
          (this.select = null)),
        this.$refs.input &&
          (this.$refs.input.removeEventListener(
            'showDropdown',
            this._handlers.showDropdown,
          ),
          this.$refs.input.removeEventListener('change', this._handlers.change),
          this.$refs.input.removeEventListener('search', this._handlers.search),
          this.$refs.input.removeEventListener(
            'search',
            this._handlers.debouncedSearch,
          )),
        this.$el &&
          this.$el.removeEventListener('keydown', this._handlers.keydown),
        this.statusElement?.remove?.(),
        this.$wire?.off &&
          this._handlers.wireRefresh &&
          this.$wire.off('record-switcher:refresh', this._handlers.wireRefresh))
    },
    async refreshChoices(d = {}) {
      if (this.destroyed) return
      let p,
        g = ++this.searchRequest
      ;((this.lastSearch = d.search), this.scheduleLoadingChoice(d.search))
      try {
        p = await this.getChoices(d)
      } catch {
        p = [{ label: n, value: '', disabled: !0 }]
      }
      this.destroyed ||
        g !== this.searchRequest ||
        (window.clearTimeout(this._loadingTimer),
        this.refreshPlaceholder(),
        this.setChoices(p.length ? p : [{ label: o, value: '', disabled: !0 }]),
        (this.isSearching = !1),
        this.highlightSelectedChoice())
    },
    scheduleLoadingChoice(d) {
      ;(window.clearTimeout(this._loadingTimer),
        (this._loadingTimer = window.setTimeout(() => {
          this.destroyed ||
            this.hasVisibleChoices() ||
            (this.select.clearChoices(),
            this.select.setChoices([
              {
                label: [null, void 0, ''].includes(d) ? s : u,
                value: '',
                disabled: !0,
              },
            ]))
        }, 140)))
    },
    highlightSelectedChoice() {
      if ([null, void 0, ''].includes(this.state)) return
      let d = this.select.dropdown.element.querySelector(
        `.choices__item[data-value="${this.state}"]`,
      )
      d &&
        (this.select._highlightChoice(d),
        window.setTimeout(() => d.scrollIntoView({ block: 'nearest' }), 100))
    },
    hasVisibleChoices() {
      return (
        this.select.dropdown.element.querySelector(
          '.choices__item[data-choice-selectable]',
        ) !== null
      )
    },
    setChoices(d) {
      ;(this.select.setChoices(d, 'value', 'label', !0),
        this.decoratePinButtons())
    },
    decoratePinButtons() {
      v &&
        this.select.dropdown.element
          .querySelectorAll?.('.choices__item[data-choice-selectable]')
          ?.forEach((d) => {
            let p = this.pinnable.get(d.dataset.value)
            if (!p) return
            let g = p.pinned === !0,
              S = d.ownerDocument,
              C = d.querySelector('[data-pin-toggle]')
            ;(C ||
              ((C = S.createElement('button')),
              (C.type = 'button'),
              (C.tabIndex = -1),
              (C.className = 'filament-record-switcher__pin'),
              C.setAttribute('data-pin-toggle', ''),
              C.setAttribute('aria-keyshortcuts', 'Alt+P'),
              C.append(this.pinIcon(S)),
              d.classList.add('has-pin'),
              d.append(C)),
              (C.dataset.recordKey = d.dataset.value),
              C.setAttribute('aria-pressed', String(g)),
              C.setAttribute(
                'aria-label',
                (g ? m : l).replace(':record', p.label),
              ),
              C.classList.toggle('is-pinned', g))
          })
    },
    pinIcon(d) {
      let p = 'http://www.w3.org/2000/svg',
        g = d.createElementNS(p, 'svg'),
        S = d.createElementNS(p, 'path')
      return (
        g.setAttribute('viewBox', '0 0 24 24'),
        g.setAttribute('aria-hidden', 'true'),
        g.setAttribute('focusable', 'false'),
        S.setAttribute(
          'd',
          'M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
        ),
        g.append(S),
        g
      )
    },
    async togglePinned(d) {
      let p = this.pinnable.get(d)
      if (!(!p || this.destroyed))
        try {
          let g = await v(d)
          ;(this.announce((g ? h : _).replace(':record', p.label)),
            await this.refreshChoices({ search: this.lastSearch }))
        } catch {
          this.showMessage(n)
        }
    },
    announce(d) {
      if (!this.statusElement) {
        let p = this.$el.ownerDocument
        ;((this.statusElement = p.createElement('span')),
          this.statusElement.setAttribute('role', 'status'),
          (this.statusElement.className = 'filament-record-switcher__status'),
          this.$el.append(this.statusElement))
      }
      this.statusElement.textContent = d
    },
    showMessage(d) {
      ;(this.setChoices([{ label: d, value: '', disabled: !0 }]),
        this.select.dropdown.isActive ||
          ((this.suppressRefresh = !0), this.select.showDropdown()))
    },
    async getChoices({ search: d }) {
      let p = await i(d)
      this.pinnable = new Map(
        p.map((C) => [
          String(C.recordKey),
          { label: C.label, pinned: C.pinned === !0 },
        ]),
      )
      let g = p.map((C) => ({
          ...C,
          value: C.recordKey,
          label: [
            C.label,
            [C.site, ...(C.ancestors ?? [])].filter(Boolean).join(' \u203A '),
            C.path,
          ].filter(Boolean).join(`
`),
        })),
        S = {}
      return (
        g.forEach((C) => {
          C.group &&
            ((S[C.group] ??= {
              label: C.group,
              id: C.group,
              disabled: !1,
              choices: [],
            }),
            S[C.group].choices.push(C))
        }),
        Object.keys(S).length === 0 ? g : Object.values(S)
      )
    },
    refreshPlaceholder() {
      if (
        (this.select._renderItems(), ![null, void 0, ''].includes(this.state))
      )
        return
      let d = this.$el.querySelector('.choices__list--single')
      d && (d.textContent = t ?? '')
    },
  }
}
export { Ei as default }
