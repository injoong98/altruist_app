
<?php
//---------------------CURL를 활용하여 JSON데이터를 POST방식으로 요청하여 JSON데이터로 받기--------------------

//요청 서버 URL 셋팅
$url = "https://fcm.googleapis.com/fcm/send";

//추가할 헤더값이 있을시 추가하면 됨
$headers = array(
		"content-type: application/json",
        "Authorization:key=AAAAfUVz-JA:APA91bHzuN3V122s197CG8EjU8icxXch8cQp5uKKjP3onBt210q1VqXcieDCih6zgmdbON_7UhlAihVFZOW2FxIhoM2V43PgndTbqA2qalUQqpd4BF1jeTfYzGY_ttAiYEFvcKhp17-d"
);

//POST방식으로 보낼 JSON데이터 생성
$notification = array();
$to = array();
$arr_post = array();

$notification["title"] = "from php servser";
$notification["body"] = "from php servser";

$arr_post["notification"] = $notification;

$to = "/topics/weather";

$arr_post["to"] = $to;

//배열을 JSON데이터로 생성
echo 'gd';
$post_data = json_encode($arr_post);
 
//CURL함수 사용
$ch=curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
//header값 셋팅(없을시 삭제해도 무방함)
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
//POST방식
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POST, true);
//POST방식으로 넘길 데이터(JSON데이터)
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);

if(curl_error($ch)){
    $curl_data = null;
} else {
    $curl_data = $response;
}

curl_close($ch);

//받은 JSON데이터를 배열로 만듬
$json_data = json_decode($curl_data,true);
//배열 제어
if($json_data["result"] == "200"){
	$cnt = 0;
	foreach($json_data["msg"] as $msg_data){
		foreach($msg_data as $msgval_data){
			//msg_val값만 출력합니다.
			echo 'gd';
			$cnt++;
		}
	}
}

exit;
?>;