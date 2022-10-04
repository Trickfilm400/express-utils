import { Schema } from 'convict';

export interface IrabbitMQConfig {
  ip: string;
  port: string;
}

export const rabbitMQConfig: Schema<IrabbitMQConfig> = {
  ip: {
    doc: 'The IP address rabbitmq should connect to',
    format: String,
    default: '127.0.0.1',
    env: 'RABBIT_IP',
  },
  port: {
    doc: 'The Port rabbitmq should connect to',
    format: 'port',
    default: '5672',
    env: 'RABBIT_PORT',
  },
};
