<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Altruists model class
 *
 * Copyright (c) CIBoard <www.ciboard.co.kr>
 *
 * @author CIBoard (develop@ciboard.co.kr)
 */

class Altruists_model extends CB_Model
{

	/**
	 * 테이블명
	 */
	public $_table = 'alt_profile';
	public $_table_cv = 'alt_cv';
	public $_table_area = 'alt_area';
	public $_table_cate = 'alt_cate';

	/**
	 * 사용되는 테이블의 프라이머리키
	 */
	public $primary_key = 'alt_id'; // 사용되는 테이블의 프라이머리키

	public $search_sfield = '';

	function __construct()
	{
		parent::__construct();
	}


	public function get_alt_cate($act_use = 1, $select = '')
	{
		$this->db->from('alt_cate');
		$this->db->where('act_use', $act_use);
		$result = $this->db->get();
		return $result->result_array();

	}
	public function get_alt_cv($alt_id = 0, $select = '')
	{
		$this->db->from('cb_alt_cv');
		$this->db->where('alt_id', $alt_id);
		$result = $this->db->get();
		return $result->result_array();

	}
	public function cb_alt_area($alt_id = 0)
	{
		$this->db->from('cb_alt_area');
		$this->db->join('alt_cate', 'alt_cate.act_id = cb_alt_area.act_id', 'left');
		$this->db->where('alt_id', $alt_id);
		$result = $this->db->get();
		return $result->result_array();
	}
	public function get_by_memid($memid = 0, $select = '')
	{
		$memid = (int) $memid;
		if (empty($memid) OR $memid < 1) {
			return false;
		}
		$where = array('mem_id' => $memid);
		return $this->get_one('', $select, $where);
	}


	public function get_by_userid($userid = '', $select = '')
	{
		if (empty($userid)) {
			return false;
		}
		$where = array('mem_id' => $userid);
		return $this->get_one('', $select, $where);
	}


	public function get_by_email($email = '', $select = '')
	{
		if (empty($email)) {
			return false;
		}
		$where = array('mem_email' => $email);
		return $this->get_one('', $select, $where);
	}


	public function get_by_both($str = '', $select = '')
	{
		if (empty($str)) {
			return false;
		}
		if ($select) {
			$this->db->select($select);
		}
		$this->db->from($this->_table);
		$this->db->where('mem_userid', $str);
		$this->db->or_where('mem_email', $str);
		$result = $this->db->get();
		return $result->row_array();
	}


	public function get_superadmin_list($select='')
	{
		$where = array(
			'mem_is_admin' => 1,
			'mem_denied' => 0,
		);
		$result = $this->get('', $select, $where);

		return $result;
	}


	public function get_admin_list($limit = '', $offset = '', $where = '', $like = '', $findex = '', $forder = '', $sfield = '', $skeyword = '', $sop = 'OR')
	{
		/* $join = array();
		if (isset($where['mgr_id'])) {
			$select = 'member.*';
			$join[] = array('table' => 'member_group_member', 'on' => 'member.mem_id = member_group_member.mem_id', 'type' => 'left');
		} */
		$result = $this->_get_list_common($select = '', $join, $limit, $offset, $where, $like, $findex, $forder, $sfield, $skeyword, $sop);

		return $result;
	}
	public function get_alt_member_ids()
	{
		
		$result = $this->_get_list_common($select = '', $join, $limit, $offset, $where, $like, $findex, $forder, $sfield, $skeyword, $sop);

		//return $result;
	}


	public function get_register_count($type = 'd', $start_date = '', $end_date = '', $orderby = 'asc')
	{
		if (empty($start_date) OR empty($end_date)) {
			return false;
		}
		$left = ($type === 'y') ? 4 : ($type === 'm' ? 7 : 10);
		if (strtolower($orderby) !== 'desc') $orderby = 'asc';

		$this->db->select('count(*) as cnt, left(mem_register_datetime, ' . $left . ') as day ', false);
		$this->db->where('left(mem_register_datetime, 10) >=', $start_date);
		$this->db->where('left(mem_register_datetime, 10) <=', $end_date);
		$this->db->where('mem_denied', 0);
		$this->db->group_by('day');
		$this->db->order_by('mem_register_datetime', $orderby);
		$qry = $this->db->get($this->_table);
		$result = $qry->result_array();

		return $result;
	}
}
