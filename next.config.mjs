/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:"https",
                hostname:'*.googleusercontent.com',

            },
        ],
        domains: ['res.cloudinary.com']
    }
};

export default nextConfig;
