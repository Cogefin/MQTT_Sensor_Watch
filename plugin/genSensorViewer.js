


/*
 * 固定の定数およびグローバル変数
 */
var index = {
    TOPIC                 : 0  ,
    ID                    : 1  ,
    TYPE                  : 2  ,
    TIME                  : 3  ,
    ACCELEROMETER         : 4  ,
    GYROSCOPE             : 10 ,
    LIGHT                 : 16 ,
    PRESSURE              : 18 ,
    LINEAR_ACCELERATION   : 20 ,
    RELATIVE_HUMIDITY     : 22 ,
    AMBIENT_TEMPERATURE   : 24 ,
    CURRENT               : 26 ,
    COLOR                 : 28 ,
    SIMPLE                : 36 ,
    ANGLE                 : 38 ,
    ONE_AXIS_GYRO         : 40 ,
    DISTANCE              : 42 ,
    DUST                  : 44 ,
    POSITION              : 46 ,
    SPEED_KNOT            : 54 ,
    SIMPLE_ANALOG         : 56 ,
    DATE                  : 58 ,
    MAX_INDEX             : 73
};

var elements = {
    ACCELEROMETER         : 3 ,
    GYROSCOPE             : 3 ,
    LIGHT                 : 1 ,
    PRESSURE              : 1 ,
    LINEAR_ACCELERATION   : 1 ,
    RELATIVE_HUMIDITY     : 1 ,
    AMBIENT_TEMPERATURE   : 1 ,
    CURRENT               : 1 ,
    COLOR                 : 4 ,
    SIMPLE                : 1 ,
    ANGLE                 : 1 ,
    ONE_AXIS_GYRO         : 1 ,
    DISTANCE              : 1 ,
    DUST                  : 1 ,
    POSITION              : 4 ,
    SPEED_KNOT            : 1 ,
    SIMPLE_ANALOG         : 1 ,
    DATE                  : 8
};

var type = [
    'DUMMY',
    'ACCELEROMETER',
    'MAGNETIC_FIELD',
    'ORIENTATION',
    'GYROSCOPE',
    'LIGHT',
    'PRESSURE',
    'PROXIMITY',
    'GRAVITY',
    'LINEAR_ACCELERATION',
    'ROTATION_VECTOR',
    'RELATIVE_HUMIDITY',
    'AMBIENT_TEMPERATURE',
    'VOLTAGE',
    'CURRENT',
    'COLOR',
    'SIMPLE',
    'ANGLE',
    'ONE_AXIS_GYRO',
    'DISTANCE',
    'LARGE_INT',
    'DUST',
    'IRREMOTE',
    'POSITION',
    'DATE',
    'SPEED_KNOT',
    'SIMPLE_ANALOG'
];

var data=[];

var dataSource = [];

var correlationData = [];

var graph_data=[];

var frequency_distribution_data = [];

var statisticsValues=[];

var preProcessData = []; // データ系列格納用

var checkData = [];


/*
 * 異常値などの検出とエラー表示
 */
function checkError() {
    var lastRst = [];
    for (var i=0; i< checkFunctionList.length; i++) {
        lastRst.push(true);
    }
    for (var i=0; i< checkData.length ; i++) {
        for (var j=0; j< checkFunctionList.length; j++) {
            var val = checkFunctionList[j](checkData[i],statisticsValues);
            if ((lastRst[j]==true) && (val==false)) {
                var time = new Date(checkData[i][0]*1000);
                document.getElementById('messages').innerHTML = document.getElementById('messages').innerHTML 
                    + time.toLocaleString('ja-JP') + ' - ' + alertMessages[j] +'<br>' ;
            }
            lastRst[j]=val;
        }
    }
};

/*
 * 実際にグラフを描画する関数
 */
function drawChart() {
    /*
     * 折れ線グラフ関連処理
     */
    var graphNum = lineChart_options.length;
    for (var i=0;i<graphNum;i++) {
        var label = 'curve_chart' + i.toString();
        var lineChartData = google.visualization.arrayToDataTable(graph_data[i]);
        lineChartData.setColumnProperty(0,'日時','datetime');
        var lineChart = new google.visualization.LineChart(document.getElementById(label));
        lineChart.draw(lineChartData, lineChart_options[i]);
    }
    /*
     * 統計値の表示
     */
    var dataKinds = statisticsOptions.length;
    for (var i=0; i< dataKinds;i++) {
        var label = 'dataName' + i.toString();
        document.getElementById(label).innerHTML = statisticsOptions[i]['label'];
        label = 'min' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][0] ;
        label = 'max' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][1] ;
        label = 'median' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][2] ;
        label = 'average' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][3] ;
        label = 'variance' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][4] ;
        label = 'standard_deviation' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][5] ;
        label = 'sample_variance' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][6] ;
        label = 'sample_standard_deviation' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][7] ;
        label = 'coefficient_variation' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][8] ;
        label = 'medAD' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][9] ;
        label = 'RMS' + i.toString();
        document.getElementById(label).innerHTML = statisticsValues[i][10] ;
        //
        label = 'frequency_distribution'+ i.toString();
        var frequencyDistributionData = google.visualization.arrayToDataTable(frequency_distribution_data[i]);
        var frequencyDistributionChart = new google.visualization.ColumnChart(document.getElementById(label));
        frequencyDistributionChart.draw(frequencyDistributionData, fdChart_options[i]);
    }
    /*
     * 散布図と相関係数の表示
     */
    dataKinds = correlation_options.length;
    for (var i=0; i< dataKinds; i++) {
        var label = 'scatter' + i.toString();
        correlationData[i][2].unshift(correlation_map[i]['label']);
        var correlationTable = google.visualization.arrayToDataTable(correlationData[i][2]);
        var correlationChart = new google.visualization.ScatterChart(document.getElementById(label));
        correlationChart.draw(correlationTable, correlation_options[i]);
        var correlationVal = ss.sampleCorrelation(correlationData[i][0], correlationData[i][1]).toFixed(numOfDigits);
        label = 'correlation' + i.toString();
        document.getElementById(label).innerHTML = correlationVal;
    }
    /*
     * 異常値などの警告事項のチェック
     */
    checkError();
}

/*
 * 複数のデータ系列を1つのグラフにまとめるために使う関数(時系列グラフ用)
 */
function mergeData() {
    for (var i=0; i<lineChart_map.length;i++ ) {
        graph_data.push([]);
    }
    for (var i=0; i<lineChart_map.length;i++ ) {
        var tmpArray = Array(lineChart_map[i]['dataSource'].length+1);
        tmpArray[0]= 'time';
        for (var j=0; j<lineChart_map[i]['dataSource'].length;j++ ) {
            tmpArray[j+1] = lineChart_map[i]['label'][j];
        }
        graph_data[i].push(tmpArray);
        for (var j=0; j<lineChart_map[i]['dataSource'].length ;j++) {
            var from = lineChart_map[i]['dataSource'][j];
            for (var k=0; k< preProcessData[from].length;k++) {
                var tmpArray2 = Array(lineChart_map[i]['dataSource'].length+1);
                for (var l=0; l<lineChart_map[i]['dataSource'].length+1;l++ ) {
                    tmpArray2[l]=null;
                }
                tmpArray2[0] = new Date(preProcessData[from][k][0]*1000);
                tmpArray2[j+1] = preProcessData[from][k][1]
                graph_data[i].push(tmpArray2);
            }
        }
    }
}

/*
 * エラーチェック用にデータ系列を整える関数
 */
function prepareCheckData() {
    var timeArray = [];
    for (var i=0 ; i<preProcessData[0].length;i++ ) {
        timeArray.push(preProcessData[0][i][0]);
    }
    for (var i=1; i< preProcessData.length;i++) {
        for (var j=0; j< preProcessData[i].length;j++) {
            var flag=false;
            for (var k=0; k< timeArray.length; k++) {
                if (timeArray[k] == preProcessData[i][j][0]) flag=true;
            }
            if (flag==false) timeArray.push(preProcessData[i][j][0]);
        }
    }
    timeArray = timeArray.sort((c1, c2) => (c1 > c2) ? 1 : (c1 < c2) ? -1 : 0);
    for (var i=0; i< timeArray.length; i++) {
        var tmp = [timeArray[i]];
        for (j=0; j< preProcessData.length; j++) {
            tmp.push(null);
        }
        checkData.push(tmp);
    }
    for (var i=0; i< preProcessData.length; i++) {
        for (var j=0; j<preProcessData[i].length;j++) {
            for (var k=0; k<checkData.length;k++) {
                if (preProcessData[i][j][0]==checkData[k][0]) checkData[k][i+1]=preProcessData[i][j][1]
            }
        }
    }
    var index = -1;
    for (var i=0; i<checkData.length; i++) {
        for (var j=1 ; j<checkData[i].length; j++ ) {
            if (checkData[i][j]==null) index = i;
        }
    }
    if (index != -1) {
        for (var i=0; i< index+1 ;i++) {
            checkData.shift();
        }
    }
}

/*
 * 相関関係を計算するためのデータを整える関数
 */
function prepareCorrelationData() { // correlationData
    for (var i=0; i<correlation_map.length;i++) {
        var first  = correlation_map[i]['dataSource'][0];
        var second = correlation_map[i]['dataSource'][1];
        var timeArray = [];
        for (var j=0; j<preProcessData[first].length;j++) {
            timeArray.push(preProcessData[first][j][0]);
        }
        for (var j=0; j<preProcessData[second].length;j++) {
            var flag=false;
            for (var k=0; k<timeArray.length;k++) {
                if (timeArray[k] == preProcessData[second][j][0]) flag=true;
            }
            if (flag==false) timeArray.push(preProcessData[second][j][0]);
        }
        let sorted = timeArray.sort((c1, c2) => (c1 > c2) ? 1 : (c1 < c2) ? -1 : 0);
        var workArray=[];
        for (var j=0; j<sorted.length;j++) {
            workArray.push([sorted[j], null , null]);
        }
        for (var j=0; j<preProcessData[first].length;j++) {
            for (var k=0; k<workArray.length;k++) {
                if (preProcessData[first][j][0]==workArray[k][0]) workArray[k][1]=preProcessData[first][j][1]
            }
        }
        for (var j=0; j<preProcessData[second].length;j++) {
            for (var k=0; k<workArray.length;k++) {
                if (preProcessData[second][j][0]==workArray[k][0]) workArray[k][2]=preProcessData[second][j][1]
            }
        }
        for (var j=1; j< 3; j++) {
            var oldVal=null;
            for (var k=0; k<workArray.length; k++) {
                if (workArray[k][j]==null) {
                    workArray[k][j]=oldVal;
                } else {
                    oldVal = workArray[k][j];
                }
            }
        }
        var index = -1;
        for (var j=0; j<workArray.length; j++) {
            if ((workArray[j][1]==null) || (workArray[j][2]==null)) {
                index = j;
            }
        }
        if (index != -1) {
            for (var j=0; j< index+1 ;j++) {
                workArray.shift();
            }
        }
        var firstArray = [];
        var secondArray = [];
        var pairArray = [];
        for (var j=0; j< workArray.length; j++) {
            firstArray.push(workArray[j][1]);
            secondArray.push(workArray[j][2]);
            pairArray.push([workArray[j][1], workArray[j][2]]);
        }
        correlationData.push([firstArray,secondArray, pairArray])
    }
}

/*
 * 各データ系列の統計値を計算する関数
 */
function calcStatistics() {
    var dataKinds = statisticsOptions.length;
    for (var i=0; i< dataKinds;i++) {
        var from = statisticsOptions[i]['dataSource'];
        var label = statisticsOptions[i]['label'];
        var len = preProcessData[from].length;
        var max = 0;
        var min = 0;
        var median = 0;
        var average = 0;
        var sum = 0;
        var work=[];
        for (var j=0; j< len; j++) {
            work.push(preProcessData[i][j][1]);
        }
        let sorted = work.sort((c1, c2) => (c1 < c2) ? 1 : (c1 > c2) ? -1 : 0);
        min = Math.floor(ss.min(work)*(10**numOfDigits))/(10**numOfDigits);
        max = Math.floor(ss.max(work)*(10**numOfDigits))/(10**numOfDigits);
        median = Math.floor(ss.median(work)*(10**numOfDigits))/(10**numOfDigits);
        average = Math.floor(ss.mean(work)*(10**numOfDigits))/(10**numOfDigits);
        var statistics = [];
        if (work.length < 2) {
            statistics = [min, max, median, average, '計算不可', '計算不可', '計算不可', '計算不可', '計算不可', '計算不可','計算不可' ];
        } else {
            statistics = [min, max, median, average,  Math.floor(ss.variance(work)*(10**numOfDigits))/(10**numOfDigits), 
                Math.floor(ss.standardDeviation(work)*(10**numOfDigits))/(10**numOfDigits), Math.floor(ss.sampleVariance(work)*(10**numOfDigits))/(10**numOfDigits), 
                Math.floor(ss.sampleStandardDeviation(work)*(10**numOfDigits))/(10**numOfDigits), Math.floor(ss.coefficientOfVariation(work)*(10**numOfDigits))/(10**numOfDigits), 
                Math.floor(ss.medianAbsoluteDeviation(work)*(10**numOfDigits))/(10**numOfDigits), Math.floor(ss.rootMeanSquare(work)*(10**numOfDigits))/(10**numOfDigits) ];
        }
        statisticsValues.push(statistics);
        var unit = Math.abs(max - min)/statisticsOptions[i]['statisticsUnits'];
        var tmpArray = [['階級値','度数']];
        for(var j=0; j<statisticsOptions[i]['statisticsUnits']+1;j++) {
            var pair=[0,0];
            pair[0]= ((min+j*unit)+ (min+(j+1)*unit))/2;
            for (var k=0; k<len; k++) {
                if ((sorted[k]>=(min+j*unit)) && (sorted[k]<(min+(j+1)*unit))) {
                    pair[1]++;
                }
            }
            tmpArray.push(pair);
        }
        frequency_distribution_data.push(tmpArray);
    }
}

/*
 * 各データ系列を元のデータから作成する関数群
 */
// 元データそのまま
function copy_Data(from, to) {
    preProcessData[to]=dataSource[from];
}

// データの変化量
function diff_Data(from, to) {
    var tmpArray=[];
    for (var i=1; i<dataSource[from].length;i++) {
        tmpArray.push([
            dataSource[from][i][0],
            dataSource[from][i][1]-dataSource[from][i-1][1]
        ]);
    };
    preProcessData[to]=tmpArray;
}

// データの変化の傾き
function slope_Data(from, to) {
    var tmpArray=[];
    for (var i=1; i<dataSource[from].length;i++) {
        var valueDiff = dataSource[from][i][1]-dataSource[from][i-1][1];
        var timeDiff = dataSource[from][i][0]-dataSource[from][i-1][0];
        tmpArray.push([
            dataSource[from][i][0],
            (valueDiff/timeDiff)
        ]);
    };
    preProcessData[to]=tmpArray;
}

// 移動平均
function sma_Data(from, to , n) {
    if (dataSource[from].length<n) {
        preProcessData[to]=[];
        return;
    }
    var tmpArray=[];
    for (var i=n-1; i<dataSource[from].length;i++) {
        var sum =0;
        for (var j=0;j<n;j++) {
            sum += dataSource[from][i-n+j+1][1];
        }
        tmpArray.push([dataSource[from][i][0], sum/n])
    }
    preProcessData[to]=tmpArray;
}

// 移動荷重平均
function lwma_Data(from, to , n) {
    if (dataSource[from].length<n) {
        preProcessData[to]=[];
        return;
    }
    var tmpArray=[];
    for (var i=n-1; i<dataSource[from].length;i++) {
        var sum =0;
        var denomi=0;
        for (var j=0;j<n;j++) {
            sum += dataSource[from][i-n+j+1][1]*(j+1);
            denomi += (j+1);
        }
        tmpArray.push([dataSource[from][i][0], sum/denomi])
    }
    preProcessData[to]=tmpArray;
}

// 下処理のメイン部分
function preProcess() {
    var sequences = preProcessOptions.length;
    for (var i=0; i<sequences ; i++ ) {
        var tmpArray=[];
        preProcessData.push(tmpArray);
    }
    for (var i=0; i<sequences ; i++ ) {
        var to = i;
        var from = preProcessOptions[i]['dataSource'];
        var preProcessMethod = preProcessOptions[i]['preprocess'];
        var option_n = preProcessOptions[i]['option']['n'];
        switch(preProcessMethod) {
            case 0: copy_Data(from,to);break;
            case 1: diff_Data(from,to);break;
            case 2: slope_Data(from,to);break;
            case 3: sma_Data(from,to,option_n);break;
            case 4: lwma_Data(from,to,option_n);break;
        }
    }
}


/*
 * CSVの中から，条件に合う(topic, センサ種別, センサID)ものだけを抽出する関数
 */
function selectData() {
    var sensorNum = target.length;
    var latestTime = data[data.length-1][3];
    var rangeFirstIndex = 0;
    if (timeRange!=0) {
        for (var i=0; i<data.length; i++ ) { // timeRange
            if (data[i][3] > (latestTime - timeRange)) {
                rangeFirstIndex = i;
                break;
            }
        }
    }
    var counter=0;
    for(var j=0;j<sensorNum;++j){
        sensor_type_val = target[j]['TYPE'];
        sensor_type_name = type[sensor_type_val];
        sensor_data_len = elements[sensor_type_name];
        //
        for (var i=0; i< sensor_data_len; i++) {
            dataSource.push([]);
        }
        //
        for(var i=rangeFirstIndex;i<data.length;++i){
            if (target[j]['ID'] == -1) {
                if ((data[i][index['TOPIC']]==target[j]['TOPIC']) && (parseInt(data[i][index['TYPE']])==target[j]['TYPE'])) {
                    for (var k=0;k<sensor_data_len;++k) {
                        var tmpArray = [];
                        tmpArray.push(parseInt(data[i][index['TIME']]));
                        tmpArray.push(parseFloat(data[i][index[sensor_type_name]+2*k]));
                        dataSource[counter+k].push(tmpArray);
                    }
                }
            } else {
                if ((data[i][index['topic']]==target[j]['TOPIC']) && (parseInt(data[i][index['TYPE']])==target[j]['TYPE']) && (parseInt(data[i][index['ID']])==target[j]['ID'])) {
                    for (var k=0;k<sensor_data_len;++k) {
                        var tmpArray = [];
                        tmpArray.push(parseInt(data[i][index['TIME']]));
                        tmpArray.push(parseFloat(data[i][index[sensor_type_name]+2*k]));
                        dataSource[counter+k].push(tmpArray);
                    }
                }
            }
        }
        counter=counter+sensor_data_len;
    }
    preProcess();
    calcStatistics();
    prepareCorrelationData();
    prepareCheckData();
    mergeData(graph_data);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}


/*
 * CSVファイルを読み込む関数
 */
function getCSV(){
    var req = new XMLHttpRequest();
    req.open("get", dataFileName, true);
    req.send(null);
    req.onload = function(){
	    data = convertCSVtoArray(req.responseText);
        selectData();
    }
}

/*
 * CSV形式を配列に分解する関数
 */
function convertCSVtoArray(str){
    var result = [];
    var tmp = str.split("\n");
    for(var i=1;i<tmp.length-1;++i){
        result[i-1] = tmp[i].split(/\s*\,\s*/);
    }
    return result;
}

async function getSQLite() {
	const sqlPromise = initSqlJs({
	  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
	});
	const dataPromise = fetch(dataFileName).then(res => res.arrayBuffer());
	const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
	const db = new SQL.Database(new Uint8Array(buf));
	let query = "SELECT * FROM sensorData";
	let contents = db.exec(query);
    for (var i=0; i< contents[0]['values'].length; i++) {
        var tmp = contents[0]['values'][i]
        tmp.shift()
        data.push(tmp)
    }
    selectData();
}

/*
 * メインの手続き
 */

if (fileType==0) {
    getCSV();
} else {
    getSQLite();
}