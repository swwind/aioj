# AI Fucking System

## Deploy

```bash
sudo systemctl start mongodb.service
yarn build && node .
```

## Known Issues

- `/r/region/pid#cid` not work
- ~~update problem title not effect region title~~

## API

```
Request prefix: /api

[ ] -> not implemented
[-] -> implemented without unit tests (unstable)
[x] -> implemented with unit tests (stable)

POST/GET/DELETE /xxx/xx -> http request method and url

- name: string; -> request body  (json prefer)
+ name: string; -> response body (json encoded)
```

Example request:

```
HTTP/1.1 POST /api/login
Content-Type: application/json
{
  "username": "attack204",
  "password": "attack204_ak_world_final"
}
```

Example success response:

```
200 OK
Content-Type: application/json
{
  "status": 200
}
```

Example error response:

```
403 Forbidden
Content-Type: application/json
{
  "status": 403,
  "error": "permission_denied"
}
```

## API

```
[x] POST   /login                       Log in
    - username: string;
    - password: string;
    + user: UserDetail
        + username: string;
        + description: string;
        + email: string;
        + admin: boolean;
[x] POST   /logout                      Log out
[x] POST   /register                    Sign up
    - username: string;
    - password: string;
    + user: UserDetail
        + username: string;
        + description: string;
        + email: string;
        + admin: boolean;
[x] GET    /whoami                      Get the current user's detail
    + user: UserDetail
        + username: string;
        + description: string;
        + email: string;
        + admin: boolean;
[x] GET    /u/:username                 Get user's detail
    + user: UserDetail
        + username: string;
        + description: string;
        + email: string;
        + admin: boolean;
[x] PUT    /u/:username                 Modify user's detail
    - description: string;
    - email: string;

[ ] GET    /problems                    Get the full problem lists
    + problems: ProblemAbstract[]
        + pid: number;
        + title: string;
[ ] GET    /p/:pid                      Get problem information
    + problem: ProblemDetail;
        + pid: number;
        + author: string;
        + content: string;
        + title: string;
        + date: number;
        + hidden: boolean;
[ ] POST   /p/new                       Create a new problem
    - title: string;
    + pid: number;
[ ] PUT    /p/:pid                      Modify a problem
    - title: string;
    - content: string;
    - hidden: boolean;
[ ] PUT    /p/:pid/file                 Upload judger
    - file: File
[ ] DELETE /p/:pid                      Delete a problem

[x] GET    /friends                     Get my friends list
    + friends: string[];
[x] GET    /friends/:username           Get someone's friend list
    + friends: string[];
[x] PUT    /friends/:username           Add a new friend
[x] DELETE /friends/:username           Delete a friend

[x] POST   /r/:region                   Create a new region
    - title: string;
    - description: string;
[x] POST   /r/:region/post              Create a new post in region
    - title: string;
    - content: string;
    - markdown: boolean;
    + pid: string;
[x] POST   /r/:region/:pid/comment      Create a comment to a post
    - content: string;
    - markdown: boolean;
    + comment: CommentDetail
        + cid: number;
        + author: string;
        + edited: boolean;
        + content: string;
        + date: number;
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
    + regions: RegionDetail[]
        + region: string;
        + title: string;
        + description: string;
[x] GET    /r/:region                   Get posts list in a region
    + region: RegionDetail
        + region: string;
        + title: string;
        + description: string;
    + posts: PostDetail[]
        + pid: number;
        + title: string;
        + author: string;
        + date: number;
[x] GET    /r/:region/:pid              Get post details (including comments)
    + post: PostDetail
        + pid: number;
        + title: string;
        + author: string;
        + date: number;
    + comments: CommentDetail[]
        + cid: number;
        + author: string;
        + edited: boolean;
        + content: string;
        + date: number;
    + region: RegionDetail
        + region: string;
        + title: string;
        + description: string;

[x] POST   /upload                      Upload a file
    - file: File;
    + file: FileDetail
        + fid: string;
        + filename: string;
        + author: string;
        + size: number;
        + date: number;
[x] GET    //cdn/f/:fid                 Fetch the uploaded file
    + ... (206 partical content support)
[x] GET    /files/i/:fid                Get file's information
    + file: FileDetail
        + fid: string;
        + filename: string;
        + author: string;
        + size: number;
        + date: number;
[x] GET    /files/u/:username           Get user's upload
    + files: FileDetail[]
        + fid: string;
        + filename: string;
        + author: string;
        + size: number;
        + date: number;
[x] DELETE /files/:fid                  Delete a file

[x] POST   /b/:pid                      Create a new bot
    - name: string
    - description: string
    - paint: string
    - playerMin: number
    - playerMax: number
    - [src: string, type: string]
    - [file: File]
    + bid: number
[x] PUT    /b/:bid                      Modify a bot
    - name: string
    - description: string
    - paint: string
    - playerMin: number
    - playerMax: number
    - [src: string, type: string]
    - [file: File]
    + bot: BotDetail
[x] GET    /b/list                      Get bots list
    - (query) p: number             --  Problem id
    - (query) u: string             --  Username
    + bots: BotDetail[]
[x] POST   /s/new                       Create a new round
    - pid: number
    - bids: number[]

P.S. about regions : every problems have its own region name like `_p1001` (for problem 1001), and it will not be returned in regions list.
```
