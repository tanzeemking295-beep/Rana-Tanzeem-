Kami Flex - Home page package
Files:
- index.html (login + home)
- jazztv.html
- zongtv.html
- api/login.js (serverless)
- api/proxy.js (serverless proxy for streams)
- vercel.json
- package.json

Instructions:
1) Deploy to Vercel (create project from this repository/zip).
2) Set environment variables in Vercel:
   - ACCESS_KEY (your access key)
   - JWT_SECRET (long random secret)
3) Replace images in images/ folder with real logos and background (logo.png, jazz.png, zong.png, rdP.png, jazz12.png).
4) Use /api/proxy?url=ENCODED_M3U8 if you need server-side proxy for M3U8 streams.
