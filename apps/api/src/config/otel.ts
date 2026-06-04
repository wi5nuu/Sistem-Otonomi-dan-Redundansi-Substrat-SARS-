import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { env } from './env.js';

let sdk: NodeSDK | null = null;

export function initTelemetry(): void {
  if (!env.OTEL_ENDPOINT) {
    return;
  }

  const traceExporter = new OTLPTraceExporter({
    url: `${env.OTEL_ENDPOINT}/v1/traces`,
  });

  sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
      new HttpInstrumentation(),
      new FastifyInstrumentation(),
    ],
    serviceName: 'sars-api',
  });

  sdk.start();

  process.on('SIGTERM', () => {
    sdk?.shutdown()
      .then(() => console.log('OpenTelemetry SDK shut down'))
      .catch((err) => console.error('Error shutting down OpenTelemetry SDK', err))
      .finally(() => process.exit(0));
  });
}
