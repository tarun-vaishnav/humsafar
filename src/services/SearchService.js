/**
 * SearchService — abstracts route search.
 * Replace internals with API calls when ready:
 *   const res = await fetch(`/api/search?from=${fromId}&to=${toId}&date=${date}`)
 */
import { trainData } from '@data/trainData'
import { busData } from '@data/busData'
import { CityService } from './CityService'

class SearchServiceImpl {
  /**
   * Search for travel options.
   * @param {{ from: string, to: string, date: string }} params — city names
   * @returns {Promise<{ trains: Array, buses: Array, from: object, to: object } | null>}
   */
  async search({ from, to, date }) {
    const fromCity = CityService.getByName(from)
    const toCity = CityService.getByName(to)
    if (!fromCity || !toCity) return null

    const key = `${fromCity.id}-${toCity.id}`
    const reverseKey = `${toCity.id}-${fromCity.id}`

    const trains = trainData[key] || trainData[reverseKey] || []
    const buses = busData[key] || busData[reverseKey] || []

    if (trains.length === 0 && buses.length === 0) return null

    // Simulate network latency for cinematic loading
    await new Promise((resolve) => setTimeout(resolve, 1800 + Math.random() * 800))

    return { trains, buses, from: fromCity, to: toCity }
  }

  /**
   * Get available routes for suggestions / empty states.
   * @returns {Array<{ from: string, to: string, label: string }>}
   */
  getAvailableRoutes() {
    const routeKeys = new Set([...Object.keys(trainData), ...Object.keys(busData)])
    return [...routeKeys].map((key) => {
      const [fromId, toId] = key.split('-')
      const fromCity = CityService.getById(fromId)
      const toCity = CityService.getById(toId)
      if (!fromCity || !toCity) return null
      return { from: fromCity.name, to: toCity.name, label: `${fromCity.name} → ${toCity.name}` }
    }).filter(Boolean)
  }
}

export const SearchService = new SearchServiceImpl()
export default SearchService
