<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Search class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

/**
 * 게시물 전체 검색시 필요한 controller 입니다.
 */
class Search extends CB_Controller
{

	/**
	 * 모델을 로딩합니다
	 */
	protected $models = array('Board', 'Board_group', 'Post', 'Post_file', 'Search_keyword');

	/**
	 * 헬퍼를 로딩합니다
	 */
	protected $helpers = array('form', 'array');

	function __construct()
	{
		parent::__construct();

		/**
		 * 라이브러리를 로딩합니다
		 */
		$this->load->library(array('pagination', 'querystring'));
	}


	/**
	 * 검색 페이지 함수입니다
	 */
	 public function index()
	{
		// 이벤트 라이브러리를 로딩합니다
		$eventname = 'event_search_index';
		$this->load->event($eventname);

		$view = array();
		$view['view'] = array();

		// 이벤트가 존재하면 실행합니다
		$view['view']['event']['before'] = Events::trigger('before', $eventname);

		/**
		 * 페이지에 숫자가 아닌 문자가 입력되거나 1보다 작은 숫자가 입력되면 에러 페이지를 보여줍니다.
		 */
		$param =& $this->querystring;
		$page = (((int) $this->input->get('page')) > 0) ? ((int) $this->input->get('page')) : 1;
		$findex = 'post_num, post_reply';
		$sfield = $sfield2 = $this->input->get('sfield', null, '');
		$sop = $this->input->get('sop', null, '');
		if ($sfield === 'post_both') {
			$sfield = array('post_title', 'post_content');
		}

		$mem_id = (int) $this->member->item('mem_id');

		$skeyword = $this->input->get('skeyword', null, '');
		if (empty($skeyword)) {

			response_result($view, 'Err', '키워드를 입력하세요.');
		}


		/**
		 * 게시판 목록에 필요한 정보를 가져옵니다.
		 */
		$this->Post_model->allow_search_field = array('post_title', 'post_content', 'post_userid', 'post_nickname'); // 검색이 가능한 필드
		$this->Post_model->search_field_equal = array('post_userid'); // 검색중 like 가 아닌 = 검색을 하는 필드

		$per_page = 15;
		$offset = ($page - 1) * $per_page;

		$group_id = (int) $this->input->get('group_id') ? (int) $this->input->get('group_id') : '';
		$board_id = (int) $this->input->get('board_id') ? (int) $this->input->get('board_id') : '';

		$where = array();
		$boardwhere = array(
			'brd_search' => 1,
		);
		if ($group_id) {
			$where['board.bgr_id'] = $group_id;
			$boardwhere['board.bgr_id'] = $group_id;
		}

		$boardlisttmp = $this->Board_model->get_board_list($boardwhere);
		$boardlist = array();
		if (is_array($boardlisttmp)) {
			foreach ($boardlisttmp as $key => $value) {
				$boardlist[$value['brd_id']] = $value;
			}
		}
		$grouplisttmp = $this->Board_group_model
			->get('', '', '', '', 0, 'bgr_order', 'ASC');
		if (is_array($grouplisttmp)) {
			foreach ($grouplisttmp as $key => $value) {
				$grouplist[$value['bgr_id']] = $value;
			}
		}
		$where['post.post_secret'] = 0;
		$where['post.post_del'] = 0;
		$like = '';
		$result = $this->Post_model
			->get_search_list($per_page, $offset, $where, $like, $board_id, $findex, $sfield, $skeyword, $sop);
		$list_num = $result['total_rows'] - ($page - 1) * $per_page;
		if (element('list', $result)) {
			foreach (element('list', $result) as $key => $val) {
				$images = '';
				if (element('post_image', $val)) {
					$imagewhere = array(
						'post_id' => element('post_id', $val),
						'pfi_is_image' => 1,
					);
					$images = $this->Post_file_model
						->get_one('', '', $imagewhere, '', '', 'pfi_id', 'ASC');
				}
				$result['list'][$key]['images'] = $images;
				$result['list'][$key]['post_url'] = post_url(element('brd_key', $val), element('post_id', $val));

				if (element('mem_id', $val) >= 0) {
					if(element('post_anoymous_yn', $val)) {// 익명글일경우에는 익명 표기
						$result['list'][$key]['display_name'] = '익명';
						$result['list'][$key]['post_nickname'] = '익명';
						$result['list'][$key]['post_username'] = '익명';
					}else {
						$result['list'][$key]['display_name'] = element('post_nickname', $val);
						// display_username(
						// 	element('post_userid', $val),
						// 	element('post_nickname', $val),
						// 	($use_sideview_icon ? element('mem_icon', $val) : ''),
						// 	($use_sideview ? 'Y' : 'N')
						// );
					}
				} else {
					$result['list'][$key]['display_name'] = '익명';
				}







				/* $result['list'][$key]['display_name'] = display_username(
					element('post_userid', $val),
					element('post_nickname', $val),
					element('mem_icon', $val),
					'Y'
				); */
				$result['list'][$key]['display_datetime'] = display_datetime(element('post_datetime', $val), 'user', 'Y-m-d H:i');
				$result['list'][$key]['content'] = cut_str(strip_tags(element('post_content', $val)),200);
				$result['list'][$key]['is_mobile'] = (element('post_device', $val) === 'mobile') ? true : false;
			}
		}

		$view['view']['data'] = $result;

		$view['view']['boardlist'] = $boardlist;
		$view['view']['grouplist'] = $grouplist;


		if ( ! $this->session->userdata('skeyword_' . urlencode($skeyword))) {
			$sfieldarray = array('post_title', 'post_content', 'post_both');
			if (in_array($sfield2, $sfieldarray)) {
				$searchinsert = array(
					'sek_keyword' => $skeyword,
					'sek_datetime' => cdate('Y-m-d H:i:s'),
					'sek_ip' => $this->input->ip_address(),
					'mem_id' => $mem_id,
				);
				$this->Search_keyword_model->insert($searchinsert);
				$this->session->set_userdata(
					'skeyword_' . urlencode($skeyword),
					1
				);
			}
		}
		$highlight_keyword = '';
		if ($skeyword) {
			$key_explode = explode(' ', $skeyword);
			if ($key_explode) {
				foreach ($key_explode as $seval) {
					if ($highlight_keyword) {
						$highlight_keyword .= ',';
					}
					$highlight_keyword .= '\'' . html_escape($seval) . '\'';
				}
			}
		}
		$view['view']['highlight_keyword'] = $highlight_keyword;

		/**
		 * primary key 정보를 저장합니다
		 */
		$view['view']['primary_key'] = $this->Post_model->primary_key;

		/**
		 * 페이지네이션을 생성합니다
		 */
		$config['base_url'] = site_url('search/') . '?' . $param->replace('page');
		$view['view']['tab_url'] = site_url('search/') . '?' . $param->replace('page, board_id');
		$config['total_rows'] = $result['total_rows'];
		$config['per_page'] = $per_page;
		if ($this->cbconfig->get_device_view_type() === 'mobile') {
			$config['num_links'] = 3;
		} else {
			$config['num_links'] = 5;
		}
		$this->pagination->initialize($config);
		$view['view']['paging'] = $this->pagination->create_links();
		$view['view']['page'] = $page;

		//json api output
		response_result($view);
		
	}
}
