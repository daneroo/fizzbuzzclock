# Fizz Buzz Clock

Simplest possible GraphQL subscription Demo

Also returns same payload on `/`

## Operation

Deployed to:

- <https://fizzbuzzclock.n.imetrical.com/>
- <https://fizzbuzzclock.n.imetrical.com/health>
- <https://fizzbuzzclock.n.imetrical.com/version>
- <https://fizzbuzzclock.n.imetrical.com/graphql>

```bash
npm run deploy
```

## TODO

- make setInterval line up with seconds

## 2019-11-18

- refactor fizzbuzz logic into module
- make `/` respond with fizzbuzz payload
- make `graphql/messages` keep last `n` messages
- make `/health` include connection count, and uptime
- update dependencies
