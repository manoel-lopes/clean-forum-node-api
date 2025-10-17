export default {
  '*.ts': [
    'pnpm run format',
    'pnpm run lint',
    () => 'pnpm run check-types'
  ]
}