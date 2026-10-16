/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@atlaskit/atlassian-navigation",
    "@atlaskit/side-navigation",
    "@atlaskit/page-layout",
    "@atlaskit/flag",
    "@atlaskit/select",
    "@atlaskit/tooltip",
    "@atlaskit/dropdown-menu",
    "@atlaskit/modal-dialog",
    "@atlaskit/toggle",
    "@atlaskit/spinner",
    "@atlaskit/button",
    "@atlaskit/badge",
    "@atlaskit/lozenge",
    "@atlaskit/tabs",
    "@atlaskit/section-message",
    "@atlaskit/tag",
    "@atlaskit/range",
    "@atlaskit/progress-bar",
    "@atlaskit/textfield",
    "@atlaskit/heading",
    "@atlaskit/primitives",
    "@atlaskit/icon",
    "@atlaskit/tokens",
  ],
  experimental: {
    optimizePackageImports: ["lucide-react", "@phosphor-icons/react"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
