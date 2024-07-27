export abstract class Logger {
  abstract error(message: unknown, context: string): void
  abstract warn(message: unknown, context: string): void
  abstract log(message: unknown, context: string): void
  abstract debug(message: unknown, context: string): void
  abstract verbose(message: unknown, context: string): void
}
