import levels from './levels.json'

export const readLevel = (index) =>{
    return levels.levels[index]
}

export const totalLevels = levels.levels.length

export const levelData = levels.levels
