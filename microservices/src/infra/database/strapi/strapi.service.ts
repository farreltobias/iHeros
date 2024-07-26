import { Injectable } from '@nestjs/common'

import { EnvService } from '@/infra/env/env.service'

@Injectable()
export class StrapiService {
  private BASE_URL: string

  constructor(private envService: EnvService) {
    this.BASE_URL = this.envService.get('STRAPI_URL')
  }

  async fetch<T>(url: string, options?: RequestInit): Promise<T | null> {
    const formattedUrl = url.startsWith('/') ? url : `/${url}`
    const response = (await fetch(`${this.BASE_URL}${formattedUrl}`, options)
      .then((res) => res.json())
      .catch(() => null)) as T | null

    if (!response) return null

    return response
  }
}
