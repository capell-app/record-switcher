import Choices from 'choices.js'

export default function selectChangerComponent({
    getResultsUsing,
    hasDynamicSearchResults,
    label,
    loadingMessage,
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

        async init() {
            this.select = new Choices(this.$refs.input, {
                allowHTML: true,
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
                await this.refreshChoices()
            }
            this._handlers.change = async () => {
                this.refreshPlaceholder()

                const selectedValue = this.select.getValue(true) ?? null

                this.setChoices([{ label, value: state, selected: true }])

                await updateSelected(selectedValue)
            }
            this._handlers.search = async () => {
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
                    event.key === 'Tab' &&
                    this.select?.dropdown?.isActive &&
                    this.acceptHighlightedChoice()
                ) {
                    event.preventDefault()
                    event.stopPropagation()
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

            this._handlers.wireRefresh = (event) => {
                this.select.clearChoices()
                this.select.setChoices([
                    { label: event.label, value: state, selected: true },
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
            let choices
            const request = ++this.searchRequest

            this.scheduleLoadingChoice(options.search)

            try {
                choices = await this.getChoices(options)
            } catch {
                choices = []
            }

            if (request !== this.searchRequest) {
                return
            }

            window.clearTimeout(this._loadingTimer)
            this.refreshPlaceholder()
            this.setChoices(choices)
            this.highlightSelectedChoice()
        },

        scheduleLoadingChoice(search) {
            window.clearTimeout(this._loadingTimer)
            this._loadingTimer = window.setTimeout(() => {
                if (this.hasVisibleChoices()) {
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

        acceptHighlightedChoice() {
            const highlightedChoice =
                this.select.dropdown.element.querySelector(
                    '.choices__item.is-highlighted[data-choice-selectable], .choices__item[data-choice-selectable]',
                )

            if (!highlightedChoice?.dataset?.value) {
                return false
            }

            this.select.setChoiceByValue(highlightedChoice.dataset.value)
            this.select.hideDropdown()
            this.$refs.input.dispatchEvent(
                new Event('change', { bubbles: true }),
            )

            return true
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

        async getChoices({ search }) {
            let choices

            try {
                choices = await getResultsUsing(search)
            } catch {
                choices = []
            }

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
                selectedItems.innerHTML = `<div class="choices__placeholder choices__item">${placeholder ?? ''}</div>`
            }
        },
    }
}
