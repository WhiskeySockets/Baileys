import P from 'pino';
export default P({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
//# sourceMappingURL=logger.js.map