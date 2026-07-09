/**
 * CityService — abstracts city data access.
 * Replace internals with API calls when ready.
 */
import { cities } from '@data/cities'

class CityServiceImpl {
  /**
   * Search cities by query string. Matches name, state, and aliases.
   * @param {string} query
   * @param {number} limit
   * @returns {Array<{id: string, name: string, state: string}>}
   */
  search(query, limit = 8) {
    if (!query || query.trim().length === 0) return cities.slice(0, limit)
    const q = query.trim().toLowerCase()
    return cities
      .filter((city) => {
        if (city.name.toLowerCase().startsWith(q)) return true
        if (city.state.toLowerCase().startsWith(q)) return true
        if (city.id.toLowerCase() === q) return true
        return city.aliases.some((a) => a.toLowerCase().startsWith(q))
      })
      .slice(0, limit)
  }

  /**
   * Get city by ID.
   * @param {string} id
   * @returns {{id: string, name: string, state: string} | null}
   */
  getById(id) {
    return cities.find((c) => c.id === id) || null
  }

  /**
   * Get city by name (case-insensitive).
   * @param {string} name
   * @returns {{id: string, name: string, state: string} | null}
   */
  getByName(name) {
    const q = name.trim().toLowerCase()
    return cities.find((c) => c.name.toLowerCase() === q) || null
  }

  /**
   * Get all cities.
   * @returns {Array}
   */
  getAll() {
    return cities
  }
}

export const CityService = new CityServiceImpl()
export default CityService
