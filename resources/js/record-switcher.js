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
    placeholder,
    searchPrompt,
    searchingMessage,
    state,
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
                placeholderValue: placeholder,
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
                if (event.key === 'Escape' && this.select?.dropdown?.isActive) {
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
                selectedItems.textContent = label ?? placeholder ?? ''
            }
        },
    }
}
