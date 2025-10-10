const sharp = () => ({
  resize: () => sharp(),
  toBuffer: async () => Buffer.from([]),
  toFile: async () => ({}),
});

export default Object.assign(sharp, {
  metadata: async () => ({}),
  constructor: () => sharp(),
});