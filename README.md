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
