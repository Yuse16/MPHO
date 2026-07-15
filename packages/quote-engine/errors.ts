import type { QuoteErrorCode, QuoteResult } from './types'

export function quoteFailure<T>(code: QuoteErrorCode, message: string): QuoteResult<T> {
  return { ok: false, error: { code, message } }
}
