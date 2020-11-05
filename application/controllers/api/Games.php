<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Games class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

/**
 * 회원 가입과 관련된 controller 입니다.
 */
class Games extends CB_Controller
{

	/**
	 * 모델을 로딩합니다
	 */
	protected $models = array('Gpoint','Altruists','Altruists_cv', 'Member_nickname', 'Member_meta', 'Member_auth_email', 'Member_userid', 'Member_group_member', 'Member_group', 'Social_meta', 'Member_extra_vars');

	protected $modelname = 'Member_model';
	/**
	 * 헬퍼를 로딩합니다
	 */
	protected $helpers = array('form', 'array', 'string');

	function __construct()
	{
		parent::__construct();

		/**
		 * 라이브러리를 로딩합니다
		 */
		$this->load->library(array('pagination', 'querystring', 'form_validation', 'email', 'notelib', 'point'));

		if (!function_exists('password_hash')) {
			$this->load->helper('password');
		}
	}



	/**
	 * 최고 득점 포인트 가져오기
	 */
	public function get_highscore()
	{
		// 이벤트 라이브러리를 로딩합니다

		$view = array();
		$result = array();

	

		$result = $this->Gpoint_model->get_highscore('trex');
		$view['score'] = $result;
		response_result($view, 'success', 'OK');
	}
	/**
	 * 나의 포인트 가져오기
	 */
	public function get_myscore()
	{
		// 이벤트 라이브러리를 로딩합니다

		$view = array();
		$result = array();

		/* mem_nickname */
        if($this->member->item('mem_id') ) {

			$result = $this->Gpoint_model->get_myscore( $this->member->item('mem_id'),'trex');
			$view['score'] = $result;
			$view['nickname'] = $this->session->userdata('mem_nickname');
			response_result($view, 'success', 'OK');
		} else {
			response_result($view, 'Err', '로그인이 필요합니다.');
			
		 }
	}
	/**
	 *  이타주의자 프로필 목록입니다.
	 */
	public function lists($gam_type)
	{

		$result = array();
		$alt_area[] =array();
	
		/* 		
 		*/
		 $list  = $this->Gpoint_model->ranking_list($gam_type);
		 //사진을 넣기
		 if ($list) {
			foreach ($list as $key => $val) {
				
				if($val['photo']=="") {
					$val['thumb'] = '/assets/images/noimage.png';
				}else {
					$val['thumb'] = thumb_url('member_photo', element('photo', $val), 30);  //

				}
				$list[$key]= $val;
			
			}
		}
		$result['list'] = $list;
	

		//json api output
		response_result($result, 'success', '정상처리');
	}

	/**
	 *  이타주의자 경력 인증 처리
	 */
	public function credit()
	{

		$view = array();
		$result = array();
		//acv_status 0 - 비인증 , 1 - 인증
		$acv_id = $this->input->post('acv_id');
		$acv_status = $this->input->post('acv_status');
		if (empty($acv_id) or $acv_id < 1) {
			response_result($view, 'Err', 'acv_id 값이 누락 되었습니다.');
		}
		if ($acv_status) {
			response_result($view, 'Err', 'acv_status 값이 누락 되었습니다.');
		}
		//	$where_alt['alt_status'] = '0';
		$where_alt['acv_id'] = $acv_id;
		$alt_cv = $this->Altruists_model->get_alt_cv_by_id($acv_id);

		if (count($alt_cv) < 1) {
			response_result($view, 'Err', 'acv_id:' . $acv_id . ', 처리대상 없음');
		}
		$data = array(
			'acv_status' => $acv_status
		);

		$this->db->where('acv_id', $acv_id);

		$result = $this->db->update('alt_cv', $data);

		if ($result) {
			response_result($view, 'success', '정상처리');
		} else {
			response_result($view, 'Err', '데이터 저장 도중 오류가 발생하였습니다');
		}
	}
	public function save_myscore()
	{

		$view = array();
		$result = array();
		//acv_status 0 - 비인증 , 1 - 인증
		$gam_point = $this->input->post('gam_point');
		$gam_data = $this->input->post('gam_data');
		if (empty($gam_point) or $gam_point < 0) {
			response_result($view, 'Err', 'gam_point 값이 누락 되었습니다.');
		}
		if (empty($gam_data)) {
			response_result($view, 'Err', 'gam_data 값이 누락 되었습니다.');
		}
		if(!$this->member->item('mem_id')) response_result($view, 'Err', '로그인이 필요합니다.');
		$insertdata = array(
			'mem_id' => $this->member->item('mem_id'),
			'gam_content' => '게임 점수 저장',
			'gam_point' => $gam_point,
			'gam_type' => 'trex',
			'gam_data' => $gam_data,
			'gam_action' => 'trex 게임 종료',
		);
		$result = $this->Gpoint_model->insert($insertdata);

		if ($result) {
			response_result($view, 'success', '정상처리');
		} else {
			response_result($view, 'Err', '데이터 저장 도중 오류가 발생하였습니다');
		}
	}


}