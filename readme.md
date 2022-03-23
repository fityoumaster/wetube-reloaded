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

7. callback & promise (async, await)
https://nomadcoders.co/wetube/lectures/2675
https://nomadcoders.co/wetube/lectures/2682

8. return render / render 둘의 차이는 상관이 없지만 return을 해줌으로써 더 확실하게 다음 코드가 실행되지 않도록 방지해주는 차원

9. /wetube/lectures/2676
- ([0-9a-f]{24}) MongoDB Id값의 정규식
- MongoDB CRUD 는 async/await 로 하자.

10. 
get 받아오기 : req.query
post 받아오기 : req.body

11. 
MongoDB find 시 contain > $regex: new RegExp(keyword, "i")

12.
pug랑 res.locals는 express가 서로 공유될 수 있도록 기본으로 설정됨.
>> backend 에서 템플릿에서 기본으로 값을 공유할때 사용(세션 등)

13. 
.env 환경변수 파일 만들고 비공개 문자열(DB등)을 여기에 보관하고
gitignore에 추가하여 push 안되게 하자.

14.
# 파일 업로드
# https://github.com/expressjs/multer/blob/master/doc/README-ko.md
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file 은 `avatar` 라는 필드의 파일 정보입니다.
  // 텍스트 필드가 있는 경우, req.body가 이를 포함할 것입니다.
})
