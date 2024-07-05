import config from './config/index.js'
import { run } from './app.js'

run(async (app) => {
  app.listen(config.PORT, () => {
    console.log(`app listening at: ${config.PORT}`);
  })
})
