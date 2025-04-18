/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "unsafe-none",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  images: {
    domains: ["firebasestorage.googleapis.com", "cyclingcoachai.com"],
  },
  webpack: (config) => {
    // Handle binary modules by marking them as external
    config.externals = [
      ...(config.externals || []),
      // Add all problematic modules as externals
      "onnxruntime-node",
      "@xenova/transformers",
    ];

    // Prevent webpack from attempting to bundle native modules
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node": false,
    };

    return config;
  },
  // Ensure API routes are treated as serverless functions
  experimental: {
    serverComponentsExternalPackages: [
      "chromadb",
      "@xenova/transformers",
      "onnxruntime-node",
    ],
  },
};

module.exports = nextConfig;
