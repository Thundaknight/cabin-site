const nextConfig = {
  // For production, configure your hosting provider to use HTTPS
  // Most platforms like Vercel handle this automatically
  
  // For local development, you can use a self-signed certificate
  // See: https://nextjs.org/docs/pages/building-your-application/configuring/https
  
  // Example for local HTTPS (uncomment to use):
  // async serverOptions() {
  //   if (process.env.NODE_ENV === 'development') {
  //     const { createSecureServer } = await import('http2');
  //     const { readFileSync } = await import('fs');
  //     const { join } = await import('path');
  //     
  //     const certsDir = join(process.cwd(), 'certs');
  //     
  //     return {
  //       createServer: createSecureServer,
  //       key: readFileSync(join(certsDir, 'localhost-key.pem')),
  //       cert: readFileSync(join(certsDir, 'localhost.pem')),
  //     };
  //   }
  //   
  //   return {};
  // },
};

export default nextConfig;

