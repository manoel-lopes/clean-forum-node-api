export default {
  '*.ts': [
    'pnpm run lint',
    () => 'pnpm run check-types',
    'pnpm run test:staged',
  ]
}