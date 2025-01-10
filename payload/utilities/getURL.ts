import canUseDOM from './canUseDOM'

export const getURL = () => {
  return getClientSideURL()
}

// We shouldn't need this anymore
export const getServerSideURL = () => {
  return getConfiguredURL()
}

// This should work both on the server and client side
export const getClientSideURL = () => {
  // We still need to do this check on the client side
  // because process.env.K_CONFIGURATION is only available
  // on the server
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return getConfiguredURL()
}

const getConfiguredURL = () => {
  const isLocal = process.env.NEXT_PUBLIC_IS_LOCAL === 'true'
  const devDomain = process.env.NEXT_PUBLIC_DEVELOPMENT_DOMAIN_NAME

  const currentBackendId = process.env.K_CONFIGURATION
  const productionBackendId = process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_ID
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const appHostingDomainSuffix =
    process.env.NEXT_PUBLIC_APP_HOSTING_DOMAIN_SUFFIX

  const isProduction = currentBackendId === productionBackendId
  const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN_NAME

  if (isLocal) {
    return `http://${devDomain}`
  } else if (isProduction) {
    return `https://${productionDomain}`
  } else {
    return `https://${currentBackendId}--${projectId}.${appHostingDomainSuffix}`
  }
}
