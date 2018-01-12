import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: []
})

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console())
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.simple(),
      winston.format.timestamp()
    )
  }))
}

export default logger
