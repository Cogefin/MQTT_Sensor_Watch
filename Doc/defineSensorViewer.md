# defineSensorViewer

このプログラムでは，センサデータを可視化するためのWebページの仕様を表すyamlファイルを作成する．

## Webページ関連パラメータ

ここでは，下図にあるように，出力されるWebページのタイトルや，データを読み込み再描画するインターバル，
浮動小数を表示する場合の小数点以下を何桁とるか，データファイル名を入力する．

<div style="text-align: center;">
<img src="images/defineSensorViewer_top.png" width="70%">
</div>


## センサ選択
可視化するデータを含むファイルは目的とするセンサ以外の観測データを含んでいる可能性がある．
そのため，データファイルの中で，どのセンサの観測データを可視化するかを選択する．

この画面では，可視化対象のMQTTトピック，センサの種類，センサIDを指定する．

なお，「監視対象追加」ボタンを押すことで，監視対象を増やすことができる．

<div style="text-align: center;">
<img src="images/defineSensorViewer_フィルタ.png" width="70%">
</div>

センサの種類については，下の図のように，メニューから選択する．
<div style="text-align: center;">
<img src="images/defineSensorViewer_センサタイプ.png" width="70%">
</div>

下図は入力例であるが，この例では，センサIDを-1にしている．センサIDが-1の場合，
MQTTトピックとセンサの種類さえ一致すれば，センサIDの値に関係なく，
全てのデータを抽出する．


<div style="text-align: center;">
<img src="images/defineSensorViewer_フィルタ例.png" width="70%">
</div>

## データ系列指定
センサの選択で指定した時系列のセンサデータに対して，どのような前処理を
行うかを選択する．

ページ冒頭のデータ系列の番号からどのデータ系列に対して処理を行うか，どのような前処理を行うか，
移動平均等を行う場合，そのレンジについて指定する．


後ほどグラフや統計処理対象にするデータの系列は全て何らかの前処理などの
指定をしておく必要がある．


<div style="text-align: center;">
<img src="images/defineSensorViewer_データ系列トップ.png" width="70%">
</div>

最初のデータ系列のパラメータは，メニューで選択する．

<div style="text-align: center;">
<img src="images/defineSensorViewer_データ系列1.png" width="70%">
</div>


2番目の前処理も同じくメニューで選択する．

特に，前処理をする必要がない場合は「そのまま」を選択する．

<div style="text-align: center;">
<img src="images/defineSensorViewer_データ系列2.png" width="70%">
</div>

下図の例では，前処理として「単純移動平均」を選択しているため，
過去何個分を単純移動平均の対象とするかの数字を3つめの欄に入力している．

<div style="text-align: center;">
<img src="images/defineSensorViewer_データ系列3.png" width="70%">
</div>

## 統計処理

ここでは，先ほど指定したデータ系列に対して，統計処理結果やデータの度数分布グラフの表示を
行うか否かを選択する．

<div style="text-align: center;">
<img src="images/defineSensorViewer_統計処理判定.png" width="70%">
</div>

作成するを選択した場合，どのデータ系列に対して統計処理や度数分布グラフを作成するかを指定する．
特に，グラフについてはタイトルや軸の表記等を指定する必要があるため，各種のパラメータをこの画面で入力する．

<div style="text-align: center;">
<img src="images/defineSensorViewer_統計処理系列1.png" width="70%">
</div>

下図はその入力事例である．
<div style="text-align: center;">
<img src="images/defineSensorViewer_統計処理系列2.png" width="70%">
</div>

## 時系列グラフ
ここでは，時系列のデータから成り立っている各センサデータの時系列グラフを作るか否か，作るとした場合に
どのようなパラメータで作成するかを指定する．

まず最初に何個のグラフを作成するかを定義する．
<div style="text-align: center;">
<img src="images/defineSensorViewer_グラフ1.png" width="70%">
</div>

次に，グラフのタイトルや描画するデータ系列を宣言する．
<div style="text-align: center;">
<img src="images/defineSensorViewer_グラフ2.png" width="70%">
</div>


下図は入力した事例であるが，1つの時系列グラフに複数のデータ系列を描画
することも可能であり，その場合は，「描画対象系列追加」をクリックする．

ただし，縦軸は1つに限定されるため，単位系が同じデータ系列でなければならない．


<div style="text-align: center;">
<img src="images/defineSensorViewer_グラフ3.png" width="70%">
</div>

## 相関分析
そのアプリケーションが出力するWebページでは，2つのデータ系列の相関分析も
可能である．

相関分析を行う組み合わせの数の指定やデータ系列の定義を行う．

もし，相関分析を行う場合は，組み合わせ数を入力し，「Next」をクリックした後，
データ系列を選択する画面に遷移するため，そちらで系列を選択する．

<div style="text-align: center;">
<img src="images/defineSensorViewer_相関分析.png" width="70%">
</div>

ただし，相関分析を行うデータ系列のデータの測定頻度に違いがあると，
数が合わないなどの問題が出る．それを吸収する機能はないため，
dataFilterと併用して数や時刻を揃えたデータを利用することが望ましい．

## エラーチェック&ライブラリ
あるデータ系列に着目した場合に，異常値を検出するような目的で利用する機能となる．

この異常値チェックを行うルールはjavascriptのプログラムを入力する必要があり，
その処理に何らかのjavascriptライブラリを利用する場合に，そのライブラリの個数も定義する．

<div style="text-align: center;">
<img src="images/defineSensorViewer_エラーチェック1.png" width="70%">
</div>

### エラーチェックルール
この画面では，ルールとルールにヒットした場合に画面に出力するメッセージを入力する．
<div style="text-align: center;">
<img src="images/defineSensorViewer_エラーチェック2.png" width="70%">
</div>


下の図は定義した事例であり，明るさの値が一定値を超えた場合にメッセージを表示するようになっている．

<div style="text-align: center;">
<img src="images/defineSensorViewer_エラーチェック3.png" width="70%">
</div>

なお，プログラミングのルールとしては，以下のようなものとなっている．

ルールは検査する関数の中身だけを埋める形であり，1回の検査でアクセスできる値は1つの測定値に限定される．
そのため，測定値を配列や行列してアクセスすることはできない．

また，上の例のように，配列``data``がデータが収められている配列で``data[0]``が測定データの時刻情報``data[1]``が値である．
返り値として``false``を返せばメッセージが出力される．

### ライブラリ
javascriptのライブラリを出力のWebページに埋め込む方法として，本プログラムでは，インターネットからhttpsで
取得可能なライブラリの利用を想定している．

以下の2行はデフォルトでロードしているライブラリがHTMLに埋め込まれている事例である．
```
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.min.js" integrity="sha512-VYs2RuvWreNg7oouVhZ/9bEvdPgyd5L2iCPCB8+8Qks/PHbmnc82TQOEctYoEKPveJGML8s+3NGcUEZYJrFIqg==" crossorigin="anonymous" referrerpolicy="no-referrer" ></script>
```

このように，2種類の埋め込み形式を想定しており，下図は上のcloudflareの行を生成するために必要な定義を入力した事例である．

ただし，googleチャートとsql-wasmはデフォルトでロートされるため，自分で定義する必要はない．

<div style="text-align: center;">
<img src="images/defineSensorViewer_ライブラリ1.png" width="70%">
</div>

下図はgoogleチャートを画面で定義した場合の例であり，こちらはセキュリティ的な縛りがない定義となっている．
<div style="text-align: center;">
<img src="images/defineSensorViewer_ライブラリ2.png" width="70%">
</div>

自分が利用したいライブラリを出力されるHTMLを想定しながら定義する必要がある．

## 出力ファイル指定

この画面では，最終出力となるWebページ(HTML+javascript)のファイル名を指定し，
出力ボタンを押すことで，ファイルを生成させる．
<div style="text-align: center;">
<img src="images/defineSensorViewer_yaml_output.png" width="70%">
</div>

***
- [READMEに戻る](README.md)
