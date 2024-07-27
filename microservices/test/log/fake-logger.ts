import { Logger } from '@/domain/allocation/application/log/logger'

export class FakeLogger implements Logger {
  error(message: unknown, context: string): void {
    console.error(`[${context}] Error: ${message}`)
  }

  warn(message: unknown, context: string): void {
    console.warn(`[${context}] Warn: ${message}`)
  }

  log(message: unknown, context: string): void {
    console.log(`[${context}] Log: ${message}`)
  }

  debug(message: unknown, context: string): void {
    console.debug(`[${context}] Debug: ${message}`)
  }

  verbose(message: unknown, context: string): void {
    console.debug(`[${context}] Verbose: ${message}`)
  }
}
