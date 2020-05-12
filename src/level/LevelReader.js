import levels from './levels.json'

export const readLevel = (index) =>{
    return levels.levels[index]
}

export default readLevel