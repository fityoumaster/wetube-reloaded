1. css가 없을경우 임시로 이쁘게 css 입혀주는 링크
https://andybrewer.github.io/mvp/

2. mixin 은 pug의 함수의 일종이다. 반복적으로 사용되는 html 구조를 mixin의 정의하고 그값을 인자함수로 정의해줌으로써 반복되는 html 안에 변수를 설정해줄수있다. 아래 소스의 +는 mixin을 포함하여 실행한다는 뜻이다.

https://pugjs.org/language/mixins.html
※ https://nomadcoders.co/wetube/lectures/2635

3. 
/video/edit"--->localhost:4000/edit
a(href="video/edit)--->localhost:4000/videos/video /edit
a(href=`${video.id}/edit`)--->localhost:4000/videos/1/edit

4. page에 get/post 둘 다 있을때
ex : videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

5. express.urlencoded([options])
Express에 내장된 미들웨어 기능입니다. urlencoded 페이로드로 들어오는 요청을 구문 분석하고 바디 파서를 기반으로 합니다.
ex : form > post > controller req.body 해석

6. Mac OS MongoDB
>> https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
>> brew services start mongodb-community@5.0 서비스 실행하고
>> mac terminal > mongod > mongo 입력 후 mongodb shell 진입