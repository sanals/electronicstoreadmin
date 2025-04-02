/**
 * Check if an endpoint requires authentication
 * The following endpoints are public:
 * - /auth/**
 * - /users/create
 * - /health/**
 * 
 * All other endpoints, including /images/ endpoints, require authentication
 * 
 * @param endpoint The API endpoint to check
 * @returns true if the endpoint requires authentication, false otherwise
 */
export const requiresAuthentication = (endpoint: string): boolean => {
  // Check if endpoint starts with any of the public paths
  const publicPaths = [
    '/api/v1/auth/',
    '/api/v1/users/create',
    '/api/v1/health/'
  ];
  
  // Check if the endpoint starts with any of the public paths
  return !publicPaths.some(path => endpoint.startsWith(path));
}; 