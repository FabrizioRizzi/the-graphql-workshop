import { loadPets, ownersByPetNames } from './lib/db.js'

const schema = `
  type Person {
    name: String
  }
  type Pet {
    name: String
    owner: Person
  }
  type Query {
    pets: [Pet]
    add(x: Int, y: Int): Int
  }
`

const resolvers = {
  Query: {
    add: (_, { x, y }) => x + y,
    pets(_, __, context) {
      return loadPets(context.app.pg)
    }
  }
}

const loaders = {
  Pet: {
    async owner(queries, context) {
      const petNames = queries.map(({ obj }) => obj.name)
      return ownersByPetNames(context.app.pg, petNames)
    }
  }
}

export { schema, resolvers, loaders }
