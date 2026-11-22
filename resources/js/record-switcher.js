import Choices from 'choices.js'

export default function selectChangerComponent({
    getResultsUsing,
    hasDynamicSearchResults,
    label,
    loadingMessage,
    errorMessage,
    unavailableMessage,
    noSearchResultsMessage,
    optionsLimit,
    pinLabel,
    pinnedMessage,
    searchPrompt,
    searchingMessage,
    state,
    togglePin,
    unpinLabel,
    unpinnedMessage,
    updateSelected,
}) {
    return {
        isSearching: false,
        select: null,
        selectedOptions: [],
        isStateBeingUpdated: false,
        searchRequest: 0,
        state,
        _handlers: {},
        _loadingTimer: null,
        destroyed: false,
        suppressRefresh: false,
        pinnable: new Map(),
        lastSearch: undefined,
        statusElement: null,

        async init() {
            this.select = new Choices(this.$refs.input, {
                allowHTML: false,
                searchChoices: false,
                duplicateItemsAllowed: false,
                itemSelectText: '',
                loadingText: loadingMessage,
                maxItemCount: -1,
                noChoicesText: searchPrompt,
                noResultsText: noSearchResultsMessage,
                placeholderValue: label,
                removeItemButton: false,
                renderChoiceLimit: optionsLimit,
                searchEnabled: true,
                searchFields: ['label'],
                searchPlaceholderValue: searchPrompt,
                searchResultLimit: optionsLimit,
                shouldSort: false,
                searchFloor: hasDynamicSearchResults ? 0 : 1,
                classNames: {
                    containerOuter: ['choices', 'choices__select__changer'],
                    containerInner: 'choices__inner',
                    input: 'choices__input',
                    listDropdown: 'choices__list--dropdown',
                    item: ['choices__item', 'choices__select__changer__item'],
                    list: 'choices__list',
                    placeholder: 'choices__placeholder',
                },
            })

            this.refreshPlaceholder()

            this._handlers.showDropdown = async () => {
                if (this.suppressRefresh) {
                    this.suppressRefresh = false
                    return
                }
                await this.refreshChoices()
            }
            this._handlers.change = async () => {
                const selectedValue = this.select.getValue(true) ?? null
                this.setChoices([{ label, value: state, selected: true }])
                if (!selectedValue) return
                const request = ++this.searchRequest
                try {
                    const value = await updateSelected(selectedValue)
                    if (this.destroyed || request !== this.searchRequest) return
                    const url = value
                        ? new URL(value, window.location.href)
                        : null
                    if (
                        !url ||
                        !['http:', 'https:'].includes(url.protocol) ||
                        url.origin !== window.location.origin
                    ) {
                        this.showMessage(unavailableMessage)
                        return
                    }
                    window.location.assign(url.href)
                } catch {
                    if (!this.destroyed && request === this.searchRequest)
                        this.showMessage(errorMessage)
                }
            }
            this._handlers.search = async () => {
                ++this.searchRequest
                this.isSearching = true
            }

            const alpine = window.Alpine

            this._handlers.debouncedSearch = alpine?.debounce
                ? alpine.debounce(async (event) => {
                      await this.refreshChoices({
                          search: event.detail.value?.trim(),
                      })
                      this.isSearching = false
                  }, 120)
                : async (event) => {
                      await this.refreshChoices({
                          search: event.detail.value?.trim(),
                      })
                      this.isSearching = false
                  }
            this._handlers.keydown = (event) => {
                if (
                    togglePin &&
                    event.altKey &&
                    event.code === 'KeyP' &&
                    this.select?.dropdown?.isActive
                ) {
                    event.preventDefault()
                    const key = this.select.dropdown.element.querySelector(
                        '.choices__item.is-highlighted',
                    )?.dataset.value

                    if (key) {
                        this.togglePinned(key)
                    }
                } else if (
                    event.key === 'Escape' &&
                    this.select?.dropdown?.isActive
                ) {
                    event.preventDefault()
                    event.stopPropagation()
                    this.select.hideDropdown()
                    this.select.containerOuter.element.focus()
                } else if (event.key === 'Tab') {
                    this.select.hideDropdown()
                }
            }

            this.$refs.input.addEventListener(
                'showDropdown',
                this._handlers.showDropdown,
            )
            this.$refs.input.addEventListener('change', this._handlers.change)
            this.$refs.input.addEventListener('search', this._handlers.search)
            this.$refs.input.addEventListener(
                'search',
                this._handlers.debouncedSearch,
            )
            this.$el.addEventListener('keydown', this._handlers.keydown)

            // The pin button sits inside a selectable row, so stop the row from being chosen.
            this._handlers.pinPointer = (event) => {
                const button = event.target?.closest?.('[data-pin-toggle]')

                if (!button) {
                    return
                }

                event.preventDefault()
                event.stopPropagation()

                if (event.type === 'click') {
                    this.togglePinned(button.dataset.recordKey)
                }
            }
            ;['mousedown', 'click'].forEach((type) =>
                this.select.dropdown.element.addEventListener(
                    type,
                    this._handlers.pinPointer,
                    true,
                ),
            )

            this._handlers.wireRefresh = () => {
                this.select.clearChoices()
                this.select.setChoices([
                    { label, value: state, selected: true },
                ])
            }

            if (this.$wire?.on) {
                this.$wire.on(
                    'record-switcher:refresh',
                    this._handlers.wireRefresh,
                )
            }
        },

        destroy() {
            this.destroyed = true
            ++this.searchRequest
            window.clearTimeout(this._loadingTimer)

            if (this.select) {
                ;['mousedown', 'click'].forEach((type) =>
                    this.select.dropdown.element.removeEventListener(
                        type,
                        this._handlers.pinPointer,
                        true,
                    ),
                )
                this.select.destroy()
                this.select = null
            }

            if (this.$refs.input) {
                this.$refs.input.removeEventListener(
                    'showDropdown',
                    this._handlers.showDropdown,
                )
                this.$refs.input.removeEventListener(
                    'change',
                    this._handlers.change,
                )
                this.$refs.input.removeEventListener(
                    'search',
                    this._handlers.search,
                )
                this.$refs.input.removeEventListener(
                    'search',
                    this._handlers.debouncedSearch,
                )
            }

            if (this.$el) {
                this.$el.removeEventListener('keydown', this._handlers.keydown)
            }

            this.statusElement?.remove?.()

            if (this.$wire?.off && this._handlers.wireRefresh) {
                this.$wire.off(
                    'record-switcher:refresh',
                    this._handlers.wireRefresh,
                )
            }
        },

        async refreshChoices(options = {}) {
            if (this.destroyed) return
            let choices
            const request = ++this.searchRequest

            this.lastSearch = options.search
            this.scheduleLoadingChoice(options.search)

            try {
                choices = await this.getChoices(options)
            } catch {
                choices = [{ label: errorMessage, value: '', disabled: true }]
            }

            if (this.destroyed || request !== this.searchRequest) {
                return
            }

            window.clearTimeout(this._loadingTimer)
            this.refreshPlaceholder()
            this.setChoices(
                choices.length
                    ? choices
                    : [
                          {
                              label: noSearchResultsMessage,
                              value: '',
                              disabled: true,
                          },
                      ],
            )
            this.isSearching = false
            this.highlightSelectedChoice()
        },

        scheduleLoadingChoice(search) {
            window.clearTimeout(this._loadingTimer)
            this._loadingTimer = window.setTimeout(() => {
                if (this.destroyed || this.hasVisibleChoices()) {
                    return
                }

                this.select.clearChoices()
                this.select.setChoices([
                    {
                        label: [null, undefined, ''].includes(search)
                            ? loadingMessage
                            : searchingMessage,
                        value: '',
                        disabled: true,
                    },
                ])
            }, 140)
        },

        highlightSelectedChoice() {
            if ([null, undefined, ''].includes(this.state)) {
                return
            }

            const selectedChoice = this.select.dropdown.element.querySelector(
                `.choices__item[data-value="${this.state}"]`,
            )

            if (!selectedChoice) {
                return
            }

            this.select._highlightChoice(selectedChoice)
            window.setTimeout(
                () => selectedChoice.scrollIntoView({ block: 'nearest' }),
                100,
            )
        },

        hasVisibleChoices() {
            return (
                this.select.dropdown.element.querySelector(
                    '.choices__item[data-choice-selectable]',
                ) !== null
            )
        },

        setChoices(choices) {
            this.select.setChoices(choices, 'value', 'label', true)
            this.decoratePinButtons()
        },

        decoratePinButtons() {
            if (!togglePin) {
                return
            }

            this.select.dropdown.element
                .querySelectorAll?.('.choices__item[data-choice-selectable]')
                ?.forEach((item) => {
                    const choice = this.pinnable.get(item.dataset.value)

                    if (!choice) {
                        return
                    }

                    const pinned = choice.pinned === true
                    const doc = item.ownerDocument
                    let button = item.querySelector('[data-pin-toggle]')

                    if (!button) {
                        button = doc.createElement('button')
                        button.type = 'button'
                        button.tabIndex = -1
                        button.className = 'filament-record-switcher__pin'
                        button.setAttribute('data-pin-toggle', '')
                        button.setAttribute('aria-keyshortcuts', 'Alt+P')
                        button.append(this.pinIcon(doc))
                        item.classList.add('has-pin')
                        item.append(button)
                    }

                    button.dataset.recordKey = item.dataset.value
                    button.setAttribute('aria-pressed', String(pinned))
                    button.setAttribute(
                        'aria-label',
                        (pinned ? unpinLabel : pinLabel).replace(
                            ':record',
                            choice.label,
                        ),
                    )
                    button.classList.toggle('is-pinned', pinned)
                })
        },

        pinIcon(doc) {
            const ns = 'http://www.w3.org/2000/svg'
            const svg = doc.createElementNS(ns, 'svg')
            const path = doc.createElementNS(ns, 'path')

            svg.setAttribute('viewBox', '0 0 24 24')
            svg.setAttribute('aria-hidden', 'true')
            svg.setAttribute('focusable', 'false')
            path.setAttribute(
                'd',
                'M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
            )
            svg.append(path)

            return svg
        },

        async togglePinned(key) {
            const choice = this.pinnable.get(key)

            if (!choice || this.destroyed) {
                return
            }

            try {
                const pinned = await togglePin(key)

                this.announce(
                    (pinned ? pinnedMessage : unpinnedMessage).replace(
                        ':record',
                        choice.label,
                    ),
                )
                await this.refreshChoices({ search: this.lastSearch })
            } catch {
                this.showMessage(errorMessage)
            }
        },

        announce(message) {
            if (!this.statusElement) {
                const doc = this.$el.ownerDocument

                this.statusElement = doc.createElement('span')
                this.statusElement.setAttribute('role', 'status')
                this.statusElement.className =
                    'filament-record-switcher__status'
                this.$el.append(this.statusElement)
            }

            this.statusElement.textContent = message
        },

        showMessage(message) {
            this.setChoices([{ label: message, value: '', disabled: true }])
            if (!this.select.dropdown.isActive) {
                this.suppressRefresh = true
                this.select.showDropdown()
            }
        },

        async getChoices({ search }) {
            const results = await getResultsUsing(search)

            this.pinnable = new Map(
                results.map((choice) => [
                    String(choice.recordKey),
                    { label: choice.label, pinned: choice.pinned === true },
                ]),
            )

            const choices = results.map((choice) => ({
                ...choice,
                value: choice.recordKey,
                label: [
                    choice.label,
                    [choice.site, ...(choice.ancestors ?? [])]
                        .filter(Boolean)
                        .join(' › '),
                    choice.path,
                ]
                    .filter(Boolean)
                    .join('\n'),
            }))

            const groups = {}

            choices.forEach((choice) => {
                if (!choice.group) {
                    return
                }

                groups[choice.group] ??= {
                    label: choice.group,
                    id: choice.group,
                    disabled: false,
                    choices: [],
                }
                groups[choice.group].choices.push(choice)
            })

            return Object.keys(groups).length === 0
                ? choices
                : Object.values(groups)
        },

        refreshPlaceholder() {
            this.select._renderItems()

            if (![null, undefined, ''].includes(this.state)) {
                return
            }

            const selectedItems = this.$el.querySelector(
                '.choices__list--single',
            )

            if (selectedItems) {
                selectedItems.textContent = label ?? ''
            }
        },
    }
}
