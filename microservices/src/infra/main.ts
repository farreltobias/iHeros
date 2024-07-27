import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { SocketClientProvider } from './socket/client/socket-client.provider'
import { SocketClientStrategy } from './socket/client/socket-client.strategy'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  const socketIoClientProvider =
    app.get<SocketClientProvider>(SocketClientProvider)

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new SocketClientStrategy(socketIoClientProvider.getSocket()),
  })

  await app.startAllMicroservices()
  await app.listen(port)
}
bootstrap()
