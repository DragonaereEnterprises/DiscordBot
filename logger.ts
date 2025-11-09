import pino from 'pino';
const transport = pino.transport({
  targets: [
    { target: 'pino/file', options: { destination: './logs/error.json' }, level: 'error' },
    { target: 'pino/file', options: { destination: './logs/bot.json' }, level: 'info'},
    { target: 'pino-pretty', options: {destination: 1}, level:'info'}
  ],
});
const logger = pino(transport);
export default logger;
