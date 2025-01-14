import fse from 'fs-extra'
import * as sass from 'sass-embedded'
import postcss from 'postcss'
import { extractICSS } from 'icss-utils'

export default ({
  scssFilePath = './src/scss/variables/exports.module.scss',
  outputFilePath = './src/scss/variables/_auto-generated-color-palettes.scss',
  amount = 20,
  colorVariablePrefix = 'color-palette',
  showLogs = false,
} = {}) => {
  async function generateScssColorPalettes() {
    if (!fse.existsSync(scssFilePath)) {
      console.warn(`SCSS file not found at ${scssFilePath}`)
      return
    }

    if (showLogs) {
      console.log('Generating SCSS color palette...')
    }

    const styles = sass.compile(scssFilePath)
    const icssExports = extractICSS(postcss.parse(styles.css)).icssExports

    const formatScssVariable = (scssVariables, prefix, formatValueFunction) => {
      return Object.keys(scssVariables).reduce((prev, curr) => {
        if (!curr.includes(prefix)) return prev

        prev[curr.replace(`${prefix}-`, '')] = formatValueFunction(scssVariables[curr])
        return prev
      }, {})
    }

    const colors = formatScssVariable(icssExports, colorVariablePrefix, (value) => value)

    const palettes = Object.keys(colors)
      .map((colorName) => {
        const colorValue = colors[colorName]

        let scssString = ''

        const stepSize = 1000 / amount

        for (let i = 1; i < amount; i++) {
          const currentStep = i * stepSize
          const percentage = Math.floor((currentStep / 500) * 100)

          let cssValue = ''

          switch (true) {
            case currentStep < 500:
              cssValue = `color-mix(in srgb, ${colorValue} ${percentage}%, white);`
              break

            case currentStep > 500:
              cssValue = `color-mix(in srgb, ${colorValue}, black ${percentage - 100}%);`
              break

            default:
              cssValue = `${colorValue};`
              break
          }

          scssString += `$${colorName}-${currentStep}: ${cssValue}\n`
        }

        return scssString
      })
      .join('\n')

    const warning =
      '// This file is generated using the vite-plugin-scss-color-palettes.\n// Do not edit this file directly, changes will be overwritten.\n\n'

    fse.outputFile(
      outputFilePath,
      warning + palettes,
      {
        encoding: 'utf-8'
      },
      (err) => {
        if (err) {
          console.error(err)
          return
        }

        if (showLogs) {
          console.log('SCSS color palette generated successfully!')
        }
      }
    )
  }
  return {
    name: 'generate-scss-color-palette',
    buildStart() {
      generateScssColorPalettes()
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith(scssFilePath.split('/').pop())) {
        generateScssColorPalettes()
        server.ws.send({
          type: 'full-reload',
          path: '*'
        })
      }
    }
  }
}
