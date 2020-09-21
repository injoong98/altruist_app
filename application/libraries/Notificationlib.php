<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Notificationlib class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

/**
 * 알림 기능을 관리하는 class 입니다.
 */
class Notificationlib extends CI_Controller
{

	private $CI;

	function __construct()
	{
		$this->CI = & get_instance();
		$this->CI->load->model( array('Notification_model'));
		$this->CI->load->helper( array('array'));
	}


	/**
	 * 알림 내용을 인서트하는 함수입니다
	 */
	public function set_noti($mem_id = 0, $target_mem_id = 0, $not_type = '', $not_content_id = '', $not_message = '', $not_url = '')
	{
		$mem_id = (int) $mem_id;
		$target_mem_id = (int) $target_mem_id;

		if (empty($mem_id) OR $mem_id < 1) {
			$result = json_encode( array('error' => 'mem_id 가 존재하지 않습니다'));
			return $result;
		}
		if (empty($not_type)) {
			$result = json_encode( array('error' => 'not_type 가 존재하지 않습니다'));
			return $result;
		}
		if (empty($not_content_id)) {
			$result = json_encode( array('error' => 'not_content_id 가 존재하지 않습니다'));
			return $result;
		}
		if ($mem_id === $target_mem_id) {
			$result = json_encode( array('error' => 'mem_id 와 target_mem_id 이 같으므로 알림을 저장하지 않습니다'));
			return $result;
		}
		if (empty($not_message)) {
			$result = json_encode( array('error' => '알림 내용이 존재하지 않습니다'));
			return $result;
		}
		if (empty($not_url)) {
			$result = json_encode( array('error' => '알림 URL이 존재하지 않습니다'));
			return $result;
		}

		// 알림 기능을 사용을 하지 않는다면 return
		if ( ! $this->CI->cbconfig->item('use_notification')) {
			$result = json_encode( array('error' => '알림을 사용하지 않는 사이트입니다'));
			return $result;
		}
		switch ($not_type) {
			case 'reply':
				if ( ! $this->CI->cbconfig->item('notification_reply')) {
					$result = json_encode( array('error' => '답변글에 알림 기능을 사용하지 않습니다'));
					return $result;
				}
				break;
			case 'comment':
				if ( ! $this->CI->cbconfig->item('notification_comment')) {
					$result = json_encode( array('error' => '댓글에 알림 기능을 사용하지 않습니다'));
					return $result;
				}
				break;
			case 'comment_comment':
				if ( ! $this->CI->cbconfig->item('notification_comment_comment')) {
					$result = json_encode( array('error' => '댓글의 댓글에 알림 기능을 사용하지 않습니다'));
					return $result;
				}
				break;
			case 'note':
				if ( ! $this->CI->cbconfig->item('notification_note')) {
					$result = json_encode( array('error' => '쪽지에 알림 기능을 사용하지 않습니다'));
					return $result;
				}
				break;
			default :
				$result = json_encode( array('error' => 'TYPE 이 잘못되었습니다'));
				return $result;

		}
		
		$insertdata = array(
			'mem_id' => $mem_id,
			'target_mem_id' => $target_mem_id,
			'not_type' => $not_type,
			'not_content_id' => $not_content_id,
			'not_message' => $not_message,
			'not_url' => $not_url,
			'not_datetime' => cdate('Y-m-d H:i:s'),
		);
		$not_id = $this->CI->Notification_model->insert($insertdata);
		$result = json_encode( array('success' => '알림이 저장되었습니다'));
		$this->request_fcm($not_type,$not_message,$mem_id);

		return $result;
	}

	public function request_fcm($title,$body,$target='')
	{
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

		$notification["title"] = $title;
		$notification["body"] = $body;
		$arr_post["notification"] = $notification;
		
		if($target!=''){
			$this->CI->db->select('ptk_token');
			$query =  $this->CI->db->get_where('cb_push_token',array('mem_id'=>$target));
			if($query!=false){
				$target_info=$query->result_array();
			}
		}
		foreach($target_info as $ti){
			
			$arr_post["to"] = $ti['ptk_token'];

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
			$json_data = json_decode($curl_data,true);
		}
		//$to = $target

		//배열을 JSON데이터로 생성

		//받은 JSON데이터를 배열로 만듬
		//배열 제어
		// if($json_data["result"] == "200"){
		// 	$cnt = 0;
		// 	foreach($json_data["msg"] as $msg_data){
		// 		foreach($msg_data as $msgval_data){
		// 			//msg_val값만 출력합니다.
		// 			echo 'gd';
		// 			$cnt++;
		// 		}
		// 	}
		// }
		return true;
	}
}
