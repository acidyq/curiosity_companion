import { ModuleDefinition } from './types'
import { fourColorModule } from './four-color-theorem/four-color.module'
import { knightsTourModule } from './knights-tour/knights-tour.module'
import { mobiusModule } from './mobius-band/mobius.module'

export const moduleRegistry: Record<string, ModuleDefinition> = {
  'four-color-theorem': fourColorModule,
  'knights-tour': knightsTourModule,
  'mobius-band': mobiusModule,
}

export const getAllModules = (): ModuleDefinition[] => {
  return Object.values(moduleRegistry)
}

export const getModule = (slug: string): ModuleDefinition | undefined => {
  return moduleRegistry[slug]
}
