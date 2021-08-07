##THIS TEMPLATE COUNTS WITH

- Users with
  - Roles
  - Authentication through password
  - Authorization through JWT access and refresh tokens
- Endpoints (base url: api/v1/)
  - auth/
    - signin
    - signup
    - get-new-access-token
    - signout
    - create-admin
      For this we need to pass the CREATE_ADMIN_PASSWORD in the request body

DRAWBACKS OF THIS APPROACH

- scalability
  we can't split the server easily because we're storing the refresh token in it. What happens if the user changes location and the application now connects to another instance of the server? We could share the information across all instances of the app, but that's an innecesary overhead. We can avoid saving the token to the database and still being able to blacklist them with a flag on the token itself. Since it's encrypted, it's secure.
