/**
 * hero controller
 */

import { factories } from '@strapi/strapi'

import { findManyNearby } from './find-many-nearby'

export default factories.createCoreController(
  'api::hero.hero',
  ({ strapi }) => ({
    findManyNearby: (ctx) => findManyNearby(ctx, strapi),
  }),
)
