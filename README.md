## THIS TEMPLATE COUNTS WITH

# Configure Google Auth

- Read https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid?authuser=1
- use the enviroment variables
  GOOGLE_CLIENT_ID = id
  GOOGLE_CLIENT_SECRET = secret

# Configure nodemailer

Set the email and the APP_KEY environment variable

# Configure passport

Set the urls for callback

## CHARACTERISTICS

- Users with
  - Roles
  - Authentication through password
  - Authorization through JWT access and refresh tokens
    refresh token is stored on a cookie/localstorage and send only when needed
- Endpoints (base url: api/v3/)
  - auth/
    - signin
    - signup
    - get-new-access-token
    - signout
    - create-admin
      For this we need to pass the CREATE_ADMIN_PASSWORD in the request body

DRAWBACKS
If an access or refresh token is stolen we can't verify that the user sending the request is the same as the owner of the token.

TODO

- Set error messages on auth responses. They should be ready for being displayed on the client directly.

## Environment Variables

DB_URI = mongodb+srv://...
PORT = 8000
JWT_TOKEN_SECRET = string secret
CREATE_ADMIN_PASSWORD = string secret

GOOGLE_CLIENT_ID =
GOOGLE_CLIENT_SECRET =

FACEBOOK_APP_ID =
FACEBOOK_APP_SECRET =

TWITTER_API_KEY =
TWITTER_API_SECRET =

<!-- For nodemailer -->

GOOGLE_APP_KEY =
