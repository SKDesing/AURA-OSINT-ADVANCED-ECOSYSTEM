export const InventorySchema = {
  type: 'object',
  required: ['summary', 'packages'],
  properties: {
    summary: {
      type: 'object',
      required: ['totalPackages', 'errorsCount'],
      properties: {
        totalPackages: { type: 'number' },
        errorsCount: { type: 'number' },
        dashboardsCount: { type: 'number' },
        largeComponentsCount: { type: 'number' },
        duplicationsCount: { type: 'number' }
      }
    },
    packages: { type: 'array' }
  },
  additionalProperties: true
};