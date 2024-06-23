import wiston, { Logger } from 'winston';

import {
  ElasticsearchTransformer,
  ElasticsearchTransport,
  LogData,
  TransformedData,
} from 'winston-elasticsearch';

const esTransformer = (logData: LogData): TransformedData => {
  return ElasticsearchTransformer(logData);
};

export const winstonLogger = (
  elesticsearchNode: string,
  name: string,
  level: string
): Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true,
    },
    elesticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elesticsearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 1000,
        sniffOnStart: false,
      },
    },
  };

  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(
    options.elesticsearch
  );
  const logger: Logger = wiston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new wiston.transports.Console(options.console), esTransport],
  });

  return logger;
};
