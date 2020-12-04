<?php
defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Altruists class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

/**
 * 팝업과 관련된 controller 입니다.
 */
class Popup extends CB_Controller
{

	/**
	 * 모델을 로딩합니다
	 */
	protected $models = array('Altruists','Altruists_cv', 'Member_nickname', 'Member_meta', 'Member_auth_email', 'Member_userid', 'Member_group_member', 'Member_group', 'Social_meta', 'Member_extra_vars');

	/**
	 * 헬퍼를 로딩합니다
	 */
	protected $helpers = array( 'array', 'string');

	function __construct()
	{
		parent::__construct();
        $this->CI = & get_instance();
		/**
		 * 라이브러리를 로딩합니다
		 */
		$this->load->model(array('Popup_model'));

		if (!function_exists('password_hash')) {
			$this->load->helper('password');
		}
    }

    public function get_popup_list(){

		$today_popup_data=$this->CI->Popup_model->get_today_list();
        return response_result($today_popup_data);
        
    }

}
?>