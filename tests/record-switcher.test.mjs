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

function harness(
    getResultsUsing = async () => [],
    updateSelected = async () => null,
) {
    const timers = new Map()
    const navigation = []
    let timer = 0
    let focused = false
    class Choices {
        constructor(input, config) {
            this.config = config
            this.dropdown = {
                isActive: true,
                element: { querySelector: () => null },
            }
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
        label: 'Switch record',
        state: '',
        optionsLimit: 10,
        hasDynamicSearchResults: true,
        loadingMessage: 'Loading',
        searchingMessage: 'Searching',
        errorMessage: 'Error',
        unavailableMessage: 'Unavailable',
        noSearchResultsMessage: 'No results',
    })
    component.$refs = { input: new EventTarget() }
    component.$el = Object.assign(new EventTarget(), {
        querySelector: () => ({ textContent: '' }),
    })
    component.$wire = { on() {}, off() {} }
    return { component, timers, navigation, focused: () => focused }
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
