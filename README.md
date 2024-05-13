# WHAT2EAT
<img src="WHAT2EAT.png" height="800"/>

[web](http://98.142.143.30:3000)

## [Review](http://98.142.143.30:3000/reviewtable)

## Eat out
- [x] <2023-06-06 Tue>, Soup, 酱蟹
- [x] <2023-06-15 Thu>, st, 田师傅总店, 鲜椒毛肚, 一品鲜椒响螺片, 鲁豫大油条
- [ ] <2023-06-29 Thu>, Soup, 老油条
- [ ] <2024-02-08 Thu>, st, Mr.Bro
- [ ] <2024-04-03 Wed>, st 上海点心店/什么上海xx大王忘了 蟹粉小笼包
- [ ] <2024-04-09 Tue>, Soup, Sumo


## Local deployment

### Server

```sh
cd what2eat_server
npm install
npm start
```

### Client

```sh
cd what2eat_client
npm install
npm start
```

#### Config
Open `/what2eat_client/src/config.ts` and update the serverIP
```js
export const Config = {
    serverIP: "${SERVER_IP}:60024"
}
```
