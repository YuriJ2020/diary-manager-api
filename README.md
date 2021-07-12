# Diary Manager UI

## Heroku Deployment

```sh
# Log into Heroku account.
heroku login

# Add an existing Heroku app.
heroku git:remote --app 'diary-manager-api'

# Deploy changes.
git push heroku main
```

## Heroku Commands

### Login Account

```sh
heroku auth:whoami
```

### Heroku Addons

```sh
heroku addons
```

### Environment Variables

```sh
heroku config
```
