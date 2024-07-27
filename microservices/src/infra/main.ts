import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { SocketIoClientProvider } from './socket/socket.provider'
import { SocketIoClientStrategy } from './socket/socket.strategy'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  const socketIoClientProvider = app.get<SocketIoClientProvider>(
    SocketIoClientProvider,
  )

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new SocketIoClientStrategy(socketIoClientProvider.getSocket()),
  })

  await app.startAllMicroservices()
  await app.listen(port)
}
bootstrap()
