import {useEffect, useState} from "react";
import {getExchangeRate} from "../services/exchangeRate.js";

export function useConvertedAmount(amount, date, fromCurrency, toCurrency) {
    const [convertedAmount, setConvertedAmount] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function convert() {
            setLoading(true)
            const rate = await getExchangeRate(date, fromCurrency, toCurrency)
            if (!cancelled) {
                setConvertedAmount(amount * rate)
                setLoading(false)
            }
        }
        convert()

        return () => {
            cancelled = true
        }
    }, [amount,date, fromCurrency, toCurrency])

    return {convertedAmount,loading}

}