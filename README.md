# backend

```
[x] POST /api/login                         Log in
[x] POST /api/logout                        Log out
[x] POST /api/register                      Sign up
[x] GET /api/whoami                         Get username
[ ] GET /api/u/:username                    Get user's detail
[ ] PUT /api/u/:username                    Modify user's detail

[ ] GET /api/problem/all                    Get the full problem lists
[ ] GET /api/problem/:pid                   Get the problem details
[ ] PUT /api/problem                        Create a new problem
[ ] POST /api/problem/:pid                  Modify a problem
[ ] DELETE /api/problem/:pid                Delete a problem

[x] GET /api/friends                        Get full friends list
[x] PUT /api/friends/:username              Add a new friend
[x] DELETE /api/friends/:username           Delete a friend

[ ] GET /api/submissions/:username          Get user's submissions for all problems
[ ] GET /api/submissions/:username/:pid     Get user's submissions for a specific problem

[ ] POST /api/submit/:pid                   Submit your code as a bot
[ ] POST /api/challenge/:pid                Start a challenge with a set of bots

[x] POST /api/r/:region                     Create a new region
[x] POST /api/r/:region/post                Create a new post in region
[x] POST /api/r/:region/:pid/comment        Create a comment to a post
[x] PUT /api/r/:region                      Modify a region
[x] PUT /api/r/:region/:pid                 Modify a post
[x] PUT /api/r/:region/:pid/:cid            Modify a comment
[x] DELETE /api/r/:region                   Delete a region
[x] DELETE /api/r/:region/:pid              Delete a post
[x] DELETE /api/r/:region/:pid/:cid         Delete a comment
[x] GET /api/regions                        Get regions list
[x] GET /api/r/:region                      Get posts list in a region
[x] GET /api/r/:region/:pid                 Get post details (including comments)

P.S. about regions : every problems have its own region name like `_p1001` (for problem 1001), and it will not be returned in regions list.
```
