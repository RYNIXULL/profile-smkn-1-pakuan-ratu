import { app } from './app';
import { config } from './config';
import { checkDatabaseConnection } from './config/database';

async function bootstrap() {
  console.log(`🚀 Menginisialisasi server SMKN 1 Pakuan Ratu (${config.env})...`);

  // Verify database connectivity
  await checkDatabaseConnection();

  const server = app.listen(config.port, () => {
    console.log(`📡 Backend API berjalan di: http://localhost:${config.port}`);
    console.log(`📂 Folder penyimpanan media: ${config.upload.uploadDir}`);
  });

  const gracefulShutdown = () => {
    console.log('Menutup server dengan aman (Graceful Shutdown)...');
    server.close(() => {
      console.log('Server HTTP ditutup.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

bootstrap().catch((err) => {
  console.error('Fatal error saat bootstrap server:', err);
  process.exit(1);
});
