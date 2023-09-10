const config = require('./config/index');
const { run } = require('./app')

run(async (app) => {
  app.listen(config.PORT, () => {
    console.log(`app listening at: ${config.PORT}`);
  })
})
