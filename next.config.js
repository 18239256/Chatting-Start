/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
      swcPlugins: [["next-superjson-plugin", {}]]
    },
    images: {
      domains: [
        'res.cloudinary.com', 
        'avatars.githubusercontent.com',
        'lh3.googleusercontent.com'
      ],
      remotePatterns:[
        {
          protocol:'https',
          hostname:'res.cloudinary.com',
          port:'',
          pathname:'/db372ijc2/**',
        }
      ]
    }
  }
  
  module.exports = nextConfig