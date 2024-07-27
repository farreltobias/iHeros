export default {
  routes: [
    {
      method: 'GET',
      path: '/heroes/nearby',
      handler: 'hero.findManyNearby',
      config: {
        auth: false,
      },
    },
  ],
}
