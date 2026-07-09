/**
 * SearchService — DB-backed route search.
 *
 * Talks to the public search API, which reads the admin-managed live inventory
 * (train + bus records) straight from the database. Anything the operator
 * adds/edits/hides in the admin panel is reflected here instantly — no code
 * changes or redeploys needed.
 */
import env from '@config/env'
import { CityService } from './CityService'

const API_URL = env.api.baseUrl || 'http://localhost:3001'

async function apiGet(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), env.api.timeoutMs)
  try {
    const res = await fetch(`${API_URL}${path}`, { signal: controller.signal })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, data }
  } catch {
    return { ok: false, data: null }
  } finally {
    clearTimeout(timeout)
  }
}

class SearchServiceImpl {
  /**
   * Search for travel options.
   * @param {{ from: string, to: string, date: string }} params — city names
   * @returns {Promise<{ trains: Array, buses: Array, from: object, to: object } | null>}
   */
  async search({ from, to }) {
    const fromCity = CityService.getByName(from)
    const toCity = CityService.getByName(to)
    if (!fromCity || !toCity) return null

    const qs = new URLSearchParams({ from: fromCity.id, to: toCity.id }).toString()
    const { ok, data } = await apiGet(`/api/search?${qs}`)
    if (!ok || !data?.success) return null

    const trains = Array.isArray(data.trains) ? data.trains : []
    const buses = Array.isArray(data.buses) ? data.buses : []
    if (trains.length === 0 && buses.length === 0) return null

    return { trains, buses, from: fromCity, to: toCity }
  }

  /**
   * Get available routes for suggestions / empty states.
   * @returns {Promise<Array<{ from: string, to: string, label: string }>>}
   */
  async getAvailableRoutes() {
    const { ok, data } = await apiGet('/api/search/routes')
    if (!ok || !data?.success || !Array.isArray(data.routes)) return []
    return data.routes
      .map(({ from, to }) => {
        const fromCity = CityService.getById(from)
        const toCity = CityService.getById(to)
        if (!fromCity || !toCity) return null
        return { from: fromCity.name, to: toCity.name, label: `${fromCity.name} → ${toCity.name}` }
      })
      .filter(Boolean)
  }
}

export const SearchService = new SearchServiceImpl()
export default SearchService
