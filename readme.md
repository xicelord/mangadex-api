# mangadex-api
This is a NodeJS-application intended to be used as an API for mangadex.  
It is not recommended to run it in production currently.  
A lot of features are not implemented as of now and the methods probably will changed in the future.
Currently it only supports public read-only access without any user-authentication.

## Warnings
The responses from the API are unescaped! Do NOT simpy load the content into a html-tag, make sure to [sanitize](https://github.com/yahoo/xss-filters) it first.

## Notes
This API is based on an old version of the sql-schema of mangadex and some features may not be working as of now.

## Todo
-Anything write-related  
-...

## Documentation

### /api/v1/manga/:type/:mid
Get the info of a manga. `:type` is to be replaced by `md`(Mangadex),`mu`(Mangaupdates) or `mal`(MyAnimeList) and specified the type of id supplied.
`mid` is to be replaced by the id manga.  
A result looks like this:
```json
{
    "id": 1,
    "name": "Amentia",
    "alt_names": [],
    "author": "Yang Hyeseok",
    "artist": "Bak Hyein",
    "language": {
    "id": 28,
        "name": "Korean",
        "flag": "kr"
    },
    "status": {
        "id": 1,
        "name": "Ongoing"
    },
    "adult": 1,
    "description": "Lee Wee Jin has to cope with his tyrant sister on a master-slave basis everyday. Trying to fool himself he evades reality, thinking she's tsundere and that she really likes him. Suddenly, these delusions become all too real.",
    "cover": "jpg",
    "rating": 0,
    "views": 5,
    "follows": 0,
    "last_updated": 1520716818,
    "comments": 0,
    "mu_id": 130175,
    "mal_id": 99349,
    "locked": true
}
```

### /api/v1/group/:gid
`gid` is to be replaced by the id of the group you want to access.  
A result looks like this:
```json
{
    "id": 1941,
    "name": "test_group_1",
    "website": "",
    "irc_server": "",
    "irc_channel": "",
    "discord": "",
    "email": "",
    "language": {
        "id": 1,
        "name": "English",
        "flag": "us"
    },
    "founded": "2017-12-31T23:00:00.000Z",
    "banner": "",
    "comments": 0,
    "likes": 0,
    "follows": 0,
    "views": 5,
    "description": "Just a test",
    "control": false,
    "delay": 0,
    "members": [
        {
            "role": "leader",
            "user": {
                "id": 20986,
                "name": "icelord",
                "level": {
                    "id": 15,
                    "name": "admin",
                    "color": "100"
                }
            }
        },
        {
            "role": "member",
            "user": {
                "id": 20987,
                "name": "guy",
                "level": {
                    "id": 5,
                    "name": "Power Uploader",
                    "color": "80"
                }
            }
        }
    ]
}
```

### /api/v1/user/:uid
`uid` is to be replaced by the id of the user you want to access.  
A result looks like this:
```json
{
    "id": 20986,
    "username": "icelord",
    "avatar": "",
    "language": {
        "id": 1,
        "name": "English",
        "flag": "us"
    },
    "level": {
        "id": 15,
        "name": "admin",
        "color": "100"
    },
    "joined": 1520540321,
    "last_seen": 1520802275,
    "views": 6,
    "uploads": 4
}
```

### /api/v1/chapter/:cid
`cid` is to be replaced by the id of the chapter you want to access.  
A result looks like this:
```json
{
    "id": 9,
    "manga": {
        "id": 1,
        "name": "Amentia"
    },
    "volume": "1",
    "chapter": "5",
    "title": "",
    "upload_timestamp": 1520626273,
    "user": {
        "id": 20986,
        "username": "icelord"
    },
    "views": 1,
    "language": {
        "id": 1,
        "name": "English",
        "flag": "us"
    },
    "authorised": false,
    "group": {
        "id": 1941,
        "name": "test_group_1"
    },
    "group2": {
        "id": 1942,
        "name": "test_group_2"
    },
    "group3": null,
    "pages": [
        "https://mangadex.org/data/a46abb0353417441f270c11f13f65238/x1.png"
    ]
}
```

### /api/v1/chapters/:origin/:id?lang_ids=&adult=&limit=&offset=
`origin` is to be replaced by the resource you want to access (group, manga).  
`id` is to be replaced by the id of the resource you want to access.  
`lang_ids` (optional) -> List of the language-ids you want (example: 1,2,3)
`adult` (optional, default: 0) -> Show chapters of adult-mangas (1 = show)
`limit` (optional, default: 100) -> Maximum amount of chapters (example: 25)
`offset` (optional, default: 0) -> Skip x chapters (example: 100)
A result looks like this:
```json
[
    {
        "id": 13,
        "volume": "1",
        "chapter": "2",
        "title": "gg",
        "manga": {
            "id": 1,
            "name": "Amentia",
            "cover": "jpg",
            "adult": 1
        },
        "upload_timestamp": 1520716818,
        "authorised": 0,
        "group": {
            "id": 1941,
            "name": "test_group_1"
        },
        "group2": null,
        "group3": null,
        "language": {
            "id": 1,
            "name": "English",
            "flag": "us"
        },
        "user": {
            "id": 20986,
            "username": "icelord",
            "level": {
                "name": "admin",
                "color": "100"
            }
        }
    }
]
```
