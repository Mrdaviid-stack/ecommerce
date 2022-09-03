import morgan from 'morgan'
import chalk from 'chalk'

export const logger = morgan((tokens, request, response) => {
  return [
    chalk.yellowBright(`[${tokens.date(request, response, 'web')}]`),
    chalk.cyanBright(tokens.method(request, response)),
    chalk.yellow(tokens.status(request, response)),
    chalk.white(tokens.url(request, response)),
    `(${chalk.greenBright(tokens['response-time'](request, response) + ' ms')})`,
    `Remote IP: ${chalk.blueBright(tokens['remote-addr'](request, response))}`,
    `| User-agent: ${chalk.blueBright(tokens['user-agent'](request, response))}`,
  ].join(' ')
})