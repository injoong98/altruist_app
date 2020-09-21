<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Push class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

/**
 * 알림 기능을 관리하는 class 입니다.
 */
class Pushlib extends CI_Controller
{

	private $CI;

	function __construct()
	{
		$this->CI = & get_instance();
		$this->CI->load->model( array('Push_token_model'));
		$this->CI->load->helper( array('array'));
	}


	/**
	 * 알림 내용을 인서트하는 함수입니다
	 */
	public function set_push($mem_id = 0, $target_mem_id = 0, $not_type = '', $not_content_id = '', $not_message = '', $not_url = '',$push_type='' ,$topic_name ='')
	{
		$mem_id = (int) $mem_id;
		$target_mem_id = (int) $target_mem_id;
		$error_msg =''; //에러 메시지
		if (empty($mem_id) OR $mem_id < 1) {
			$error_msg = 'mem_id 가 존재하지 않습니다';
		}
		if (empty($not_type)) {
			$error_msg = 'not_type 가 존재하지 않습니다';
		}
		if (empty($not_content_id)) {
			$error_msg = 'not_content_id 가 존재하지 않습니다';
		}
		if ($mem_id === $target_mem_id) {
			$error_msg = 'mem_id 와 target_mem_id 이 같으므로 알림을 저장하지 않습니다';
		}
		if (empty($not_message)) {
			$error_msg = '알림 내용이 존재하지 않습니다';
		}
		if (empty($not_url)) {
			$error_msg = '알림 URL이 존재하지 않습니다';
		}

		// 알림 기능을 사용을 하지 않는다면 return
		if ( ! $this->CI->cbconfig->item('use_notification')) {
			$error_msg = '알림을 사용하지 않는 사이트입니다';
		}
		switch ($not_type) {
			case 'reply':
				if ( ! $this->CI->cbconfig->item('notification_reply')) {
					$error_msg = '답변글에 알림 기능을 사용하지 않습니다';
				}
				break;
			case 'comment':
				if ( ! $this->CI->cbconfig->item('notification_comment')) {
					$error_msg = '댓글에 알림 기능을 사용하지 않습니다';
				}
				break;
			case 'comment_comment':
				if ( ! $this->CI->cbconfig->item('notification_comment_comment')) {
					$error_msg = '댓글의 댓글에 알림 기능을 사용하지 않습니다';
				}
				break;
			case 'note':
				if ( ! $this->CI->cbconfig->item('notification_note')) {
					$error_msg = '쪽지에 알림 기능을 사용하지 않습니다';
				}
				break;

			case '이타주의자들':
				if ( ! $this->CI->cbconfig->item('use_push')) {
					$error_msg = '푸시 기능을 사용하지 않습니다';
				}
				break;
			default :
				$error_msg = 'TYPE 이 잘못되었습니다';
		}
		if($error_msg != ''){

			response_result(json_encode($error_msg),'Err',json_encode($error_msg));
		}	


		$pushdata = array(

			'mem_id' => $target_mem_id,
			'target_id' => $mem_id,
			'title' => $not_type,
			'not_content_id' => $not_content_id,
			'body' => $not_message,
			'not_url' => $not_url,
			'not_datetime' => cdate('Y-m-d H:i:s'),
			'push_type' => $push_type, // token 또는 topic 
			'topic_name' => $topic_name // topic 명 
		);
		$this->request_fcm($pushdata);
	}

	public function request_fcm($pushdata)
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
		$to = array(); 
		$arr_post = array();

		$arr_post["notification"] = $pushdata;
		
		if($pushdata['target_id']!='' && $pushdata['push_type'] =='token' ){ // token 방식 
			$this->CI->db->select('ptk_token');
			$query =  $this->CI->db->get_where('cb_push_token',array('mem_id'=>$pushdata['target_id']));
			if($query!=false){
				$target_info=$query->result_array();
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

		}else { //topic 명
				
				$arr_post["to"] = $pushdata['topic_name'];
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


		return $json_data;

	}
}
