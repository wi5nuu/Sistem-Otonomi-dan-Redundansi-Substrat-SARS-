import { EventEmitter2 } from 'eventemitter2';

export const eventBus = new EventEmitter2({
  wildcard: true,
  delimiter: '.',
  maxListeners: 100,
  verboseMemoryLeak: true,
});

export function setupEventBus(): void {
  // Redis Pub/Sub integration stub
  // Will be connected when Redis is available
  eventBus.on('**', (event, payload) => {
    // Log all events for audit
    if (process.env.NODE_ENV === 'development') {
      // Silent in dev
    }
  });
}
