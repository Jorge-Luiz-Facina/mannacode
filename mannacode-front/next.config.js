const BASE_URL_LOCAL = process.env.NEXT_PUBLIC_API_URL
const BASE_SOCKET_LOCAL = process.env.NEXT_PUBLIC_SOCKET_URL
//criar .env.development load dev
module.exports = {
    env: {
        baseUrl: BASE_URL_LOCAL,
        baseSocketUrl: BASE_SOCKET_LOCAL,
    },
    serverRuntimeConfig: {
    },
    publicRuntimeConfig: {

    },
}