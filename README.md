# backend

```
[ ] POST /api/login                         Log in
[ ] POST /api/logout                        Log out
[ ] POST /api/register                      Sign up
[ ] GET /api/whoami                         Get username

[ ] GET /api/problem/all                    Get the full problem lists
[ ] GET /api/problem/:pid                   Get the problem details
[ ] PUT /api/problem                        Create a new problem
[ ] POST /api/problem/:pid                  Modify a problem
[ ] DELETE /api/problem/:pid                Delete a problem

[ ] GET /api/friends                        Get full friends list
[ ] PUT /api/friends/:username              Add a new friend
[ ] DELETE /api/friends/:username           Delete a friend

[ ] GET /api/submissions/:username          Get user's submissions for all problems
[ ] GET /api/submissions/:username/:pid     Get user's submissions for a specific problem

[ ] PUT /api/submit/:pid                    Save your code
[ ] POST /api/submit/:pid                   Start a challenge with a set of codes
```

## Accounts

### Log in

```
POST /api/login
Content-Type: application/json
{
  "username": "23333",
  "password": "balabala"
}

=====

200 OK
Content-Type: application/json
Set-Cookie: auth=xxxxxxxxxxxxxxxxxxxxxxxxxxx
{
  "status": 200
}

=====

400 Bad Request
Content-Type: application/json
{
  "status": 400,
  "error": "password_wrong"
}
```

### Log out

```
POST /api/logout
Content-Type: application/json
{
}

=====

200 OK
Content-Type: application/json
Set-Cookie: auth=; Expires=Thu, 01 Jan 1970 00:00:00 GMT
{
  "status": 200
}

=====

401 Unauthorized
Content-Type: application/json
{
  "status": 401,
  "error": "login_require"
}
```

### Sign up

```
POST /api/register
Content-Type: application/json
{
  "username": "23333",
  "password": "balabala"
}

=====

200 OK
Content-Type: application/json
Set-Cookie: auth=xxxxxxxxxxxxxxxxxxxxxxxxxxx
{
  "status": 200
}

=====

400 Bad Request
Content-Type: application/json
{
  "status": 400,
  "error": "user_exists"
}
```

### Who am I

```
GET /api/whoami
Cookie: auth=xxxxxxxxxxxxxxxxxxxxxxxxxxx

=====

200 OK
Content-Type: application/json
Set-Cookie: auth=xxxxxxxxxxxxxxxxxxxxxxxxxxx
{
  "status": 200,
  "username": "attack204"
}

=====

401 Unauthorized
Content-Type: application/json
{
  "status": 401,
  "error": "login_require"
}
```
