import { build } from 'esbuild'
import { readFile, writeFile } from 'node:fs/promises'
import { format, resolveConfig } from 'prettier'

const distributionPath = new URL(
    'resources/dist/record-switcher.js',
    import.meta.url,
)
const checkOnly = process.argv.includes('--check')
const result = await build({
    banner: {
        js: '// Generated from resources/js/record-switcher.js. Run npm run build.',
    },
    bundle: true,
    entryPoints: ['resources/js/record-switcher.js'],
    format: 'esm',
    legalComments: 'inline',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    platform: 'browser',
    target: ['es2022'],
    write: false,
})
const prettierConfig = (await resolveConfig(distributionPath.pathname)) ?? {}
const generatedAsset = await format(result.outputFiles[0].text, {
    ...prettierConfig,
    parser: 'babel',
    plugins: [],
})

if (checkOnly) {
    const committedAsset = await readFile(distributionPath, 'utf8')

    if (generatedAsset !== committedAsset) {
        throw new Error(
            'Record Switcher distribution asset is stale. Run npm run build and commit resources/dist/record-switcher.js.',
        )
    }
} else {
    await writeFile(distributionPath, generatedAsset)
}
