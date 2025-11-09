import pino from 'pino';
const transport = pino.transport({
  targets: [
    { target: 'pino-pretty', options: {destination: 1}, level:'info'}
  ],
});
const logger = pino(transport);
export default logger;
