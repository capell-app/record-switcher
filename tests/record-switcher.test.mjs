import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'

const source = readFileSync(
    new URL('../resources/js/record-switcher.js', import.meta.url),
    'utf8',
)
    .replace("import Choices from 'choices.js'", '')
    .replace('export default function', 'function')

class FakeElement extends EventTarget {
    constructor(doc, tag = 'div') {
        super()
        this.ownerDocument = doc
        this.tag = tag
        this.children = []
        this.dataset = {}
        this.attributes = {}
        this.classes = new Set()
        this.classList = {
            add: (name) => this.classes.add(name),
            toggle: (name, on) =>
                on ? this.classes.add(name) : this.classes.delete(name),
        }
    }
    append(child) {
        this.children.push(child)
    }
    remove() {
        this.removed = true
    }
    setAttribute(name, value) {
        this.attributes[name] = value
        if (name.startsWith('data-')) this.dataset[name.slice(5)] = value
    }
    querySelector(selector) {
        return this.children.find((child) => child.matches(selector)) ?? null
    }
    matches(selector) {
        return selector === '[data-pin-toggle]' && 'pin-toggle' in this.dataset
    }
    closest(selector) {
        return this.matches(selector) ? this : null
    }
}

const fakeDocument = {
    createElement: (tag) => new FakeElement(fakeDocument, tag),
    createElementNS: (ns, tag) => new FakeElement(fakeDocument, tag),
}

function harness(
    getResultsUsing = async () => [],
    updateSelected = async () => null,
    togglePin = undefined,
) {
    const timers = new Map()
    const navigation = []
    let timer = 0
    let focused = false
    class Choices {
        constructor(input, config) {
            this.config = config
            this.items = []
            const element = new FakeElement(fakeDocument)
            element.querySelector = (selector) =>
                selector === '.choices__item.is-highlighted'
                    ? (this.items[0] ?? null)
                    : null
            element.querySelectorAll = () => this.items
            this.dropdown = { isActive: true, element }
            this.containerOuter = {
                element: {
                    focus: () => {
                        focused = true
                    },
                },
            }
            this.rows = []
        }
        setChoices(rows) {
            this.rows = rows
            this.items = rows
                .flatMap((row) => row.choices ?? [row])
                .filter((row) => row.value && !row.disabled)
                .map((row) => {
                    const item = new FakeElement(fakeDocument)
                    item.dataset.value = row.value
                    return item
                })
        }
        clearChoices() {
            this.rows = []
        }
        _renderItems() {}
        getValue() {
            return this.value
        }
        hideDropdown() {
            this.dropdown.isActive = false
        }
        showDropdown() {
            this.dropdown.isActive = true
        }
        destroy() {
            this.destroyed = true
        }
    }
    const window = {
        setTimeout: (callback) => {
            timers.set(++timer, callback)
            return timer
        },
        clearTimeout: (id) => timers.delete(id),
        location: {
            href: 'https://admin.test/pages/1/edit',
            origin: 'https://admin.test',
            assign: (url) => navigation.push(url),
        },
    }
    const factory = vm.runInNewContext(`${source}; selectChangerComponent`, {
        Choices,
        window,
        URL,
        Event,
    })
    const component = factory({
        getResultsUsing,
        updateSelected,
        togglePin,
        pinLabel: 'Pin :record',
        unpinLabel: 'Unpin :record',
        pinnedMessage: ':record pinned.',
        unpinnedMessage: ':record unpinned.',
        label: 'Switch record',
        state: '',
        optionsLimit: 10,
        hasDynamicSearchResults: true,
        loadingMessage: 'Loading',
        searchingMessage: 'Searching',
        errorMessage: 'Error',
        unavailableMessage: 'Unavailable',
        noSearchResultsMessage: 'No results',
        placeholder: 'Select an option',
    })
    component.$refs = { input: new EventTarget() }
    component.$el = Object.assign(new FakeElement(fakeDocument), {
        querySelector: () => ({ textContent: '' }),
    })
    const wire = new EventTarget()
    component.$wire = {
        on: (event, listener) => wire.addEventListener(event, listener),
        off: (event, listener) => wire.removeEventListener(event, listener),
    }
    return { component, timers, navigation, wire, focused: () => focused }
}

const option = (label, group) => ({
    label,
    group,
    recordKey: '2',
    site: 'Main',
    ancestors: ['Support'],
    path: '/help',
})

test('context remains plain text and dynamic server results are not filtered by Choices', async () => {
    const { component } = harness(async () => [
        option('<img src=x onerror=alert(1)>', 'Related'),
    ])
    await component.init()
    await component.refreshChoices()
    assert.equal(component.select.config.allowHTML, false)
    assert.equal(component.select.config.searchChoices, false)
    assert.equal(component.select.rows[0].label, 'Related')
    assert.equal(
        component.select.rows[0].choices[0].label,
        '<img src=x onerror=alert(1)>\nMain › Support\n/help',
    )
})

test('empty and failed requests show different disabled messages', async () => {
    for (const [fetch, expected] of [
        [async () => [], 'No results'],
        [
            async () => {
                throw Error('offline')
            },
            'Error',
        ],
    ]) {
        const { component } = harness(fetch)
        await component.init()
        await component.refreshChoices()
        assert.equal(component.select.rows[0].label, expected)
        assert.equal(component.select.rows[0].disabled, true)
    }
})

test('pending request displays loading then clears its timer on completion', async () => {
    let resolve
    const { component, timers } = harness(
        () =>
            new Promise((done) => {
                resolve = done
            }),
    )
    await component.init()
    const pending = component.refreshChoices()
    for (const callback of timers.values()) callback()
    assert.equal(component.select.rows[0].label, 'Loading')
    resolve([])
    await pending
    assert.equal(timers.size, 0)
    assert.equal(component.select.rows[0].label, 'No results')
})

test('late requests cannot replace newer results', async () => {
    const resolvers = []
    const { component } = harness(
        () => new Promise((done) => resolvers.push(done)),
    )
    await component.init()
    const first = component.refreshChoices({ search: 'old' })
    const second = component.refreshChoices({ search: 'new' })
    resolvers[1]([option('New')])
    await second
    resolvers[0]([option('Old')])
    await first
    assert.match(component.select.rows[0].label, /^New/)
})

test('typing invalidates in-flight responses before debounce completes', async () => {
    let resolve
    const { component } = harness(
        () =>
            new Promise((done) => {
                resolve = done
            }),
    )
    await component.init()
    const pending = component.refreshChoices()
    await component._handlers.search()
    resolve([option('Old')])
    await pending
    assert.equal(component.select.rows.length, 0)
})

test('destroyed components ignore late responses and cancel loading', async () => {
    let resolve
    const { component, timers } = harness(
        () =>
            new Promise((done) => {
                resolve = done
            }),
    )
    await component.init()
    const pending = component.refreshChoices()
    component.destroy()
    resolve([])
    await pending
    assert.equal(component.select, null)
    assert.equal(timers.size, 0)
})

test('Tab leaves the control without navigation; Escape restores trigger focus', async () => {
    const { component, navigation, focused } = harness()
    await component.init()
    component._handlers.keydown({
        key: 'Tab',
        preventDefault: () => assert.fail('Tab trapped'),
    })
    assert.equal(component.select.dropdown.isActive, false)
    assert.equal(navigation.length, 0)
    component.select.dropdown.isActive = true
    component._handlers.keydown({
        key: 'Escape',
        preventDefault() {},
        stopPropagation() {},
    })
    assert.equal(focused(), true)
})

test('selection revalidates the record and rejects missing, foreign and unsafe URLs', async () => {
    for (const destination of [
        null,
        'https://foreign.test/edit',
        'javascript:alert(1)',
        '/pages/2/edit',
    ]) {
        let selected
        const { component, navigation } = harness(undefined, async (key) => {
            selected = key
            return destination
        })
        await component.init()
        component.select.value = '2'
        await component._handlers.change()
        assert.equal(selected, '2')
        assert.equal(navigation.length, destination === '/pages/2/edit' ? 1 : 0)
        if (!navigation.length)
            assert.equal(component.select.rows[0].label, 'Unavailable')
    }
})

test('refresh events reset visible choices and are detached during teardown', async () => {
    const { component, wire } = harness(async () => [
        option('Customer page', 'Related'),
    ])
    await component.init()
    await component.refreshChoices()
    assert.equal(component.select.rows[0].label, 'Related')
    wire.dispatchEvent(new Event('record-switcher:refresh'))
    assert.equal(component.select.rows.length, 1)
    assert.equal(component.select.rows[0].label, 'Switch record')
    assert.equal(component.select.rows[0].value, '')
    assert.equal(component.select.rows[0].selected, true)
    component.destroy()
    wire.dispatchEvent(new Event('record-switcher:refresh'))
})

test('the closed control reads the switch label, not a generic select placeholder', async () => {
    const { component } = harness()
    const closedText = { textContent: '' }
    component.$el.querySelector = () => closedText
    await component.init()
    assert.equal(component.select.config.placeholderValue, 'Switch record')
    assert.equal(closedText.textContent, 'Switch record')
})

test('each row gets a labelled pin button that toggles without choosing the record', async () => {
    // Bug caught: with no pin control in the menu, pins could only be set from code, and a click on it would have navigated away.
    const calls = []
    let pinned = false
    const { component, navigation } = harness(
        async () => [{ ...option('Alpha', 'Related'), pinned }],
        async () => '/records/2/edit',
        async (key) => {
            calls.push(key)
            pinned = !pinned
            return pinned
        },
    )
    await component.init()
    await component.refreshChoices()

    const button = component.select.items[0].querySelector('[data-pin-toggle]')
    assert.equal(button.attributes['aria-label'], 'Pin Alpha')
    assert.equal(button.attributes['aria-pressed'], 'false')

    let prevented = false
    let stopped = false
    const click = Object.assign(new Event('click'), {
        preventDefault: () => (prevented = true),
        stopPropagation: () => (stopped = true),
    })
    Object.defineProperty(click, 'target', { value: button })
    component._handlers.pinPointer(click)
    await new Promise((resolve) => setImmediate(resolve))

    assert.deepEqual(calls, ['2'])
    assert.ok(prevented && stopped)
    assert.deepEqual(navigation, [])
    assert.equal(
        component.select.items[0].querySelector('[data-pin-toggle]').attributes[
            'aria-pressed'
        ],
        'true',
    )
    assert.equal(
        component.select.items[0].querySelector('[data-pin-toggle]').attributes[
            'aria-label'
        ],
        'Unpin Alpha',
    )
    assert.equal(component.statusElement.textContent, 'Alpha pinned.')
})

test('Alt+P pins the highlighted record from the search box', async () => {
    // Bug caught: the pin button is not in the tab order, so keyboard users had no way to pin.
    const calls = []
    const { component } = harness(
        async () => [option('Alpha', 'Related')],
        async () => null,
        async (key) => {
            calls.push(key)
            return true
        },
    )
    await component.init()
    await component.refreshChoices()
    let prevented = false
    component._handlers.keydown({
        altKey: true,
        code: 'KeyP',
        key: 'π',
        preventDefault: () => (prevented = true),
    })
    await new Promise((resolve) => setImmediate(resolve))

    assert.deepEqual(calls, ['2'])
    assert.ok(prevented)
})

test('no pin buttons render when pinning is not wired', async () => {
    const { component } = harness(async () => [option('Alpha', 'Related')])
    await component.init()
    await component.refreshChoices()

    assert.equal(
        component.select.items[0].querySelector('[data-pin-toggle]'),
        null,
    )
})
