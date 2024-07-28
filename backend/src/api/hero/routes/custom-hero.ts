export default {
  routes: [
    {
      method: 'GET',
      path: '/heroes/nearby',
      handler: 'hero.findManyNearby',
    },
  ],
}
