<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * push_token model class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

class Push_token_model extends CB_Model
{

	/**
	 * 테이블명
	 */
	public $_table = 'Push_token';

	/**
	 * 사용되는 테이블의 프라이머리키
	 */
	public $primary_key = 'ptk_id'; // 사용되는 테이블의 프라이머리키

	function __construct()
	{
		parent::__construct();
	}


	public function get_push_token_list($limit = '', $offset = '', $mem_id = 0, $nottype = '')
	{
		$mem_id = (int) $mem_id;
		if (empty($mem_id) OR $mem_id < 1) {
			return;
		}

		$this->db->select('push_token.*, member.mem_id, member.mem_userid, member.mem_nickname, member.mem_is_admin, member.mem_icon');
		$this->db->from($this->_table);
		$this->db->join('member', 'push_token.target_mem_id = member.mem_id', 'left');

		$this->db->where(array('push_token.mem_id' => $mem_id));
		if ($nottype === 'Y') {
			$this->db->where(array('not_read_datetime >' => '0000-00-00 00:00:00'));
		}
		if ($nottype === 'N') {
			$this->db->group_start();
			$this->db->where(array('not_read_datetime <=' => '0000-00-00 00:00:00'));
			$this->db->or_where(array('not_read_datetime' => null));
			$this->db->group_end();
		}

		$this->db->order_by('not_id', 'desc');
		if ($limit) {
			$this->db->limit($limit, $offset);
		}
		$qry = $this->db->get();
		$result['list'] = $qry->result_array();

		$this->db->select('count(*) as rownum');
		$this->db->from($this->_table);
		$this->db->join('member', 'push_token.target_mem_id = member.mem_id', 'left');
		$this->db->where(array('push_token.mem_id' => $mem_id));
		if ($nottype === 'Y') {
			$this->db->where(array('not_read_datetime >' => '0000-00-00 00:00:00'));
		}
		if ($nottype === 'N') {
			$this->db->group_start();
			$this->db->where(array('not_read_datetime <=' => '0000-00-00 00:00:00'));
			$this->db->or_where(array('not_read_datetime' => null));
			$this->db->group_end();
		}
		$qry = $this->db->get();
		$rows = $qry->row_array();
		$result['total_rows'] = $rows['rownum'];

		return $result;
	}


	public function unread_push_token_num($mem_id = 0)
	{
		$mem_id = (int) $mem_id;
		if (empty($mem_id) OR $mem_id < 1) {
			return;
		}

		$this->db->where(array('mem_id' => $mem_id ));
		$this->db->group_start();
		$this->db->where(array('not_read_datetime <=' => '0000-00-00 00:00:00'));
		$this->db->or_where(array('not_read_datetime' => null));
		$this->db->group_end();

		return $this->db->count_all_results($this->_table);
	}


	public function mark_read($not_id, $mem_id)
	{
		$where = array(
			'not_id' => $not_id,
			'mem_id' => $mem_id,
		);
		$updatedata = array(
			'not_read_datetime' => cdate('Y-m-d H:i:s'),
		);
		$this->db->where($where);
		$this->db->group_start();
		$this->db->where(array('not_read_datetime <=' => '0000-00-00 00:00:00'));
		$this->db->or_where(array('not_read_datetime' => null));
		$this->db->group_end();
		$this->db->set($updatedata);

		return $this->db->update($this->_table);
	}


	public function mark_allread($mem_id)
	{
		$where = array(
			'mem_id' => $mem_id,
		);
		$updatedata = array(
			'not_read_datetime' => cdate('Y-m-d H:i:s'),
		);
		$this->db->where($where);
		$this->db->group_start();
		$this->db->where(array('not_read_datetime <=' => '0000-00-00 00:00:00'));
		$this->db->or_where(array('not_read_datetime' => null));
		$this->db->group_end();
		$this->db->set($updatedata);

		return $this->db->update($this->_table);
	}
}
