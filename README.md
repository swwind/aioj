# backend

```
Request prefix: /api
```

```
[x] POST   /login                       Log in
    - username: string;
    - password: string;
[x] POST   /logout                      Log out
[x] POST   /register                    Sign up
    - username: string;
    - password: string;
[x] GET    /whoami                      Get username
[ ] GET    /u/:username                 Get user's detail
[ ] PUT    /u/:username                 Modify user's detail

[ ] GET    /problems                    Get the full problem lists
[ ] GET    /p/:pid                      Get the problem details
[ ] POST   /problem                     Create a new problem
[ ] PUT    /p/:pid                      Modify a problem
[ ] DELETE /p/:pid                      Delete a problem

[x] GET    /friends                     Get full friends list
[x] PUT    /friends/:username           Add a new friend
[x] DELETE /friends/:username           Delete a friend

[ ] GET    /s/:username                 Get user's submissions for all problems
[ ] GET    /s/:username/:pid            Get user's submissions for a specific problem

[ ] POST   /submit/:pid                 Submit your code and save as a bot
[ ] POST   /challenge/:pid              Start a challenge with a set of bots

[x] POST   /r/:region                   Create a new region
    - title: string;
    - description: string;
[x] POST   /r/:region/post              Create a new post in region
    - title: string;
    - content: string;
[x] POST   /r/:region/:pid/comment      Create a comment to a post
    - content: string;
[x] PUT    /r/:region                   Modify a region
    - title: string;
    - description: string;
[x] PUT    /r/:region/:pid              Modify a post
    - title: string;
[x] PUT    /r/:region/:pid/:cid         Modify a comment
    - content: string;
[x] DELETE /r/:region                   Delete a region
[x] DELETE /r/:region/:pid              Delete a post
[x] DELETE /r/:region/:pid/:cid         Delete a comment
[x] GET    /regions                     Get regions list
[x] GET    /r/:region                   Get posts list in a region
[x] GET    /r/:region/:pid              Get post details (including comments)

P.S. about regions : every problems have its own region name like `_p1001` (for problem 1001), and it will not be returned in regions list.
```
