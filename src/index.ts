// tslint:disable-next-line: no-submodule-imports
import 'module-alias/register'

import { argv } from 'yargs'

import modules from '@modules'
import Core from '@services/core'
import { validateFileInput } from '@libs/utils'

const core = new Core()

core.register(modules)

if (!argv.config) {
  // tslint:disable-next-line: no-console
  console.warn('**** Please define a --config=config_file_path, please see in input.example.json ****')
  process.exit(1)
}

const config = validateFileInput(argv.config as string)
core.start(config).then(() => {
  process.exit()
})

