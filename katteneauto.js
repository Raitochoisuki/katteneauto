//ページを読み込んでから実行(HTMLタグを読み込むため)
window.onload = function(){ //始まり
  //ブラウザ上に表記する関数の設定
  function print(str){
    console.log(str);
  };

  //フォームから各ショップ情報をまとめる
  /*フォームからのタグ情報抽出*/
  var allafshop_form = document.getElementById("afcodeform");//フォームタグを見つける
  var namepart = allafshop_form.getElementsByTagName("input");//ショップの名前情報
  var colorpart = allafshop_form.getElementsByTagName("select");//ショップボタンカラー
  var afcodepart = allafshop_form.getElementsByTagName("textarea");//アフィリエイトコード
    var afshopparts = {namepart,colorpart,afcodepart};
  /*抽出ここまで*/

  /*タグ情報をショップ毎にまとめる*/
  function ff(name,btncolor,code){//名前、色、コード該当部分を変数で指定
    this.ffName = name;
    this.ffBtncolor = btncolor;
    this.ffCode = code;
  }

  var ffInfo = new Array();//タグ情報をショップ毎に含んだ箱
  /*ショップデータは配列番号0に統一*/
  ffInfo[0] = [];
  for (var i = 0; i < afcodepart.length; i++) {
    ffInfo[0][i] = new ff(afshopparts.namepart[i],afshopparts.colorpart[i],afshopparts.afcodepart[i]);
  }
  /*タグ情報をショップ毎にまとめる　ここまで*/

  //探し出す文字列をアレイに入れる
  var ela = ["<a",">","</a>"]; //Aタグの根拠となる場所
  var atb = ["href=","\"","target=","nofollow"];//Aタグの属性
  var img = ["<img","src=","\"","/>"];//imgタグの根拠となる場所
  var drc = ["http","https","//"];//直リンクの根拠となる場所
    var str = [ela,atb,img,drc];
  //文字列アレイここまで

  //ショートコード作成用文字列
  var shortcodestrhead = "[kattene]"
                        +"{"
                        + "\"" + "image" + "\"" + ":" + "\"" + "画像URL" + "\"" + ","
                        + "\"" + "title" + "\"" + ":" + "\"" + "タイトル" + "\"" + ","
                        + "\"" + "description" + "\"" + ":" + "\"" + "説明" + "\"" + ","
                        + "\"" + "sites" + "\"" + ":[";
  var shortcodeshop     = "{"
                        + "\"" + "color" + "\"" + ":" + "\"" + "色" + "\"" + ","
                        + "\"" + "url" + "\"" + ":" + "\"" + "商品URL" + "\"" + ","
                        + "\"" + "label" + "\"" + ":" + "\"" + "ショップ名" + "\""
                        +"メインの場合"
                        + "}";
  var shortcodestrend   = "]"
                        + "}"
                        + "[/kattene]";
  //ショートコード作成用文字列ここまで

  //HTML作成用文字列
  var htmlstrktn = "<div class=" + "\"" + "kattene" + "\"" + ">";
  var htmlstrimg  = "<div class=" + "\"" + "kattene__imgpart" + "\"" + ">" + "\n"
                  + "<a" + "\u0020" + "メインURL" + ">"
                  + "<img" + "\u0020" + "画像URL" + ">"
                  + "</a>"
                  + "</div>";
  var htmlstrtitle  = "<div class=" + "\"" + "kattene__infopart" + "\"" + ">" + "\n"
                    + "<div class=" + "\"" + "kattene__title" + "\"" + ">" + "\n"
                    + "<a" + "\u0020" + "メインURL" + ">" + "タイトル" + "</a>" + "\n"
                    + "</div>";
  var htmlstrdcrpt  = "<div class=" + "\"" + "kattene__description" + "\"" + ">" + "説明" + "</div>";
  var htmlstrcount = "<div class=" + "\"" + "kattene__btns __ショップ数" + "\"" + ">";

  var htmlhdary    = [htmlstrktn , htmlstrimg , htmlstrtitle , htmlstrdcrpt , htmlstrcount];
  var htmlstrhead  = htmlhdary.join("\n"); //改行コードでHTMLの最初の部分を連結
  var htmlstrshop  = "<div>" + "\n"
                   + "<a class=" + "\"" + "kattene__btn __色" + "\"" + "\u0020" + "商品URL" + ">" + "ショップ名" +"</a>" + "\n"
                   + "</div>";
  var htmlstrend   = "</div>" + "\n"
                   + "</div>" + "\n"
                   + "</div>";
  //HTML作成用文字列ここまで

  //使用する関数で先に宣言できそうなもの
  /*文字列置換用の関数*/
  function rplc_str(before,rplcword){//パラメータrplcwordには二次元配列が入る
    var c_s = before;
    for (var i = 0; i < rplcword.length; i++) {
      c_s = c_s.replace(rplcword[i][0],rplcword[i][1]);
    }
    return c_s;
  }
  /*文字列置換用の関数ここまで*/

  /*半角1バイト、全角2バイトの計算をして切り取る　コピペ*/
  function cutstr(text, len, truncation) {
    if (truncation === undefined) {
      truncation = '';
    }

    var text_array = text.split('');
    var count = 0;
    var str = '';

    for (i = 0; i < text_array.length; i++) {
      var n = escape(text_array[i]);
      if (n.length < 4) {
        count++;
      }else {
        count += 2;
      }

      if (count > len) {
      return str + truncation;
      }

      str += text.charAt(i);
    }
    return text;
  }
  /*半角1バイト、全角2バイトの計算をして切り取るコピペここまで*/

  /*特定の文字列mark毎にDOMを使って改行などのHTML要素elを挿入しアウトプットする関数 */
  function insert_and_output(text,referenceID,mark,el){
    var p = document.createElement("p");//パラグラフを作り
    var node = document.createTextNode(text);

    /*markとelが記入されている場合のみmarkをHTML要素elに置き換えアウトプット*/
    if ((mark != "") && (el != "") && (mark !== void 0) && (el !== void 0 /*voidは常にundefinedを返す*/)) {

      var splittext = text.split(mark);//文字列をmarkで区切り配列に収める

      //刻んだ配列要素をテキストにするたびに、HTML要素elを挿入する
      for (var i = 0; i < splittext.length; i++) {
        node = document.createTextNode(splittext[i]);
        p.appendChild(node);
        p.appendChild(document.createElement(el));
      }
    }else{
      p.appendChild(node);
    }

    var div = document.getElementById(referenceID);
    div.appendChild(p);

  }
  /*特定の文字列mark毎にDOMを使って改行などのHTML要素elを挿入しアウトプットする関数 ここまで */


  /*メインショップの選択情報*/
  var shopselect_form = document.getElementById("selectmainform");//メインショップ選択のタグ情報取得
  var selectedmain = shopselect_form.getElementsByTagName("select");//セレクトタグ取得
  /*メインショップの選択情報ここまで*/

  /*そのほかの情報取得*/
  var otherinfo_form = document.getElementById("others");
  var addedinfotext = otherinfo_form.getElementsByTagName("textarea");
  /*そのほかの情報取得ここまで*/

  /*ボタンパート取得*/
  var btn_form = document.getElementById("button");//送信ボタンのフォームタグ
  var btnpart = btn_form.getElementsByTagName("button");//ボタンの情報を取得
  /*ボタンパート取得ここまで*/

  //クリックした際の挙動
  var rslt = document.getElementById("result");//結果を表示するタグを取得

  btnpart[0].addEventListener("click", getshoplink);

  function getshoplink(event){
    event.preventDefault();//クリック後の再読み込み等の動作を止める役割

    //ショップ毎のタグ情報から値を抽出しまとめる
    function sh(ffName,ffBtncolor,ffCode){
      this.shName = ffName.value;//名前タグから値を抽出
      this.shBtncolor = ffBtncolor.selectedIndex;//カラータグからカラー番号を抽出
      this.shCode = ffCode.value.replace(/\r?\n/g, '');//コード該当タグ(フォーム)からアフィリエイトコードを抽出、事前に改行を除いておく
    }

    var shInfo = new Array();//抽出したショップ情報を含んだ箱
    /*ショップ情報は配列番号0に統一*/
    shInfo[0] = [];
    for (var i = 0; i < afcodepart.length; i++) {
      shInfo[0][i] = new sh(ffInfo[0][i].ffName,ffInfo[0][i].ffBtncolor,ffInfo[0][i].ffCode);
      switch (shInfo[0][i].shBtncolor) {//色情報を数字から文字列に変換
        case 0:
          shInfo[0][i].shBtncolor = "orange";
          break;
        case 1:
          shInfo[0][i].shBtncolor = "red";
          break;
        case 2:
          shInfo[0][i].shBtncolor = "blue";
          break;
        case 3:
          shInfo[0][i].shBtncolor = "green";
          break;
        case 4:
          shInfo[0][i].shBtncolor = "pink";
          break;
        default:
          break;
      }
    }
    //ショップ毎のタグ情報から値を抽出しまとめる ここまで

    //コードについて、ショップ情報と追加情報を同時に処理したいので、配列にまとめる
    var codebox = [];
    codebox[0] = [];//ショップデータを0に入れる
    for (var i = 0; i < afcodepart.length; i++) {
      codebox[0][i] = shInfo[0][i].shCode;
    }

    codebox[1] = [];//otherデータを1に入れる
    for (var i = 0; i < addedinfotext.length; i++) {
      codebox[1][i] = addedinfotext[i].value;
    }
    //コードまとめここまで

    //各ショップのshCode上の、文字列の位置を一括検索
    var shStrPos = new Array();//文字列の位置を収める箱
    var strIndexNum = new Object();//文字列のインデックス番号を収める箱

    for (var n = 0; n < codebox.length; n++) {
      shStrPos[n] = new Array();//n=0はショップ、n=1はother

      for (var i = 0; i < codebox[n].length; i++) {
        shStrPos[n][i] = new Array();

        for (var j = 0; j < str.length; j++) {
          shStrPos[n][i][j] = new Array();

          for (var k = 0; k < str[j].length; k++) {
            shStrPos[n][i][j][k] = codebox[n][i].indexOf(str[j][k]);//iがショップ番号、j、kが文字列のインデックス番号
            strIndexNum[str[j][k]] = [j,k]//文字列(str[j][k])とインデックス番号j,kを対応させる
          }
        }
      }
    }
    //各ショップのshCode上の、文字列の位置を一括検索 ここまで

    //HTMLコードか、直リンクか、無効かの判定
    var h =[ela[0],atb[0],ela[2]];//htmlを判断する要素、直リンクはdrcをそのまま使用

    /*基本はショップ情報、頭otrはotherの情報*/
    var hIndexNum = new Array(); //htmlを判断する要素のArray(strIndexNum)箱の中の位置(インデックス番号)
    var posh = new Array();　// htmlを判断する要素の、入力フォームの文字列上の位置(インデックス番号)
    var dIndexNum = new Array();　//DirectLinkについても同様
    var posd = new Array();

    for (var n = 0; n < codebox.length; n++) {
      posh[n] = [];
      for (var i = 0; i < codebox[n].length; i++) {
        posh[n][i] = [];
        for (var j = 0; j < h.length; j++) {
          hIndexNum[j] = strIndexNum[h[j]];
          posh[n][i][j] = shStrPos[n][i][hIndexNum[j][0]][hIndexNum[j][1]];
        }
      }
    }

    for (var n = 0; n < codebox.length; n++) {
      posd[n] = [];
      for (var i = 0; i < codebox[n].length; i++) {
        posd[n][i] = new Array();
        for (var j = 0; j < drc.length; j++) {
          dIndexNum[j] = strIndexNum[drc[j]];
          posd[n][i][j] = shStrPos[n][i][dIndexNum[j][0]][dIndexNum[j][1]];
        }
      }
    }

    var shjudgeresult = new Array();//入力フォームのコードの種別を収める箱
    var shvalid = [];

    for (var n = 0; n < codebox.length; n++) {
      shjudgeresult[n] = [];
      for (var i = 0; i < codebox[n].length; i++) {//HTMLか直リンクか無効か
        (posh[n][i][0] >=0)&&(posh[n][i][1]>=0)&&(posh[n][i][2])
        ? (shjudgeresult[n][i] = "HTML")//poshが全て0以上ならHTML

        : (posd[n][i][0]>=0)||(posd[n][i][1]>=0)||(posd[n][i][2]>=0)
          ? (shjudgeresult[n][i] = "直リンク")

          :shjudgeresult[n][i]　= "無効" ;
      }

      shvalid[n] = shjudgeresult[n].map(v => (v === "HTML")||(v === "直リンク"));//ショップが有効か無効かをtruefalseで返す、有効であればtrueが返る

    }

    //HTMLコードか、直リンクか、無効かの判定 終わり


    //タイトル部分の切り出し
    var shoptitle = new Array();//各ショップのタイトル部分文字列を入れる箱

    for (var n = 0; n < codebox.length; n++) {
      shoptitle[n] = [];
      for (var i = 0; i < codebox[n].length; i++) {
        if (shjudgeresult[n][i]==="HTML") {
          var endposT = shStrPos[n][i][strIndexNum["</a>"][0]][strIndexNum["</a>"][1]];//</a>がある場所の1文字手前の位置
          var cutT = codebox[n][i].slice(0,endposT);//endposTまでを切り出す
          var stposT = cutT.lastIndexOf(">")+1;//切り出したcutTの一番後ろの>の位置+1
          shoptitle[n][i] = codebox[n][i].slice(stposT,endposT);//タイトル部分の切り出し
        }else if((shjudgeresult[n][i]==="直リンク")||((n===1)&&(i===2))) {
          shoptitle[n][i] = codebox[n][i];
          continue;

        }else{
          shoptitle[n][i] = "";
          continue;

        }
      }
    }

    //タイトル部分の切り出しここまで

    //HTMLリンク部分の切り出し
    var afurlatrb = new Array();//aタグの中身を全部取り出す
    var afurl = new Array();//属性無しの純リンク

    for (var n = 0; n < codebox.length; n++) {
      afurlatrb[n] = [];
      afurl[n] = [];
      for (var i = 0; i < codebox[n].length; i++) {

        if (shjudgeresult[n][i] == "直リンク"){//直リンクの場合はコードをそのまま代入
          afurlatrb[n][i] =  "href=" +
                              "\"" +
                              codebox[n][i] +
                              "\"" +
                              "\u0020" +
                              "target=" + "\"" + "blank" + "\"";//属性を付加
          afurl[n][i] = codebox[n][i]
          continue;
        }else if(shjudgeresult[n][i] == "無効"){
          afurlatrb[n][i] = ""//無効の場合は空白を返しておく
          afurl[n][i] = "";
          continue;
        }else {
          var stposHatrb = shStrPos[n][i][strIndexNum["<a"][0]][strIndexNum["<a"][1]]+3;//aタグの中身を全部取り出す
          var endposHatrb = codebox[n][i].indexOf(">",stposHatrb);//<aの次の括弧閉じの位置
          afurlatrb[n][i] = codebox[n][i].slice(stposHatrb,endposHatrb);

          var stposH = shStrPos[n][i][strIndexNum["href="][0]][strIndexNum["href="][1]]+6;
          var endposH = codebox[n][i].indexOf("\"",stposH);
          afurl[n][i] = codebox[n][i].slice(stposH,endposH);
        }
      }
    }
    //HTMLリンク部分の切り出し終わり

    //画像URLの切り出し
    var imgsrcatrb = new Array();
    var imgsrc = new Array();
    for (var n = 0; n < codebox.length; n++) {
      imgsrcatrb[n] = [];
      imgsrc[n] = [];

      for (var i = 0; i < codebox[n].length; i++) {
        var judgepos = shStrPos[n][i][strIndexNum["<img"][0]][strIndexNum["<img"][1]];//<imgの位置

        if (judgepos>=0) {//imgタグがある場合は、そのソースを抜き出す
          var stposIatrb = judgepos + 4;
          var endposIatrb = codebox[n][i].indexOf(">",stposIatrb);
          imgsrcatrb[n][i] = codebox[n][i].slice(stposIatrb,endposIatrb);

          var stposI = shStrPos[n][i][strIndexNum["src="][0]][strIndexNum["src="][1]]+5;
          var endposI = codebox[n][i].indexOf("\"",stposI);
          imgsrc[n][i] = codebox[n][i].slice(stposI,endposI);
          continue;

        }else if ((n===1)&&(i===1)&&(shjudgeresult[n][i]==="直リンク")) {//付記情報かつ直リンクの場合、直画像リンクとして処理
          imgsrcatrb[n][i] = codebox[n][i];
          imgsrc[n][i] =  "src=\"" + codebox[n][i].replace(/\r?\n/g, '') + "\"";
          continue;

        }else {//無効や、imgタグが無い場合
          imgsrcatrb[n][i] = "";//もしimgタグが無い場合はソース無し
          imgsrc[n][i] = "";
        }
      }
    }
    //画像URLの切り出し終わり

    //メインショップ番号を取得
    var mainnum = selectedmain[0].selectedIndex;
    //メインショップ番号取得終わり

    //有効リンク数の計算
    var validshnum = 0; //ボタンを押すたびに0からスタート
    for (var i = 0; i < codebox[0].length; i++) {
      if ((shjudgeresult[0][i] == "HTML") || (shjudgeresult[0][i] == "直リンク")) {
        validshnum++;//HTMLか直リンクであれば有効リンク数が一つ増える。
      }
    }
    var validnumeng = "";
    switch (validshnum) {//有効リンク数を英数字に変換
      case 1:
        validnumeng = "one";
        break;
      case 2:
        validnumeng = "two";
        break;
      case 3:
        validnumeng = "three";
        break;
      case 4:
        validnumeng = "four";
        break;
      case 5:
        validnumeng = "five";
        break;
      default:
        validnumeng = "無効"
        break;
    }
    //有効リンク数の計算終わり

    //メインリンクの判別
    var maindata = {
      url : "",
      urlatrb : "",
      imgurl : "",
      imgurlatrb : "",
      title : "",
      description : "",
    };

    if (afurl[1][0]/*メインリンクを追加で入力するフォーム*/ === "" ) {
      maindata.url = afurl[0][mainnum];
      maindata.urlatrb = afurlatrb[0][mainnum];
    }else {
      maindata.url = afurl[1][0].replace(/\r?\n/g, '');
      maindata.urlatrb = afurlatrb[1][0].replace(/\r?\n/g, '');
    }

    if (imgsrc[1][1]/*画像リンクを追加で入力するフォーム*/ === "" ) {
      maindata.imgurl = imgsrc[0][mainnum];
      maindata.imgurlatrb = imgsrcatrb[0][mainnum];
    }else {
      maindata.imgurl = imgsrc[1][1].replace(/\r?\n/g, '');
      maindata.imgurlatrb = imgsrcatrb[1][1].replace(/\r?\n/g, '');
    }

    var titlebeforecut = new String;
    if (shoptitle[1][2]/*タイトルで入力するフォーム*/ === "" ) {
      titlebeforecut = shoptitle[0][mainnum];
    }else {
      titlebeforecut = shoptitle[1][2].replace(/\r?\n/g, '');
    }

    maindata.title = cutstr(titlebeforecut,124,"...");//メインタイトルを半角126文字以下に切り取る

    maindata.description = addedinfotext[3].value.replace(/\r?\n/g, '');//商品説明を追加するフォーム ここは直代入なのでaddedinfotextをぞのまま使う

    //メインリンクの判別終わり

    //ショートコードの作成
    /*ショップの分だけ、siteを作る*/
    var shortcodesite = new Array();
    /*サイト作成時はadded情報が要らないが、混乱を避けるために配列を作る*/
    shortcodesite[0] = [];
    for (var i = 0; i < codebox[0].length; i++) {
      if ((shjudgeresult[0][i] === "HTML") || (shjudgeresult[0][i] === "直リンク")) {
        shortcodesite[0][i] = rplc_str(shortcodeshop,[
                              [/色/g,shInfo[0][i].shBtncolor],
                              [/商品URL/g,afurl[0][i]],
                              [/ショップ名/g,shInfo[0][i].shName]
                            ]);
        if (i === mainnum) {
          shortcodesite[0][i] = rplc_str(shortcodesite[0][i],[[/メインの場合/g,"," + "\n" + "\"" + "main" + "\"" +":" + "\"" + "true" + "\""]]);
        }else {
          shortcodesite[0][i] = rplc_str(shortcodesite[0][i],[[/メインの場合/g,""]]);
        }
      }else {
        shortcodesite[0][i] = "";
      }
    }
    /*ショップサイトの作成終わり*/

    /*ショートコードのサイト間にカンマを入れる*/
    for (let i=0,j=0; i < codebox[0].length; i++) {
      //ショップが有効ならカンマを入れる
      if(shvalid[0][i] === true){
        shortcodesite[0][i] = shortcodesite[0][i] + ",";
        j++;
      }
      //有効数より1つ少ない数のカンマを入れる
      if(j >= validshnum-1){break;}
    }
    /*ショートコードのサイト間にカンマを入れる　終わり*/

    /*ショートコード文字列結合*/
    var shortcodesitejoin = shortcodesite[0].join("\u0020");
    var shrtcdArray = [shortcodestrhead,shortcodesitejoin,shortcodestrend];
    var shortcodealljoin = shrtcdArray.join("\u0020");
    var shortcodefin = rplc_str(shortcodealljoin,[
                        [/画像URL/g,maindata.imgurl],
                        [/タイトル/g,maindata.title],
                        [/説明/g,maindata.description],
                        [/\t/g,"\u00a0"+"\u00a0"+"\u00a0"+"\u00a0"]//タブコードを&nbsp,に変換
                      ]);
    /*ショートコード文字列結合終わり*/

    //ショートコードの作成終わり

    //HTMLタグ作成
    /*ショップの分だけ、siteを作る*/
    var htmlsite = new Array();
    /*サイト作成時はadded情報が要らないが、混乱を避けるために配列を作る*/
    htmlsite[0] = [];
    for (var i = 0; i < codebox[0].length; i++) {
      if ((shjudgeresult[0][i] == "HTML") || (shjudgeresult[0][i] == "直リンク")) {
        htmlsite[0][i] = rplc_str(htmlstrshop,[
                      [/色/g,shInfo[0][i].shBtncolor],
                      [/商品URL/g,afurlatrb[0][i]],
                      [/ショップ名/g,shInfo[0][i].shName]
                      ]);
      }else {
        htmlsite[0][i] = "";
      }
    }
    /*ショップの分だけ、siteを作る 終わり*/

    /*HTML結合*/
    var htmlsitejoin = htmlsite[0].join("\n");
    var htmlArray = [htmlstrhead,htmlsitejoin,htmlstrend];
    var htmlalljoin = htmlArray.join("\n");
    var htmlfin = rplc_str(htmlalljoin,[
                        [/メインURL/g,maindata.urlatrb],
                        [/画像URL/g,maindata.imgurlatrb],
                        [/タイトル/g,maindata.title],
                        [/説明/g,maindata.description],
                        [/ショップ数/g,validnumeng],
                        [/\t/g,"\u00a0"+"\u00a0"+"\u00a0"+"\u00a0"]
                      ]);
    /*HTML結合 終わり*/
    //文字列の結合終わり

    //有効リンク数、リンク箇所、完成コードの表示

    /*各表示させたいtext挿入*/
    insert_and_output("有効リンク数","result");
    insert_and_output(validshnum,"result");//有効リンク数

    insert_and_output("アフィリエイトリンク","result");
    for (var i = 0; i < codebox[0].length; i++) {//リンク箇所
      insert_and_output(shInfo[0][i].shName,"result");
      insert_and_output(afurl[0][i],"result");
    }

    insert_and_output("画像リンク","result");
    for (var i = 0; i < codebox[0].length; i++) {//リンク箇所
      insert_and_output(shInfo[0][i].shName,"result");
      insert_and_output(imgsrc[0][i],"result");
    }

    insert_and_output("ショートコード","result");
    insert_and_output(shortcodefin,"result","\n","br");//完成ショートコード
    insert_and_output("HTMLコード","result");
    insert_and_output(htmlfin,"result","\n","br");
    //有効リンク数、リンク箇所、完成コードの表示 終わり

  }//クリック時の挙動　終わり

  //ショップデータクリアボタンが押されたときの挙動
  btnpart[1].addEventListener("click", shopdataclear);

  function shopdataclear(event){
    event.preventDefault();//クリック後の再読み込み等の動作を止める役割
    var formdata = document.getElementById("afcodeform");
    formdata.reset();
  }
  //ショップデータクリアボタンが押されたときの挙動　終わり

  //生成結果クリアボタンが押されたときの挙動
  btnpart[2].addEventListener("click", cleateddataclear);

  function cleateddataclear(event){
    event.preventDefault();//クリック後の再読み込み等の動作を止める役割

    //生成データを消す
    var deleteresult = document.getElementById("result");
    var parent = deleteresult.parentNode;
    parent.removeChild(deleteresult);

    //新しくID resultのdivタグを作り直す
    var newresult = document.createElement("div");
    newresult.id = "result";
    parent.appendChild(newresult);

  }
  //生成結果クリアボタンが押されたときの挙動 ここまで




};//終わり
