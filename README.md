# mqtt_sensor_watch

このプログラム群は，[Gen_arduino_mqtt](https://github.com/masaaki-noro/Gen_arduino_mqtt)で生成されたArduino用プログラムで
動作する，Arduinoを使ったセンサ端末が発信するセンサデータを可視化するためのものである．

このプログラムでは，下図のシステムにおけるWebサーバに配置するHTMLファイル(+Javascriptプログラム)を生成するためのものである．
<div style="text-align: center;">
<img src="Doc/images/可視化環境イメージ.png" width="80%">
</div>

このプログラムの出力であるWebページでは，下図のようやセンサデータの時系列グラフや度数分布のグラフ，統計値(中央値，平均値等)や複数のセンサデータ(例えば気温と湿度)の間の相関係数を自動的に計算して表示する．

<div style="text-align: center;">
<img src="Doc/images/加速度可視化ページトップ.png" width="80%">
</div>

下の図は3次元加速度センサのデータに対する統計情報の表と観測値がある基準を超えた場合に警告を出す機能の出力例である．
<div style="text-align: center;">
<img src="Doc/images/加速度データ統計値事例.png" width="80%">
</div>


## 対象環境と事前のソフトウェアインストール

動作環境はWindows, Mac, Linuxに限定しないものの，Windowシステムが動作している必要があるため，Linuxユーザは要注意．
また，本プログラム群はPython, Pythonのウィンドウシステム用のライブラリとSQLite3を利用しているため，
これらをインストールする必要があります．

最初にPythonおよびSQLite3をインストールしてください．

### 利用しているPythonライブラリ

以下のライブラリを使っています．
- sqlite3
- csv
- flet_multi_page
- flet
- yaml
- time
- re
- enum
- sys
- os
- paho.mqtt
- json

以下のプログラムを自分のPython環境で実行し，エラーが出なければ大丈夫ですが，
インストールしていないライブラリがあれば，エラーがでるので，pipやanacondaで
ライブラリをインストールしておいてください．
```
import sqlite3
import csv
import flet_multi_page
import flet
import yaml
import time
import re
import enum
import sys
import os
import paho.mqtt
import json
```


## インストール

ダウンロードしたアーカイブをほどいて，どこかのディレクトリに丸ごとコピーしてください．

### Widowsの場合

アーカイブの解凍以外にすべきことはありません．


### MacやLinuxの場合
shell画面でアーカイブを解いたディレクトリに移動し，以下のコマンドを入力してください．

```
$ chmod +x csv_to_sqlite dataFilter defineSensorViewer genSensorViewer mqttListner sqlite_to_csv
```


## 実行方法

Windowsの場合は，各コマンドに対応したバッチファイルが存在するので，それをダブルクリックすればOKです．

MacやLinuxの場合は，下のように，shell画面で直接実行してください．


```
$ ./csv_to_sqlite
```

