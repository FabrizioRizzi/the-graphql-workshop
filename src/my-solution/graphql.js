import { loadPets, ownersByPetNames } from './lib/db.js'

const users = [
  { name: 'Alice', locale: 'en' },
  { name: 'Bob', locale: 'fr' }
]
const schema = `
  type Person {
    name: String
  }
  type Pet {
    name: String
    owner: Person
  }
  type User {
    name: String
    locale: String
  }
  type Query {
    pets: [Pet]
    add(x: Int, y: Int): Int
    getUserByLocale(locale: String): User
  }
`

const resolvers = {
  Query: {
    add: (_, { x, y }) => x + y,
    pets: (_, __, context) => loadPets(context.app.pg),
    getUserByLocale: (_, __, { locale }) =>
      users.find(user => user.locale === locale)
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
