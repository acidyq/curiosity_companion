import { ModuleDefinition } from './types'
import { alienEncounterModule } from './alien-encounter/alien-encounter.module'
import { tapAnAnimalModule } from './tap-an-animal/tap-an-animal.module'
import { curiousCalculationsModule } from './curious-calculations/curious-calculations.module'

export const moduleRegistry: Record<string, ModuleDefinition> = {
  'alien-encounter': alienEncounterModule,
  'tap-an-animal': tapAnAnimalModule,
  'curious-calculations': curiousCalculationsModule,
}

export const getAllModules = (): ModuleDefinition[] => {
  return Object.values(moduleRegistry)
}

export const getModule = (slug: string): ModuleDefinition | undefined => {
  return moduleRegistry[slug]
}
