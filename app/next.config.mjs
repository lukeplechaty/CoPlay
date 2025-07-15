/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://zqisdwtldxkvgkhmcvus.supabase.co/storage/v1/object/public/Videos/*"
      ),
    ],
  },
};

export default nextConfig;
