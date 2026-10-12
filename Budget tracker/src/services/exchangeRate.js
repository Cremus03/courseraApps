import {db} from "../db/db.js";

export async function getExchangeRate(date, from, to) {

    if (from === to)
        return 1

    const rateId = `${date}_${from}_${to}`
    const cached = await db.Rates.get(rateId)
    if (cached) return cached.Rate

    const response = await fetch(`https://api.frankfurter.dev/v1/${date}?from=${from}&to=${to}`)
    const data = await response.json()
    const rate = data.rates[to]

    await db.Rates.put({RateId: rateId, Date: date, Rate: rate})

    return rate

}
