import './test.js'

process.on('SIGINT', (signal) => {
  console.warn( "shutting down from SIGINT" );
  console.log({signal})
  process.exit(0);
});